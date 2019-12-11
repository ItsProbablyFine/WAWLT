function createNode(html) {
  let div = document.createElement('div');
  div.innerHTML = html;
  return div.firstChild;
}

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
  for (let authorGoal of authorGoals) {
    const scoreFromThisGoal = evaluatePotentialActionPerAuthorGoal(potentialAction, authorGoal);
    if (scoreFromThisGoal > 0) {
      potentialAction.authorGoals.push(authorGoal);
    }
    overallScore += scoreFromThisGoal;
  }
  potentialAction.score = overallScore;
  return overallScore;
}

function renderActionTagline(action, bindings) {
  let tagline = action.tagline || '';
  console.log(bindings);
  for (let i in action.lvars) {
    tagline = tagline.split('?' + action.lvars[i]).join(bindings[i]);
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

function runSuggestedAction(suggested) {
  // run selected action in simulation
  const event = Sim.runAction(suggested.action, suggested.bindings);
  // add new entry to bottom of transcript, with default text from selected action
  transcriptUI.appendChild(createNode(`<div class="entry">
    <div class="defaultdesc">${event.text}</div>
    <div class="userdesc" contenteditable data-default-text="Your description here..."></div>
  </div>`));
  // get and render new suggested actions
  renderSuggestedActions();
}

function renderSuggestedActions() {
  // clear any previous suggestions
  suggestedActionsUI.innerHTML = '';
  // query sim for new recommended actions (TODO move this logic into sim module?)
  const filterString = filterStringInput.value;
  const suggestedActions = Sim.getSuggestedActions().filter(a => actionMatchesFilterString(a, filterString));
  suggestedActions.forEach(evaluatePotentialAction);
  suggestedActions.sort((a, b) => b.score - a.score);
  // add new suggested actions to suggestedActionsUI
  for (let i = 0; i < suggestedActions.length && i < 5; i++) {
    const suggested = suggestedActions[i];
    const node = createNode(`<div class="suggested-action">
      ${renderActionTagline(suggested.action, suggested.bindings)}
      <!--${suggested.action.name} (${Object.values(suggested.bindings).join(', ')})-->
    </div>`);
    node.onclick = function() {
      runSuggestedAction(suggested);
    };
    suggestedActionsUI.appendChild(node);
  }
}

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

let authorGoals = [
  {type: "castSuspicionOnCharacter", params: [Sim.getAllCharacterNames()[0]]},
  {type: "escalateTensionBetweenValues", params: ["comfort", "survival"]}
];

function renderAuthorGoalEditor() {
  const charNames = Sim.getAllCharacterNames();
  let html = `<div class="author-goal-editor-inner">
  <h3>Current author goals</h3>
  <div class="author-goals">`;
  for (let i in authorGoals) {
    const authorGoal = authorGoals[i];
    html += `<div class="author-goal" data-index="${i}">
    <select class="type-select">`
    for (let goalType of Object.values(authorGoalTypes)) {
      html += `<option value="${goalType.type}"${authorGoal.type === goalType.type ? " selected" : ""}>
      ${goalType.text}
      </option>`;
    }
    html += `</select>`;

    const goalType = authorGoalTypes[authorGoal.type];
    for (let j in goalType.params) {
      // decide which options we should offer for this parameter, based on its type
      let paramOptions;
      if (goalType.params[j] === "character") {
        paramOptions = Sim.getAllCharacterNames(); // TODO insert empty option
      }
      else if (goalType.params[j] === "value") {
        paramOptions = allValues; // TODO insert empty option - need to clone allValues for this
      }
      else {
        console.error("No such author goal param type!", goalType.params[j], goalType);
      }
      // build <select> HTML for this parameter
      html += `<select class="param-select" data-index="${j}">`;
      for (let option of paramOptions) {
        html += `<option value="${option}"${authorGoal.params[j] === option ? " selected" : ""}>
        ${option}
        </option>`;
      }
      html += `</select>`;
    }

    html += `<button class="delete-button">x</button>
    </div>`;
  }
  html += `<button class="author-goal new-button">New goal</button>
  </div>
  <button class="set-author-goals-button">Set author goals</button>
  </div>;`
  authorGoalEditorUI.innerHTML = html;
  // onclick handler: button for creating new author goals
  const newAuthorGoalButton = document.querySelector(".author-goal.new-button");
  newAuthorGoalButton.onclick = function() {
    authorGoals.push({type: "introduceFalseLead", params: []});
    renderAuthorGoalEditor();
  };
  // onclick handlers: buttons for deleting existing author goals
  for (let deleteAuthorGoalButton of document.querySelectorAll(".author-goal .delete-button")) {
    deleteAuthorGoalButton.onclick = function(ev) {
      const index = parseInt(ev.target.parentNode.dataset.index); // get index from parent
      authorGoals.splice(index, 1); // delete author goal at index
      renderAuthorGoalEditor();
    };
  }
  // onclick handler: button for closing author goals editor
  const setAuthorGoalsButton = document.querySelector(".set-author-goals-button");
  setAuthorGoalsButton.onclick = function() {
    authorGoalEditorUI.classList.remove("visible");
  };
  // onchange handlers: <select> elements for changing author goal types
  for (let authorGoalTypeSelect of document.querySelectorAll(".author-goal .type-select")) {
    authorGoalTypeSelect.onchange = function(ev) {
      const select = ev.target;
      const index = parseInt(select.parentNode.dataset.index); // get index from parent
      const goalTypeName = select.options[select.selectedIndex].value;
      authorGoals[index].type = goalTypeName;
      // populate initial goal params as well
      authorGoals[index].params = [];
      for (let paramType of authorGoalTypes[goalTypeName].params) {
        if (paramType === "character") {
          authorGoals[index].params.push(Sim.getAllCharacterNames()[0]);
        } else if (paramType === "value") {
          authorGoals[index].params.push("comfort");
        } else {
          console.warn(`Invalid author goal param type: ${paramType}`);
          authorGoals[index].params.push("");
        }
      }
      renderAuthorGoalEditor();
    };
  }
  // onchange handlers: <select> elements for changing individual parameters of existing goals
  for (let authorGoalParamSelect of document.querySelectorAll(".author-goal .param-select")) {
    authorGoalParamSelect.onchange = function(ev) {
      const select = ev.target;
      const goalIndex = parseInt(select.parentNode.dataset.index);
      const paramIndex = parseInt(select.dataset.index);
      authorGoals[goalIndex].params[paramIndex] = select.options[select.selectedIndex].value;
      renderAuthorGoalEditor();
    }
  }
}

openAuthorGoalEditorButton.onclick = function(){
  authorGoalEditorUI.classList.add("visible");
  renderAuthorGoalEditor();
};

rerollSuggestedActionsButton.onclick = renderSuggestedActions;
filterStringInput.onchange = renderSuggestedActions;
renderSuggestedActions();
