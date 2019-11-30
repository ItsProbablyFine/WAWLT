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

rerollSuggestedActionsButton.onclick = renderSuggestedActions;
filterStringInput.onchange = renderSuggestedActions;
renderSuggestedActions();
