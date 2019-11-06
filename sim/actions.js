registerAction('betray', {
  tagline: '?n1: Betray ?n2',
  where: [
    '?dislike "type" "attitude"',
    '?dislike "charge" "negative"',
    '?dislike "source" ?c1',
    '?dislike "target" ?c2',
    '?c1 "name" ?n1',
    '?c2 "name" ?n2',
    '(not= ?c1 ?c2)' // in case we want to permit self-dislike but not self-betrayal :(
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c2,
    effects: [
      {type: 'addAttitude', charge: 'negative', source: vars.c2, target: vars.c1}
    ],
    text: "🔪 Out of nowhere, " + vars.n1 + " betrayed " + vars.n2 + "!"
  })
});

registerAction('hangOutWith', {
  tagline: '?n1: Hang out with ?n2',
  where: [
    '?c1 "name" ?n1',
    '?c2 "name" ?n2',
    '(not= ?c1 ?c2)',
    '?a1 "type" "affection"',
    '?a1 "source" ?c1',
    '?a1 "target" ?c2',
    '?a2 "type" "affection"',
    '?a2 "source" ?c2',
    '?a2 "target" ?c1'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c2,
    effects: [
      {type: 'addAttitude', charge: 'positive', source: vars.c2, target: vars.c1},
      {type: 'addAttitude', charge: 'positive', source: vars.c1, target: vars.c2},
      {type: 'changeAffectionLevel', affection:vars.a1, amount:1},
      {type: 'changeAffectionLevel', affection:vars.a2, amount:1}
    ],
    text: "🍦 " + vars.n1 + " and " + vars.n2 +
          " hung out together at the " + randNth(['boba','ice cream','pizza']) + " place."
  })
});

registerAction('seeCuteAnimal', {
  tagline: '?n1: See cute animal',
  where: [
    '?c1 "name" ?n1'
  ],
  event: (vars) => ({
    actor: vars.c1,
    text: "🐶 " + vars.n1 + " saw a cute " + randNth(['dog','cat','snake']) + "."
  })
});

let allProjectTypes = ['art','craft','poetry','programming','research','writing'];

registerAction('startProject', {
  tagline: '?n1: Start new project',
  where: [
    '?c1 "name" ?n1'
  ],
  event: function(vars){
    let projectType = randNth(allProjectTypes);
    return {
      actor: vars.c1,
      // TODO need to specify project: somehow, but can't, because its ID is only generated
      // once the effects are run
      effects: [
        {type: 'startProject', owner: vars.c1, projectType: projectType}
      ],
      text: "🎨 " + vars.n1 + " started a new " + projectType + " project!",
      tags: ['projects']
    };
  }
});

registerAction('makeProgressOnProject', {
  tagline: '?n1: Make progress on project ?proj',
  where: [
    '?c1 "name" ?n1',
    '?proj "owner" ?c1',
    '?proj "projectType" ?projtype',
    '?proj "state" "active"'
  ],
  event: (vars) => ({
    actor: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'increaseProjectDrama', project: vars.proj, amount: 1}
    ],
    text: "🎨 " + vars.n1 + " made a lot of progress on their " + vars.projtype + " project.",
    tags: ['projects']
  })
});

registerAction('workFruitlesslyOnProject', {
  tagline: '?n1: Work fruitlessly on project ?proj',
  where: [
    '?c1 "name" ?n1',
    '?proj "owner" ?c1',
    '?proj "projectType" ?projtype',
    '?proj "state" "active"'
  ],
  event: (vars) => ({
    actor: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'increaseProjectDrama', project: vars.proj, amount: 1}
    ],
    text: "🎨 " + vars.n1 + " tried to work on their " + vars.projtype + " project, but got nowhere.",
    tags: ['projects']
  })
});

registerAction('abandonProject', {
  tagline: '?n1: Abandon project ?proj',
  where: [
    '?c1 "name" ?n1',
    '?proj "owner" ?c1',
    '?proj "projectType" ?projtype',
    '?proj "state" "active"'
  ],
  event: (vars) => ({
    actor: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'updateProjectState', project: vars.proj, newState: 'inactive'},
      {type: 'increaseProjectDrama', project: vars.proj, amount: 2}
    ],
    text: "🎨 " + vars.n1 + " gave up on their " + vars.projtype + " project.",
    tags: ['projects']
  })
});

registerAction('resumeProject', {
  tagline: '?n1: Resume work on project ?proj',
  where: [
    '?c1 "name" ?n1',
    '?proj "owner" ?c1',
    '?proj "projectType" ?projtype',
    '?proj "state" "inactive"'
  ],
  event: (vars) => ({
    actor: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'updateProjectState', project: vars.proj, newState: 'active'},
      {type: 'increaseProjectDrama', project: vars.proj, amount: 2}
    ],
    text: "🎨 " + vars.n1 + " started working on their " + vars.projtype + " project again!",
    tags: ['projects']
  })
});

registerAction('finishProject', {
  tagline: '?n1: Finish project ?proj',
  where: [
    '?c1 "name" ?n1',
    '?proj "owner" ?c1',
    '?proj "projectType" ?projtype',
    '?proj "state" "active"',
    '?proj "dramaLevel" ?d',
    '(>= ?d 5)'
  ],
  event: (vars) => ({
    actor: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'updateProjectState', project: vars.proj, newState: 'finished'}
    ],
    text: "🎨 " + vars.n1 + " finished their " + vars.projtype + " project!",
    tags: ['projects']
  })
});

registerAction('showProject_loved', {
  tagline: '?n1: Show project ?proj to ?n2, who reacts positively',
  where: [
    '?c1 "name" ?n1',
    '?proj "owner" ?c1',
    '?proj "projectType" ?projtype',
    '?proj "state" "active"',
    '?c2 "type" "char"',
    '?c2 "name" ?n2',
    '(not= ?c1 ?c2)'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c2,
    project: vars.proj,
    effects: [
      {type: 'addAttitude', charge: 'positive', source: vars.c1, target: vars.c2},
      {type: 'increaseProjectDrama', project: vars.proj, amount: 1}
    ],
    text: "🎨 " + vars.n1 + " showed their " + vars.projtype + " project to " + vars.n2 + ", who loved it ☺️",
    tags: ['projects']
  })
});

registerAction('showProject_neutral', {
  tagline: '?n1: Show project ?proj to ?n2, who reacts neutrally',
  where: [
    '?c1 "name" ?n1',
    '?proj "owner" ?c1',
    '?proj "projectType" ?projtype',
    '?proj "state" "active"',
    '?c2 "type" "char"',
    '?c2 "name" ?n2',
    '(not= ?c1 ?c2)'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c2,
    project: vars.proj,
    effects: [
      {type: 'increaseProjectDrama', project: vars.proj, amount: 1}
    ],
    text: "🎨 " + vars.n1 + " showed their " + vars.projtype + " project to " + vars.n2 +
          ", who was kinda meh about it 😐",
    tags: ['projects']
  })
});

registerAction('showProject_hated', {
  tagline: '?n1: Show project ?proj to ?n2, who reacts negatively',
  where: [
    '?c1 "name" ?n1',
    '?proj "owner" ?c1',
    '?proj "projectType" ?projtype',
    '?proj "state" "active"',
    '?c2 "type" "char"',
    '?c2 "name" ?n2',
    '(not= ?c1 ?c2)'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c2,
    project: vars.proj,
    effects: [
      {type: 'addAttitude', charge: 'negative', source: vars.c2, target: vars.c1},
      {type: 'increaseProjectDrama', project: vars.proj, amount: 1}
    ],
    text: "🎨 " + vars.n1 + " showed their " + vars.projtype + " project to " + vars.n2 + ", who hated it 😡",
    tags: ['projects']
  })
});

registerAction('getDiscouraged', {
  tagline: '?n1: Consider restarting project ?proj, but recall ?n2\'s criticisms and give up',
  where: [
    // ?e1: ?c1 shows ?proj to ?c2, who hates it
    '?e1 "eventType" "showProject_hated"',
    '?e1 "actor" ?c1',
    '?e1 "project" ?proj',
    '?e1 "target" ?c2',
    // ?e2: ?c1 abandons ?proj
    '?e2 "eventType" "abandonProject"',
    '?e2 "actor" ?c1',
    '?e2 "project" ?proj',
    // ?proj is currently inactive; ?e1 happens before ?e2
    '?proj "state" "inactive"',
    '(< ?e1 ?e2)',
    // extra information for display purposes
    '?proj "projectType" ?projtype',
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: (vars) => ({
    actor: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'increaseProjectDrama', project: vars.proj, amount: 1}
    ],
    text: "🎨 " + vars.n1 + " considered restarting their abandoned " + vars.projtype +
          " project, but then remembered " + vars.n2 + "'s negative remarks and decided to leave it alone.",
    tags: ['projects']
  })
});
