'use strict';

const e = React.createElement;

const appState = {
  actions: Sim.getAllActions()
};

function renderUI() {
  ReactDOM.render(e(App, appState), document.getElementById('app'));
}

// Utility functions

// Given an action's lvars array (["c1", "n1"]), return a dictionary of lvars to fake values 
// (the lvar names themselves)
function makeFakeVars(lvars) {
  var vars = {};
  lvars.forEach(lvar => {
    vars[lvar] = lvar;
  });
  return vars;
}

/// React components

function App(props) {
  console.log('-render called-');
  return e(ActionLibrary, props);
}

function ActionLibrary(props) {
  console.log("ActionLibrary props:", props);
  if (props.actions.length > 0) {
    return e('div', {className: 'action-library'},
      props.actions.map((action, idx) => e(Action, {key: idx, action}))
    );
  } else return null; // library only appears if at least one action registered to Felt
}

function Action(props) {
  let action = props.action;
  let event = props.action.event(makeFakeVars(props.action.lvars))
  console.log("Action event:", event);
  return e('div', {className: 'action-wrapper'},
    e('div', {className: 'action'},
      e('div', {className: 'name'}, props.action.name),
      e('div', {className: 'tagline'}, props.action.tagline),
      event.tags && event.tags.map((tag) => e(ActionTag, {key: tag, tag}))
    )
  );
}

function ActionTag(props) {
  return e('div', {className: 'tag'}, props.tag);
}

console.log(Sim.getAllActions());

/// launch the initial render
renderUI();
