// max effects here!

Felt.registerEffectHandler('addImpression', function(db, effect) {
  Felt.checkEffectKeys(effect, ['source', 'target', 'value'], ['tag', 'reason']);

  if (effect.value === 0) {
    const err = Error("addImpression effect value can't be 0!")
    err.effect = effect;
    throw err;
  }

  // get existing impressions from source to target
  let existingImpressions = Sim.getImpressions(db, effect.source, effect.target).map(id => getEntity(db, id));

  // only consider existing impressions with the same valence as the impression we're trying to add,
  // so that positive and negative impressions aren't competing for the same slots
  // (idk if we actually need to do this but it seems aesthetically desirable somehow)
  const newImpressionValence = Math.sign(effect.value);
  existingImpressions = existingImpressions.filter(imp => Math.sign(imp.value) === newImpressionValence);

  // sort existing impressions from smallest to largest absolute value,
  // so that the first one will always be the one to drop if we need to make room for the new impression
  existingImpressions.sort((a, b) => Math.abs(a.value) - Math.abs(b.value));
  const lowestValueExistingImpression = existingImpressions[0];

  // figure out what changes to make to the DB. two main questions we're trying to answer:
  // 1. should we add the new impression to the DB at all?
  // 2. if we add the new impression, do we have to drop the lowest-value existing impression to make room?
  const someSlotsEmpty = existingImpressions.length < 3;
  const newImpressionBeatsLowestValueExisting = !lowestValueExistingImpression || Math.abs(effect.value) >= Math.abs(lowestValueExistingImpression.value);
  const addNewImpression = someSlotsEmpty || newImpressionBeatsLowestValueExisting;
  const dropLowestValueExistingImpression = addNewImpression && !someSlotsEmpty;

  // if we're not actually adding the new impression to the DB, our work here is done – bail out early
  if (!addNewImpression) return db;

  // actually update the DB as needed
  if (addNewImpression) {
    let newImpressionObj = {
      type: 'impression',
      source: effect.source,
      target: effect.target,
      value: effect.value,
      // record the ID of the introspection event that produced this impression,
      // so we can get at the underlying causes later on
      cause: effect.cause
    }
    if (effect.tag) newImpressionObj.tag = effect.tag;
    // reason: short textual description of why this impression formed, from the perspective of c1
    if (effect.reason) newImpressionObj.reason = effect.reason;
    db = createEntity(db, newImpressionObj);
  }
  if (dropLowestValueExistingImpression) {
    console.log (`More than 3 ${newImpressionValence>0?"positive":"negative"} impressions held by \
${Sim.getCharacterNameByID(effect.source)} about ${Sim.getCharacterNameByID(effect.target)}, \
so dropping the lowest-magnitude one:`);
    console.log(lowestValueExistingImpression);
    db = deleteEntity(db, lowestValueExistingImpression[':db/id'][0]);
  }

  // update the overall numerical charge from source to target by summing new impression values
  const newImpressions = Sim.getImpressions(db, effect.source, effect.target).map(id => getEntity(db, id));
  const newCharge = newImpressions.map(imp => imp.value).reduce((a, b) => a + b, 0);
  const shipID = Sim.getRelationship(db, effect.source, effect.target);
  db = updateProperty(db, shipID, 'charge', newCharge);

  // return the updated DB
  return db;
});
