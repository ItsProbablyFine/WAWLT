Felt.registerEffectHandler('addAttitude', function(db, effect) {
  Felt.checkEffectKeys(effect, ['cause', 'charge', 'source', 'target']);
  return createEntity(db, {
    type: 'attitude',
    cause: effect.cause,
    charge: effect.charge,
    source: effect.source,
    target: effect.target
  });
});

Felt.registerEffectHandler('startProject', function(db, effect) {
  Felt.checkEffectKeys(effect, ['contributors', 'projectType', 'projectName']);
  db = createEntity(db, {
    type: 'project',
    projectName: effect.projectName,
    projectType: effect.projectType,
    projectContributor: effect.contributors,
    state: 'active',
    dramaLevel: 0
  });
  projectID = newestEID(db);
  return updateProperty(db, effect.cause, 'project', projectID);
});

Felt.registerEffectHandler('joinProject', function(db, effect) {
  Felt.checkEffectKeys(effect, ['project', 'contributor']);
  return updateProperty(db, effect.project, 'projectContributor', effect.contributor);
});

Felt.registerEffectHandler('leaveProject', function(db, effect) {
  Felt.checkEffectKeys(effect, ['project', 'contributor']);
  return deleteProperty(db, effect.project, 'projectContributor', effect.contributor);
});

Felt.registerEffectHandler('updateProjectState', function(db, effect) {
  Felt.checkEffectKeys(effect, ['project', 'newState']);
  return updateProperty(db, effect.project, 'state', effect.newState);
});

Felt.registerEffectHandler('increaseProjectDrama', function(db, effect) {
  Felt.checkEffectKeys(effect, ['project', 'amount']);
  let oldDramaLevel = getEntity(db, effect.project).dramaLevel;
  let newDramaLevel = oldDramaLevel + (effect.amount || 1);
  return updateProperty(db, effect.project, 'dramaLevel', newDramaLevel);
});

Felt.registerEffectHandler('changeAffectionLevel', function(db, effect) {
  Felt.checkEffectKeys(effect, ['affection', 'amount']);
  let oldAffectionLevel = getEntity(db, effect.affection).level;
  let newAffectionLevel = oldAffectionLevel + effect.amount;
  return updateProperty(db, effect.affection, 'level', newAffectionLevel);
});

Felt.registerEffectHandler('realizeLove', function(db, effect) {
  Felt.checkEffectKeys(effect, ['affection', 'romeo', 'juliet']);
  db = updateProperty(db, effect.affection, 'realizedLove', true);
  return updateProperty(db, effect.romeo, 'romanceTarget', effect.juliet);
});

Felt.registerEffectHandler('updateRomanceState', function(db, effect) {
  Felt.checkEffectKeys(effect, ['char1', 'char2', 'newState']);
  db = updateProperty(db, effect.char1, 'romanceState', newState);
  return updateProperty(db, effect.char2, 'romanceState', newState);
});

Felt.registerEffectHandler('changeAttitudeTowardSelf', function(db, effect) {
  Felt.checkEffectKeys(effect, ['target', 'amount']);
  let oldAttitude = getEntity(db, effect.target).attitudeTowardSelf || 0;
  let newAttitude = oldAttitude + effect.amount;
  return updateProperty(db, effect.target, 'attitudeTowardSelf', newAttitude);
});

Felt.registerEffectHandler('changePopularity', function(db, effect){
  Felt.checkEffectKeys(effect, ['target', 'amount']);
  let oldPopularity = getEntity(db, effect.target).popularity || 0;
  let newPopularity = oldPopularity + effect.amount;
  return updateProperty (db, effect.target, 'popularity' , newPopularity);
});
