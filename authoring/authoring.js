'use strict';

const e = React.createElement;

const appState = {
  actions: Sim.getAllActions()
};

function renderUI() {
  ReactDOM.render(e(App, appState), document.getElementById('app'));
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
  console.log("Action props:", props);
  return e('div', {className: 'action-wrapper'},
    e('div', {className: 'action'},
      e('div', {className: 'name'}, props.action.name),
      e('div', {className: 'tagline'}, props.action.tagline)
    )
  );
}

console.log(Sim.getAllActions());

/// launch the initial render
renderUI();
