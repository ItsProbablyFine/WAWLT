'use strict';

const e = React.createElement;

const appState = {
  chapters: [
    {
      id: 0,
      title: 'The Beginning',
      entries: [
        {id: 0, defaultDesc: 'Story started', userDesc: 'foo bar baz'},
        {id: 1, defaultDesc: 'Story continued', userDesc: 'testing'},
        {id: 2, defaultDesc: 'Story ended', userDesc: 'end'}
      ]
    },
    {
      id: 1,
      title: 'The Next One',
      entries: [
        {id: 0, defaultDesc: 'Chapter started', userDesc: 'foo bar baz'},
        {id: 1, defaultDesc: 'Chapter continued', userDesc: 'testing'},
        {id: 2, defaultDesc: 'Chapter ended', userDesc: 'end'}
      ]
    }
  ],
  currentAuthorGoals: [
    {type: "castSuspicionOnCharacter", params: [Sim.getAllCharacterNames()[0]]},
    {type: "escalateTensionBetweenValues", params: ["comfort", "survival"]},
    {type: "castSuspicionOnCharacter", params: [Sim.getAllCharacterNames()[0]]},
    {type: "escalateTensionBetweenValues", params: ["comfort", "survival"]}
  ],
  currentChapterID: 1,
  currentInspectorTab: 'characters',
  inspectorActive: true,
  suggestedActions: Sim.getSuggestedActions(),
  suggestionsFilterString: ''
};

function getCurrentChapter() {
  return appState.chapters[appState.currentChapterID];
}

function renderUI() {
  ReactDOM.render(e(App, appState), document.getElementById('app'));
}

/// author goal editor data

const allValues = ["comfort", "communalism", "science", "survival"];

const authorGoalTypes = {
  involveCharacterInPlot: {
    text: "Involve character in plot",
    params: ["character"],
    evaluate: function([char], event) {
      const charID = Sim.getCharacterIDByName(char);
      if (event.actor === charID) return 5;
      if (event.target === charID) return 5;
      return 0;
    }
  },
  castSuspicionOnCharacter: {
    text: "Cast suspicion on character",
    params: ["character"],
    evaluate: function([char], event) {
      const charID = Sim.getCharacterIDByName(char);
      if (event.eventType === "betray" && event.actor === charID) return 15;
      if (event.eventType === "betray" && event.target === charID) return 10;
      if (event.eventType === "showProject_hated" && event.target === charID) return 7;
      return 0;
    }
  },
  dispelSuspicionOnCharacter: {
    text: "Dispel suspicion on character",
    params: ["character"],
    evaluate: function(goalParams, event) {
      const castSuspicionScore = authorGoalTypes.castSuspicionOnCharacter.evaluate(goalParams, event);
      return -castSuspicionScore;
    }
  },
  escalateTensionBetweenCharacters: {
    text: "Escalate tension between characters",
    params: ["character", "character"],
    evaluate: function([char1, char2], event) {
      const charID1 = Sim.getCharacterIDByName(char1);
      const charID2 = Sim.getCharacterIDByName(char2);
      if (event.eventType === "betray" && event.actor === charID1 && event.target === charID2) return 20;
      if (event.eventType === "betray" && event.actor === charID2 && event.target === charID1) return 20;
      if (event.eventType === "showProject_hated" && event.actor === charID1 && event.target === charID2) return 10;
      if (event.eventType === "showProject_hated" && event.actor === charID2 && event.target === charID1) return 10;
      if (event.eventType === "showProject_loved" && event.actor === charID1 && event.target === charID2) return -10;
      if (event.eventType === "showProject_loved" && event.actor === charID2 && event.target === charID1) return -10;
      return 0;
    }
  },
  defuseTensionBetweenCharacters: {
    text: "Defuse tension between characters",
    params: ["character", "character"],
    evaluate: function(goalParams, event) {
      const escalateTensionScore = authorGoalTypes.escalateTensionBetweenCharacters.evaluate(goalParams, event);
      return -escalateTensionScore;
    }
  },
  escalateTensionBetweenValues: {
    text: "Escalate tension between values",
    params: ["value", "value"]
  },
  defuseTensionBetweenValues: {
    text: "Defuse tension between values",
    params: ["value", "value"]
  },
  introduceFalseLead: {
    text: "Introduce false lead",
    params: []
  },
  dismissFalseLead: {
    text: "Dismiss false lead",
    params: []
  }
};
for (let goalType of Object.keys(authorGoalTypes)) {
  authorGoalTypes[goalType].type = goalType;
}

/// action sorting

// Given a potential action and an author goal to evaluate it against,
// return a score representing this potential action's direct contribution to the goal.
// Currently we do this by counting how many results there are for the goal's query
// before and after this action is performed, then returning the difference.
function evaluatePotentialActionPerAuthorGoal(potentialAction, authorGoal) {
  const {action, bindings} = potentialAction;
  const event = Felt.realizeEvent(action, bindings);
  const goalType = authorGoalTypes[authorGoal.type];
  if (!goalType.evaluate) {
    console.warn(`No action evaluation heuristic defined for author goal type ${authorGoal.type}!`);
    return 0;
  }
  const score = goalType.evaluate(authorGoal.params, event, Sim.getDB());
  /*
  if (score !== 0) {
    console.log(potentialAction, authorGoal, score);
  }
  */
  return score;
}

// Given a potential action, evaluate it against all of the current game state conditions
// (including author goals and character goals),
// and update it with information about the goals it contributes to,
// returning an overall summary score reflecting how well this action fits the current state.
function evaluatePotentialAction(potentialAction) {
  potentialAction.authorGoals = [];
  let overallScore = 0;
  for (let authorGoal of appState.currentAuthorGoals) {
    const scoreFromThisGoal = evaluatePotentialActionPerAuthorGoal(potentialAction, authorGoal);
    if (scoreFromThisGoal > 0) {
      potentialAction.authorGoals.push({goal: authorGoal, score: scoreFromThisGoal});
    }
    overallScore += scoreFromThisGoal;
  }
  potentialAction.score = overallScore;
  return overallScore;
}

/// suggested action filtering

function renderActionTagline(action, bindings) {
  let tagline = action.tagline || '';
  // Sometimes there are lvars with longer names that include shorter lvar names as substrings.
  // If we substitute the shorter ones first, it'll mess up the substitution of the longer ones.
  // To work around this, we first sort the lvars by name length before performing substitution.
  const lvars = Object.keys(bindings).filter(x => Number.isNaN(parseInt(x))); // only non-numberish keys
  const sortedLvars = lvars.sort((a, b) => b.length - a.length);
  for (let lvar of sortedLvars) {
    tagline = tagline.split('?' + lvar).join(bindings[lvar]);
  }
  return tagline;
}

function actionMatchesFilterString(suggested, filterString) {
  // if no filter string specified, then all actions match – return true
  if (!filterString || filterString.trim() === '') return true;
  // render the action's tagline so we can check it against the filter string
  const renderedTagline = renderActionTagline(suggested.action, suggested.bindings);
  // split the filter string into parts and check whether the tagline includes each part
  const filterStringParts = filterString.split('|');
  for (let part of filterStringParts) {
    if (!renderedTagline.includes(part)) return false;
  }
  return true;
}

/// state change functions

function createChapter() {
  const nextChapterID = appState.currentChapterID + 1;
  appState.chapters.push({id: nextChapterID, title: '', entries: []})
  appState.currentChapterID = nextChapterID;
  renderUI();
}

function openAuthorGoalsEditor() {
  // TODO
}

function rerollActionSuggestions() {
  const suggestedActions = Sim.getSuggestedActions();
  suggestedActions.forEach(evaluatePotentialAction);
  suggestedActions.sort((a, b) => b.score - a.score);
  appState.suggestedActions = suggestedActions;
  renderUI();
}

function runSuggestedAction(suggested) {
  // run selected action in simulation
  const event = Sim.runAction(suggested.action, suggested.bindings);
  // add new entry to end of transcript, with default text from selected action
  const chapter = getCurrentChapter();
  chapter.entries.push({id: chapter.entries.length, defaultDesc: event.text, userDesc: '', event});
  // get and render new suggested actions
  rerollActionSuggestions();
}

function selectChapter(chapterID) {
  // TODO check whether the chapter we're trying to switch to actually exists, and complain if not
  appState.currentChapterID = chapterID;
  renderUI();
}

function selectInspectorTab(tabName) {
  // TODO check whether the inspector tab we're trying to switch to makes any kind of sense
  appState.currentInspectorTab = tabName;
  renderUI();
}

function setChapterTitle(newTitle) {
  const chapter = getCurrentChapter();
  chapter.title = newTitle;
  renderUI();
}

function setEntryText(entryID, newText) {
  const chapter = getCurrentChapter();
  const entry = chapter.entries[entryID];
  entry.userDesc = newText;

  // calculate new height for this entry's textarea
  fakeTranscriptTextarea.innerText = newText;
  entry.textareaHeight = fakeTranscriptTextarea.getBoundingClientRect().height;

  renderUI();
}

function setSuggestionsFilterString(newFilterString) {
  appState.suggestionsFilterString = newFilterString;
  renderUI();
}

function toggleAuthorGoalComplete(goalID) {
  // TODO check whether the goal we're trying to toggle actually exists, and complain if not
  const goal = appState.currentAuthorGoals[goalID];
  goal.isComplete = !goal.isComplete;
  renderUI();
}

/// React components

function App(props) {
  console.log('render called!');
  return e('div', {className: 'app'},
    e('div', {className: 'sidebyside'},
      e(TranscriptWrapper, props),
      e(SuggestionsWrapper, props),
    ),
    e(InspectorWrapper, props)
  );
}

function TranscriptWrapper(props) {
  const chapter = getCurrentChapter();
  return e('div', {className: 'transcript-wrapper'},
    // header with editable chapter title
    e('div', {className: 'transcript-header'},
      // bookmark tabs for switching between chapters
      e('div', {className: 'transcript-bookmarks'},
        props.chapters.map((chapter) => {
          return e('div', {
            className: 'transcript-bookmark' + (chapter.id === props.currentChapterID ? ' selected' : ''),
            key: chapter.id,
            onClick: () => selectChapter(chapter.id)
          }, chapter.id + 1);
        })
      ),
      // other header shit
      e('div', {className: 'sidebyside'},
        e('h3', null, `Chapter ${props.currentChapterID + 1}: `),
        e('input', {
          className: 'chapter-title',
          onChange: (ev) => setChapterTitle(ev.target.value),
          type: 'text',
          value: chapter.title
        })
      )
    ),
    // display of current author goals, including completion state
    e('div', {className: 'transcript-author-goals'},
      props.currentAuthorGoals.map((goal, idx) => e(TranscriptAuthorGoal, {key: idx, idx, goal})),
      e('button', {onClick: openAuthorGoalsEditor}, '⚙️')
    ),
    // actual transcript content
    e('div', {className: 'transcript'},
      chapter.entries.map((entry) => e(TranscriptEntry, {key: entry.id, entry}))
    )
  );
}

function TranscriptEntry(props) {
  return e('div', {className: 'entry'},
    e('div', {className: 'default-desc'}, props.entry.defaultDesc),
    e('textarea', {
      className: 'user-desc',
      onChange: (ev) => setEntryText(props.entry.id, ev.target.value),
      placeholder: 'Your description here...',
      style: {height: props.entry.textareaHeight ? props.entry.textareaHeight + 'px' : '1.17rem'},
      value: props.entry.userDesc
    })
  );
}

function TranscriptAuthorGoal(props) {
  const goalSpec = authorGoalTypes[props.goal.type];
  const goalClass= goalSpec.params[0] === 'value' ? 'value-goal' : 'char-goal';
  return e('div', {className: 'author-goal-wrapper'},
    e('span', {className: 'author-goal ' + goalClass},
      e('input', {
        checked: !!props.goal.isComplete, // !! casts missing values to bool, to suppress "uncontrolled component" warning
        onChange: () => toggleAuthorGoalComplete(props.idx),
        type: 'checkbox'
      }),
      props.goal.type + ' ' + props.goal.params.join(', '),  
    )
  );
}

function SuggestionsWrapper(props) {
  const suggestedActions = props.suggestedActions.filter(a => actionMatchesFilterString(a, props.suggestionsFilterString));
  return e('div', {className: 'suggestions-wrapper'},
    e('div', {className: 'sidebyside filter-suggestions'},
      e('h3', null, 'What comes next?'),
      e('input', {
        onChange: (ev) => setSuggestionsFilterString(ev.target.value),
        placeholder: 'search possible next actions',
        type: 'text',
        value: props.suggestionsFilterString
      }),
      e('button', {onClick: () => rerollActionSuggestions()}, 'reroll')
    ),
    e('div', {className: 'suggested-actions'},
      suggestedActions.slice(0, 5).map((suggested, idx) => e(SuggestedAction, {key: idx, suggested}))
    )
  );
}

function SuggestedAction(props) {
  return e('div', {className: 'suggested-action'},
    e('div', {
      className: 'tagline',
      onClick: () => runSuggestedAction(props.suggested)
    }, renderActionTagline(props.suggested.action, props.suggested.bindings))
    // TODO more
  );
}

const inspectorTabNames = [
  'characters', 'projects', 'institutions', 'relationships', 'situations', 'events'
];

function InspectorWrapper(props) {
  return e('div', {className: 'inspector-wrapper' + (props.inspectorActive ? ' active' : ' inactive')},
    e('div', {className: 'inspector-left-side'},
      e('h3', null, 'What\'s happening?'),
      // tab buttons
      e('div', {className: 'inspector-tab-buttons'},
        inspectorTabNames.map((tabName) => e(InspectorTabButton, {key: tabName, tabName}))
      )
    ),
    e('div', {className: 'inspector-tab ' + props.currentInspectorTab}, `the ${props.currentInspectorTab} tab`)
  );
}

function InspectorTabButton(props) {
  return e('button', {
    className: 'inspector-tab-button',
    onClick: () => selectInspectorTab(props.tabName)
  },
  props.tabName
  );
}

/// actually launch the initial render

renderUI();
