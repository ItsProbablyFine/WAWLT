Felt.registerAction('betray', {
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

Felt.registerAction('hangOutWith', {
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

Felt.registerAction('seeCuteAnimal', {
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

Felt.registerAction('startSoloProject', {
  tagline: '?n1: Start new project',
  where: [
    '?c1 "name" ?n1'
  ],
  event: function(vars){
    const projectType = randNth(allProjectTypes);
    const projectName = Sim.generateProjectName(projectType);
    return {
      actor: vars.c1,
      // TODO need to specify project: somehow, but can't, because its ID is only generated
      // once the effects are run
      effects: [
        {type: 'startProject', contributors: [vars.c1], projectType, projectName}
      ],
      text: `🎨 ${vars.n1} started a new project: "${projectName}"!`,
      tags: ['projects']
    };
  }
});

Felt.registerAction('startCollabProject', {
  tagline: '?n1 and ?n2: Start new collaborative project',
  where: [
    // you gotta like someone to voluntarily start a project with them
    '?like12 "type" "attitude"',
    '?like12 "charge" "positive"',
    '?like12 "source" ?c1',
    '?like12 "target" ?c2',
    // liking gotta be reciprocal
    '?like21 "type" "attitude"',
    '?like21 "charge" "positive"',
    '?like21 "source" ?c2',
    '?like21 "target" ?c1',
    // extra info for display purposes
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: function(vars){
    const projectType = randNth(allProjectTypes);
    const projectName = Sim.generateProjectName(projectType);
    return {
      actor: vars.c1,
      // TODO need to specify project: somehow, but can't, because its ID is only generated
      // once the effects are run
      effects: [
        {type: 'startProject', contributors: [vars.c1, vars.c2], projectType, projectName}
      ],
      text: `🎨 ${vars.n1} and ${vars.n2} started a new project together: "${projectName}"!`,
      tags: ['projects']
    };
  }
});

Felt.registerAction('persuadePersonToJoinProject', {
  tagline: '?n1: Persuade ?n2 to join project: "?projname"',
  where: [
    // there's an active project! ?c1 is on it!
    '?proj "projectContributor" ?c1',
    '?proj "state" "active"',
    // ?c2 is not!
    '?c2 "type" "char"', // gotta do this because apparently order of lvar declaration matters sometimes?
    '(not [?proj "projectContributor" ?c2])',
    // c1 likes c2 (wouldn't wanna recruit them otherwise!)
    '?like12 "type" "attitude"',
    '?like12 "charge" "positive"',
    '?like12 "source" ?c1',
    '?like12 "target" ?c2',
    // c2 likes c1 (wouldn't join otherwise!)
    '?like21 "type" "attitude"',
    '?like21 "charge" "positive"',
    '?like21 "source" ?c2',
    '?like21 "target" ?c1',
    // extra information for display purposes
    '?c1 "name" ?n1',
    '?c2 "name" ?n2',
    '?proj "projectName" ?projname'
  ],
  event: function(vars){
    console.log("persuadePersonToJoinProject", vars);
    return {
      actor: vars.c1,
      target: vars.c2,
      effects: [
        {type: 'joinProject', project: vars.proj, contributor: vars.c2}
      ],
      text: `🎨 ${vars.n1} persuaded ${vars.n2} to join their project, "${vars.projname}"!`,
      tags: ['projects']
    };
  }
});

Felt.registerAction('leaveProjectDueToWorkload', {
  tagline: '?n1: Leave project "?projname" due to having too much work to do',
  where: [
    // there's an active project! ?c1 is on it!
    '?proj "projectContributor" ?c1',
    '?proj "state" "active"',
    // extra information for display purposes
    '?c1 "name" ?n1',
    '?proj "projectName" ?projname'
  ],
  event: (vars) => ({
    actor: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'leaveProject', project: vars.proj, contributor: vars.c1}
    ],
    text: `🎨 ${vars.n1} left project "${vars.projname}" because they had too much work to do!`,
    tags: ['projects']
  })
});

Felt.registerAction('leaveProjectDueToPersonalDifferences', {
  tagline: '?n1: Leave project "?projname" due to disagreements with ?n2',
  where: [
    // there's an active project! ?c1 is on it!
    '?proj "projectContributor" ?c1',
    '?proj "projectContributor" ?c2',
    '?proj "state" "active"',
    // personal differences
    '?dislike "type" "attitude"',
    '?dislike "charge" "negative"',
    '?dislike "source" ?c1',
    '?dislike "target" ?c2',
    // extra information for display purposes
    '?c1 "name" ?n1',
    '?c2 "name" ?n2',
    '?proj "projectName" ?projname',
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c2,
    project: vars.proj,
    effects: [
      {type: 'leaveProject', project: vars.proj, contributor: vars.c1}
    ],
    text: `🎨 ${vars.n1} left project "${vars.projname}" because they don't like working with ${vars.n2}`,
    tags: ['projects']
  })
});

Felt.registerAction('makeProgressOnProject', {
  tagline: '?n1: Make progress on project "?projname"',
  where: [
    '?c1 "name" ?n1',
    '?proj "projectContributor" ?c1',
    '?proj "projectName" ?projname',
    '?proj "state" "active"'
  ],
  event: (vars) => ({
    actor: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'increaseProjectDrama', project: vars.proj, amount: 1}
    ],
    text: `🎨 ${vars.n1} made a lot of progress on "${vars.projname}".`,
    tags: ['projects']
  })
});

Felt.registerAction('workFruitlesslyOnProject', {
  tagline: '?n1: Work fruitlessly on project "?projname"',
  where: [
    '?c1 "name" ?n1',
    '?proj "projectContributor" ?c1',
    '?proj "projectName" ?projname',
    '?proj "state" "active"'
  ],
  event: (vars) => ({
    actor: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'increaseProjectDrama', project: vars.proj, amount: 1}
    ],
    text: `🎨 ${vars.n1} tried to work on "${vars.projname}", but got nowhere.`,
    tags: ['projects']
  })
});

// TODO abandonment shouldn't make project inactive if there's still non-abandoned contributors
Felt.registerAction('abandonProject', {
  tagline: '?n1: Abandon project "?projname"',
  where: [
    '?c1 "name" ?n1',
    '?proj "projectContributor" ?c1',
    '?proj "projectName" ?projname',
    '?proj "state" "active"'
  ],
  event: (vars) => ({
    actor: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'updateProjectState', project: vars.proj, newState: 'inactive'},
      {type: 'increaseProjectDrama', project: vars.proj, amount: 2}
    ],
    text: `🎨 ${vars.n1} gave up on "${vars.projname}".`,
    tags: ['projects']
  })
});

// TODO abandonment shouldn't make project inactive if there's still non-abandoned contributors
Felt.registerAction('resumeProject', {
  tagline: '?n1: Resume work on project "?projname"',
  where: [
    '?c1 "name" ?n1',
    '?proj "projectContributor" ?c1',
    '?proj "projectName" ?projname',
    '?proj "state" "inactive"'
  ],
  event: (vars) => ({
    actor: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'updateProjectState', project: vars.proj, newState: 'active'},
      {type: 'increaseProjectDrama', project: vars.proj, amount: 2}
    ],
    text: `🎨 ${vars.n1} started working on "${vars.projname} again!`,
    tags: ['projects']
  })
});

Felt.registerAction('finishProject', {
  tagline: '?n1: Put the finishing touches on project "?projname"',
  where: [
    '?c1 "name" ?n1',
    '?proj "projectContributor" ?c1',
    '?proj "projectName" ?projname',
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
    text: `🎨 ${vars.n1} finished project "${vars.projname}"!`,
    tags: ['projects']
  })
});

Felt.registerAction('showProject_loved', {
  tagline: '?n1: Show project "?projname" to ?n2, who reacts positively',
  where: [
    '?c1 "name" ?n1',
    '?proj "projectContributor" ?c1',
    '?proj "projectName" ?projname',
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
    text: `🎨 ${vars.n1} showed their project "${vars.projname}" to ${vars.n2}, who loved it ☺️`,
    tags: ['projects']
  })
});

Felt.registerAction('showProject_neutral', {
  tagline: '?n1: Show project "?projname" to ?n2, who reacts neutrally',
  where: [
    '?c1 "name" ?n1',
    '?proj "projectContributor" ?c1',
    '?proj "projectName" ?projname',
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
    text: `🎨 ${vars.n1} showed their project "${vars.projname}" to ${vars.n2}, who was kinda meh about it 😐`,
    tags: ['projects']
  })
});

Felt.registerAction('showProject_hated', {
  tagline: '?n1: Show project "?projname" to ?n2, who reacts negatively',
  where: [
    '?c1 "name" ?n1',
    '?proj "projectContributor" ?c1',
    '?proj "projectName" ?projname',
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
    text: `🎨 ${vars.n1} showed their project "${vars.projname}" to ${vars.n2}, who hated it 😡`,
    tags: ['projects']
  })
});

Felt.registerAction('getDiscouraged', {
  tagline: '?n1: Consider restarting project "?projname", but recall ?n2\'s criticisms and give up',
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
    '?proj "projectName" ?projname',
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: (vars) => ({
    actor: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'increaseProjectDrama', project: vars.proj, amount: 1}
    ],
    text: `🎨 ${vars.n1} considered restarting their abandoned project "${vars.projname}", \
but then remembered ${vars.n2}'s negative remarks and decided to leave it alone.`,
    tags: ['projects']
  })
});
