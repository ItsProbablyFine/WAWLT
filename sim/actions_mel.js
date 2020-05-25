// mel actions here!

// STANDALONE MUNDANE ACTIONS

Felt.registerAction('forgotToEat', {
  tagline: '?n1: Forget to eat lunch',
  where: [
    // c1 is a character
    '?c1 "type" "char"',
    // TODO maybe condition on an "absentminded" curse? or for 'buried in work' char status
    // or in an obsessive mode with respect to a project
    // extra info for display purposes
    '?c1 "name" ?n1'
  ],
  event: function(vars){
    return {
      actor: vars.c1,
      effects: [
      	// TODO maybe add a hungry status? so can have events that only happen when you're hungry
        //{type: 'addCharacterStatus', char: vars.c1, status: 'hungry'}
        // -> effect handler could add 'hungry' to array of statuses for this character?
      ],
      text: `${vars.n1} forgot to eat lunch`,
      tags: ['forgotSomething']
    };
  }
});

Felt.registerAction('outOfIdeas', {
	// a weird action because it's a spontaneous status change,
	// neither external nor traditional introspection
  tagline: '?n1: Run out of ideas',
  where: [
    // c1 is a character
    '?c1 "type" "char"',
    // extra info for display purposes
    '?c1 "name" ?n1'
  ],
  event: function(vars){
    return {
      actor: vars.c1,
      effects: [
        // TODO add temporary "creatively blocked" status to prevent them from starting new projects?
      ],
      text: `${vars.n1} is out of ideas`,
      tags: []
    };
  }
});

Felt.registerAction('cringeAtPastWork', {
  tagline: '?n1: Cringe at some of their past work',
  where: [
    // c1 is a character
    '?c1 "type" "char"',
    // extra info for display purposes
    '?c1 "name" ?n1'
  ],
  event: (vars) => ({
    actor: vars.c1,
    effects: [],
    text: `${vars.n1} reread one of their old ${randNth(['papers','blog posts','articles','essays','tweets'])} and cringed`,
    tags: []
  })
});

Felt.registerAction('cringeAtPastProject', {
  tagline: '?n1: Cringe at one of their old projects', // should this be an introspection?
  where: [
    // c1 is a char who contributed to a finished project
    '?c1 "type" "char"',
    '?proj "projectContributor" ?c1',
    '?proj "projectName" ?projname',
    '?proj "state" "finished"',
    // TODO it's been a while since proj was finished?
    // extra info for display purposes
    '?c1 "name" ?n1'
  ],
  event: (vars) => ({
    actor: vars.c1,
    effects: [], // TODO register that c1 feels negatively about proj? (if we want char-proj impressions)
    text: `${vars.n1} revisited "${vars.projname}" and cringed`,
    tags: []
  })
});

Felt.registerAction('diagramOnWhiteboard', {
  tagline: '?n1: Draw a sprawling diagram on the whiteboard', // should this be an introspection?
  where: [
    // c1 is a char
    '?c1 "type" "char"',
    // extra info for display purposes
    '?c1 "name" ?n1'
  ],
  event: (vars) => ({
    actor: vars.c1,
    effects: [], // TODO register there's a mysterious diagram on the whiteboard?
    text: `${vars.n1} drew a ${randNth(['sprawling','labyrinthine'])} diagram on the lab whiteboard`,
    tags: []
  })
});

// INSPIRATION SOURCES

Felt.registerAction('findInspirationInOldNotes', {
  tagline: '?n1: Go through old notes',
  where: [
    // c1 is a character
    '?c1 "type" "char"',
    // extra info for display purposes
    '?c1 "name" ?n1'
  ],
  event: (vars) => ({
    actor: vars.c1,
    effects: [],
    text: `${vars.n1} went through some of their old research notebooks for inspiration`,
    tags: ['inspiration']
  })
});

// PROJECT RELATED ACTIONS

Felt.registerAction('projectNightmare', {
  tagline: '?n1: Have nightmare about project ?projname',
  where: [
    // there's an active project to which c1 is a contributor
    '?proj "state" "active"',
    '?proj "projectContributor" ?c1',
    // TODO condition for negative events around proj?
    // extra info for display purposes
    '?proj "projectName" ?projname',
    '?c1 "name" ?n1'
  ],
  event: function(vars){
    return {
      actor: vars.c1,
      // should there be a project property here?
      effects: [],
      text: `${vars.n1} had a nightmare about "${vars.projname}"`,
      tags: []
    };
  }
});

// CHARACTER INTERACTIONS

Felt.registerAction('attemptConversation', {
  tagline: '?n1: Try to strike up a conversation with ?n2',
  where: [
    '?c1 "type" "char"',
    '?c2 "type" "char"',
    '(not= ?c1 ?c2)',
    // TODO c1 is awkward?
    // TODO c1 and c2 aren't super close?
    // TODO c1 admires/respects/thinks highly of/has a positive impression of c2?
    // extra info for display purposes
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: function(vars){
    return {
      actor: vars.c1,
      target: vars.c2,
      effects: [],
      text: `${vars.n1} tried to strike up a conversation with ${vars.n2} but couldn't come up with what to say so gave up and walked away`,
      reference: ``,
      tags: ['awkward']
    };
  }
});

Felt.registerAction('reflectPositivelyOnAwkwardness', {
  tagline: '[i] ?n1: Think about ?n2 being awkward',
  where: [
    '?c1 "type" "char"',
    '?c2 "type" "char"',
    '(not= ?c1 ?c2)',
    // an awkward event happened from c2 to c1
    '?e1 "tag" "awkward"', '?e1 "actor" ?c2', '?e1 "target" ?c1',
    // TODO c1 thinks positively of c2
    // extra info for display purposes
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: function(vars){
    return {
      actor: vars.c1,
      target: vars.c2,
      effects: [
      	{
      		type: 'addImpression', source: vars.c1, target: vars.c2, value: +1, tag: "awkward",
      		reason: `${vars.n2} did something awkward"`
      	},{
      		type: 'addImpression', source: vars.c1, target: vars.c2, value: +1, tag: "endearing",
      		reason: `${vars.n2} did something endearing`
      	} 
      ],
      text: `${vars.n1} thought about how ${vars.n2} is kinda awkward, but endearing`,
      tags: []
    };
  }
});

Felt.registerAction('tryToExplainProject', {
  tagline: '?n1: Try to explain their project to ?n2',
  where: [
    '?c1 "type" "char"',
    '?c2 "type" "char"',
    '(not= ?c1 ?c2)',
    '?proj "projectContributor" ?c1',
    '(not [?proj "projectContributor" ?c2])',
    '?proj "projectName" ?projname',
    '?proj "state" "active"',
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: function(vars){
    return {
      actor: vars.c1,
      target: vars.c2,
      effects: [],
      text: `${vars.n1} tried to explain "${vars.projname}" to ${vars.n2} but it didn't seem to get through`,
      reference: ``,
      tags: []
    };
  }
});

// DEBUGGING ACTIONS

/*
// a placeholder introspection action that can always be performed, for debugging
Felt.registerAction('placeholderIntrospection', {
  tagline: '[i] ?n1: randomly introspect about ?n2',
  where: [
    '?c1 "type" "char"',
    '?c2 "type" "char"',
    '(not= ?c1 ?c2)',
    // extra info for display purposes
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: function(vars){
    return {
      actor: vars.c1,
      target: vars.c2,
      effects: [
        {
        	type: 'addImpression', source: vars.c1, target: vars.c2, value: +1, //tag: "indifferent",
        	reason: `${vars.n2} did something awkward`
      	}
      ],
      text: `${vars.n1} randomly thought about ${vars.n2} and came to the conclusion that they have no opinion of them`,
      tags: []
    };
  }
});

// a placeholder introspection action that can always be performed, for debugging
Felt.registerAction('placeholderIntrospection2', {
  tagline: '[i] ?n1: randomly wonder about ?n2',
  where: [
    '?c1 "type" "char"',
    '?c2 "type" "char"',
    '(not= ?c1 ?c2)',
    // extra info for display purposes
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: function(vars){
    return {
      actor: vars.c1,
      target: vars.c2,
      effects: [
        {
        	type: 'addImpression', source: vars.c1, target: vars.c2, value: +2, tag: "whatever", 
        	reason: `${vars.n2} is pretty whatever`
      	}
      ],
      text: `${vars.n1} randomly wondered about ${vars.n2} and came to the conclusion that they're whatever`,
      tags: []
    };
  }
});

// a placeholder introspection action that can always be performed, for debugging
Felt.registerAction('placeholderIntrospection3', {
  tagline: '[i] ?n1: randomly contemplate ?n2',
  where: [
    '?c1 "type" "char"',
    '?c2 "type" "char"',
    '(not= ?c1 ?c2)',
    // extra info for display purposes
    '?c1 "name" ?n1',
    '?c2 "name" ?n2'
  ],
  event: function(vars){
    return {
      actor: vars.c1,
      target: vars.c2,
      effects: [
        {
        	type: 'addImpression', source: vars.c1, target: vars.c2, value: +3, tag: "bleh"
        	//,reason: `${vars.n2} is pretty bleh`
      	}
      ],
      text: `${vars.n1} randomly contemplated ${vars.n2} and came to the conclusion that they're bleh`,
      tags: []
    };
  }
});
*/

// GROUP INTERACTIONS

/*
Felt.registerAction('groupDinner', {
  tagline: '?n1, ?n2, and ?n3 all go out to eat together [Start groupconversation]', 
  // could we make the list of characters in tagline, event text, and effect property an arbitrary-length list?
  where: [
    '?c1 "type" "char"',
    '?c2 "type" "char"',
    '?c3 "type" "char"',
    '(not= ?c1 ?c2)',
    '(not= ?c2 ?c3)',
    '(not= ?c1 ?c3)',
    // extra info for display purposes
    '?c1 "name" ?n1',
    '?c2 "name" ?n2',
    '?c3 "name" ?n3'
  ],
  event: function(vars){
    return {
      // not a directed action so no actor/target? or multiple actors? 
      effects: [
        { // filter all subsequent available actions by "groupConversation" tag until endActionMode
        	type: 'startActionMode', allowedTags: ["groupConversation"], charactersPresent: [vars.c1, vars.c2, vars.c3]
        	// could even set up characters as having certain roles 
      	}
      ],
      text: `${vars.n1}, ${vars.n2}, and ${vars.n3} all go out to eat together`,
      tags: []
    };
  }
});
*/
