function createNode(html) {
  let div = document.createElement('div');
  div.innerHTML = html;
  return div.firstChild;
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
  // query sim for new recommended actions (TODO make this smarter, right now it's just random)
  const filterString = filterStringInput.value;
  const suggestedActions = Sim.getSuggestedActions().filter(a => actionMatchesFilterString(a, filterString));
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
  castSuspicionOnCharacter: {
    text: "Cast suspicion on character",
    params: ["character"]
  },
  dispelSuspicionOnCharacter: {
    text: "Dispel suspicion on character",
    params: ["character"]
  },
  escalateTensionBetweenCharacters: {
    text: "Escalate tension between characters",
    params: ["character", "character"]
  },
  defuseTensionBetweenCharacters: {
    text: "Defuse tension between characters",
    params: ["character", "character"]
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
  {type: "castSuspicionOnCharacter", params: ["Joe"]},
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
      authorGoals[index].type = select.options[select.selectedIndex].value;
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
