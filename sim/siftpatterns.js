Felt.registerSiftingPattern('movedAndMissingSomeone', [
  '?e1 eventType moved',
  '?e2 eventType missing-someone',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "moved"])'
]);

Felt.registerSiftingPattern('readAndGoodIdea', [
  '(or [?e1 "eventType" "read"]\
       [?e1 "eventType" "finished-book"])',
  '(or [?e2 "eventType" "good-idea"]\
       [?e2 "eventType" "realized-something"])',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)])'
]);

Felt.registerSiftingPattern('wentToPartyAndDinedOut', [
  '?e1 eventType went-to-party',
  '?e2 eventType dined-out',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "went-to-party"])'
]);

Felt.registerSiftingPattern('hobbyAndExercised', [
  '?e1 eventType hobby',
  '?e2 eventType exercised',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "hobby"])'
]);

Felt.registerSiftingPattern('niceConvoAndHeardFrom', [
  '?e1 eventType nice-convo',
  '?e2 eventType heard-from',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)])'

]);

Felt.registerSiftingPattern('playGameAndAvoidResponsibility', [
  '?e1 eventType played-game',
  '?e2 eventType avoided-responsibility',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)])'
]);

Felt.registerSiftingPattern('gotHelpAndFinishedWork', [
  '?e1 eventType got-help',
  '?e2 eventType finished-work',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "got-help"])'
]);

Felt.registerSiftingPattern('shoppedAndFeltExcited', [
  '?e1 eventType shopped',
  '?e2 eventType feeling-excited',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)])'
]);

Felt.registerSiftingPattern('wentHomeAndWatchedTV', [
  '?e1 eventType went-home',
  '?e2 eventType watched',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "went-home"])'
]);

Felt.registerSiftingPattern('daydreamedAndDidNothing', [
  '?e1 eventType daydreamed',
  '?e2 eventType did-nothing',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)])'
]);

Felt.registerSiftingPattern('helpedSomeoneAndNiceConvo', [
  '?e1 eventType helped-somone',
  '?e2 eventType nice-convo',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "helped-someone"])'
]);

Felt.registerSiftingPattern('hungOutAndChattedWithSomeone', [
  '?e1 eventType hung-out',
  '(or [?e2 "eventType" "chatted-with-someone"]\
       [?e2 "eventType" "chatted-with-stranger"])',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "hung-out"])'
]);

Felt.registerSiftingPattern('meditatedAndAdventures', [
  '?e1 eventType meditated',
  '?e2 eventType adventured',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "meditated"])'
]);

Felt.registerSiftingPattern('wasProductiveAndWentToAMeeting', [
  '?e1 eventType was-productive',
  '?e2 eventType work-meeting',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "was-productive"])'
]);

Felt.registerSiftingPattern('avoidedResponsibilityAndDidNothing', [
  '?e1 eventType avoided-responsibility',
  '?e2 eventType did-nothing',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "avoided-responsibility"])'
]);

Felt.registerSiftingPattern('sickAndMessedUp', [
  '?e1 eventType sick',
  '?e2 eventType messed-up',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "sick"])'
]);

Felt.registerSiftingPattern('studiedAndWasProductive', [
  '?e1 eventType studied',
  '?e2 eventType was-productive',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "studied"])'
]);

Felt.registerSiftingPattern('internetedAndDidNothing', [
  '?e1 eventType interneted',
  '?e2 eventType did-nothing',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "internet"])'
]);

Felt.registerSiftingPattern('productiveAndWorkMeeting', [
  '?e1 eventType was-productive',
  '?e2 eventType work-meeting',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "productive"])'
]);

Felt.registerSiftingPattern('hurtSelfAndMessedUp', [
  '?e1 eventType hurt-self',
  '?e2 eventType messed-up',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "hurt-self"])'
  ]);

Felt.registerSiftingPattern('hobbyAndMeditated', [
  '?e1 eventType productive',
  '?e2 eventType meditated',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "productive"])'
]);

Felt.registerSiftingPattern('choresAndWentToMeeting', [
  '?e1 eventType chores',
  '?e2 eventType went-to-meeting',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "chores"])'
]);

Felt.registerSiftingPattern('fightAndAngryWithMe', [
  '?e1 eventType fight',
  '?e2 eventType angry-with-me',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
    '(not-join [?c1 ?e1 ?e2]\
      [?eMid "actor" ?c1]\
      [(< ?e1 ?eMid ?e2)])'
]);

Felt.registerSiftingPattern('choresAndWentToClass', [
  '?e1 eventType chores',
  '?e2 eventType went-to-class',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "chores"])'
]);

Felt.registerSiftingPattern('chattedWithSomeoneAndSomeoneBothered', [
  '?e1 eventType chatted-with-someone',
  '?e2 eventType someone-bothered',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
    '(not-join [?c1 ?e1 ?e2]\
      [?eMid "actor" ?c1]\
      [(< ?e1 ?eMid ?e2)])'
]);

Felt.registerSiftingPattern('chattedWithSomeoneAndSomeoneWasJerk', [
  '?e1 eventType chatted-with-someone',
  '?e2 eventType someone-was-jerk',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
    '(not-join [?c1 ?e1 ?e2]\
      [?eMid "actor" ?c1]\
      [(< ?e1 ?eMid ?e2)])'
]);

Felt.registerSiftingPattern('chattedWithSomeoneAndWasMean', [
  '?e1 eventType chatted-with-someone',
  '?e2 eventType was-mean',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
    '(not-join [?c1 ?e1 ?e2]\
      [?eMid "actor" ?c1]\
      [(< ?e1 ?eMid ?e2)])'
]);

Felt.registerSiftingPattern('vacationedAndAdventured', [
  '?e1 eventType vacationed',
  '?e2 eventType adventured',
   '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "vacationed"])'
]);

Felt.registerSiftingPattern('tvAndLazy', [
  '?e1 eventType watched',
  '?e2 eventType lazy',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "watched"])'
]);

Felt.registerSiftingPattern('playedGamesAndLazy', [
  '?e1 eventType played-game',
  '?e2 eventType lazy',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
  '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "internet"])'
]);

Felt.registerSiftingPattern('playedGamesAndTV', [
  '?e1 eventType played-game',
  '?e2 eventType watched',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "played-game"])'
]);

Felt.registerSiftingPattern('sleptInAndLazy', [
  '?e1 eventType slept-in',
  '?e2 eventType lazy',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "slept-in"])'
]);

Felt.registerSiftingPattern('sleptInAndTV', [
  '?e1 eventType slept-in',
  '?e2 eventType watched',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "slept-in"])'
]);

Felt.registerSiftingPattern('sleptInAndPlayedGames', [
  '?e1 eventType slept-in',
  '?e2 eventType played-game',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "slept-in"])'
]);

Felt.registerSiftingPattern('visitedPeopleAndHungOutWith', [
  '?e1 eventType visited-people',
  '?e2 eventType hung-out-with',
  '(< ?e1 ?e2)',
  '?e1 actor ?c1',
  '?e2 actor ?c1',
  '?c1 name ?n1',
   '(not-join [?c1 ?e1 ?e2]\
    [?eMid "actor" ?c1]\
    [(< ?e1 ?eMid ?e2)]\
    [?eMid "eventType" "visited-people"])'
]);
