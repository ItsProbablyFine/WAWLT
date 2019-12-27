// max actions here!

/// RANDOM MINOR ACTIONS

Felt.registerAction('discussSharedValue', {
  tagline: '?n1: Discuss shared value of ?value with ?n2',
  where: [
    // c1 and c2 share a value
    '?c1 "value" ?value',
    '?c2 "value" ?value',
    // c1 and c2 aren't the same person
    '(not= ?c1 ?c2)',
    // extra info for display purposes
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c1,
    effects: [],
    text: `${vars.n1} discussed their shared value of ${vars.value} with ${vars.n2}`,
    tags: []
  })
});

/// INSPIRATION SOURCES

Felt.registerAction('consumeMedia', {
  tagline: '?n1: Consume a media artifact',
  where: [
    // c1 is a character
    '?c1 "type" "char"',
    // extra info for display purposes
    '?c1 "name" ?n1'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c1,
    effects: [],
    text: `${vars.n1} consumed a media artifact`,
    tags: ['inspiration']
  })
});

Felt.registerAction('thinkAboutResearch', {
  tagline: '?n1: Think about research',
  where: [
    // c1 is a character
    '?c1 "type" "char"',
    // extra info for display purposes
    '?c1 "name" ?n1'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c1,
    effects: [],
    text: `${vars.n1} thought about a research problem`,
    tags: ['inspiration']
  })
});

Felt.registerAction('discussResearch', {
  tagline: '?n1: Discuss research with ?n2',
  where: [
    // c1 and c2 are two different characters
    '?c1 "type" "char"',
    '?c2 "type" "char"',
    '(not= ?c1 ?c2)',
    // extra info for display purposes
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c2,
    effects: [],
    text: `${vars.n1} discussed research ideas with ${vars.n2}`,
    tags: ['inspiration']
  })
});

/// PROJECT DRAMA SEQUENCE

Felt.registerAction('worryAboutOwnProjectDrama', {
  tagline: '[i] ?n1: Stress out about project "?projname"',
  where: [
    // there's an active project to which c1 is a contributor
    '?proj "state" "active"',
    '?proj "projectContributor" ?c1',
    // three increaseProjectDrama events involving c1 and proj
    '?e1 "tag" "increaseProjectDrama"', '?e1 "actor" ?c1', '?e1 "project" ?proj',
    '?e2 "tag" "increaseProjectDrama"', '?e2 "actor" ?c1', '?e2 "project" ?proj',
    '?e3 "tag" "increaseProjectDrama"', '?e3 "actor" ?c1', '?e3 "project" ?proj',
    // events happened in order
    '(< ?e1 ?e2 ?e3)',
    // extra info for display purposes
    '?proj "projectName" ?projname',
    '?c1 "name" ?n1'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c1,
    project: vars.proj,
    effects: [],
    text: `${vars.n1} stressed out about their struggles with project "${vars.projname}"`,
    tags: ['projects', 'castDoubtOnProject']
  })
});

Felt.registerAction('worryAboutOthersProjectDrama', {
  tagline: '[i] ?n1: Notice that ?n2 is struggling with project "?projname"',
  where: [
    // there's an active project to which c2 is a contributor
    '?proj "state" "active"',
    '?proj "projectContributor" ?c2',
    // c1 is a character who likes c2
    '(likes ?c1 ?c2)',
    // three increaseProjectDrama events involving c2 and proj
    '?e1 "tag" "increaseProjectDrama"', '?e1 "actor" ?c2', '?e1 "project" ?proj',
    '?e2 "tag" "increaseProjectDrama"', '?e2 "actor" ?c2', '?e2 "project" ?proj',
    '?e3 "tag" "increaseProjectDrama"', '?e3 "actor" ?c2', '?e3 "project" ?proj',
    '(< ?e1 ?e2 ?e3)',
    // extra info for display purposes
    '?proj "projectName" ?projname',
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c2,
    project: vars.proj,
    effects: [],
    text: `${vars.n1} became concerned about ${vars.n2}'s struggles with project "${vars.projname}"`,
    tags: ['projects']
  })
});

Felt.registerAction('askAboutOthersProjectDrama', {
  tagline: '?n1: Ask ?n2 about their struggles with project "?projname"',
  where: [
    // existing worryAboutOthersProjectDrama event from c1 to c2
    '?e1 "eventType" "worryAboutOthersProjectDrama"',
    '?e1 "actor" ?c1',
    '?e1 "target" ?c2',
    '?e1 "project" ?proj',
    // TODO make sure e1 is recent enough?
    // TODO make sure we haven't already done this action recently?
    // extra info for display purposes
    '?proj "projectName" ?projname',
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c2,
    project: vars.proj,
    effects: [],
    text: `${vars.n1} asked ${vars.n2} about their struggles with project "${vars.projname}"`,
    tags: ['projects', 'castDoubtOnProject']
  })
});

Felt.registerAction('dismissProjectDoubt', {
  tagline: '[i] ?n1: Suppress doubt about "?projname"',
  where: [
    // there's an active project to which c1 is a contributor
    '?proj "state" "active"',
    '?proj "projectContributor" ?c1',
    // existing askAboutOthersProjectDrama event
    '?e1 "tag" "castDoubtOnProject"',
    '?e1 "target" ?c1',
    '?e1 "project" ?proj',
    // extra info for display purposes
    '?proj "projectName" ?projname',
    '?c1 "name" ?n1'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c1,
    project: vars.proj,
    effects: [],
    text: `${vars.n1} suppressed their doubts about project "${vars.projname}"`,
    tags: ['projects']
  })
});

Felt.registerAction('leaveProjectDueToDoubt', {
  tagline: '[i] ?n1: Leave project "?projname" due to stress',
  where: [
    // there's an active project! ?c1 is on it!
    '?proj "projectContributor" ?c1',
    '?proj "state" "active"',
    // c1 has doubted this project several times recently
    '?e1 "tag" "castDoubtOnProject"', '?e1 "target" ?c1', '?e1 "project" ?proj',
    '?e2 "tag" "castDoubtOnProject"', '?e2 "target" ?c1', '?e2 "project" ?proj',
    '?e3 "tag" "castDoubtOnProject"', '?e3 "target" ?c1', '?e3 "project" ?proj',
    '(< ?e1 ?e2 ?e3)',
    // TODO make sure events are recent enough?
    // extra info for display purposes
    '?proj "projectName" ?projname',
    '?c1 "name" ?n1'
  ],
  event: (vars) => ({
    actor: vars.c1,
    target: vars.c1,
    project: vars.proj,
    effects: [
      {type: 'leaveProject', project: vars.proj, contributor: vars.c1}
    ],
    text: `${vars.n1} left project "${vars.projname}" because it was stressing them out too much!`,
    tags: ['projects']
  })
});
