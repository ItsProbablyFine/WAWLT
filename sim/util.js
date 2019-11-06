/// UTILITY FUNCTIONS

// Return a random item from a list.
function randNth(items){
  return items[Math.floor(Math.random()*items.length)];
}

// Given a list of items that may contain duplicates,
// return an updated copy of the list without any duplicates.
function distinct(items){
  return items.filter((val, idx) => items.indexOf(val) === idx);
}

// Return a shuffled copy of a list, leaving the original list unmodified.
function shuffle(items) {
  const newItems = [];
  for (let i = 0; i < items.length; i++) {
    newItems.push(items[i]);
  }
  for (let i = newItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newItems[i], newItems[j]] = [newItems[j], newItems[i]];
  }
  return newItems;
}

// Given the DB, return the EID of the most recently added entity.
function newestEID(db){
  // FIXME there is probably a better way to do this
  let allDatoms = datascript.datoms(db, ':eavt');
  return allDatoms[allDatoms.length - 1].e;
}

// Given the DB and an EID, retrieve the corresponding entity as an object.
// This is what `datascript.entity(db, eid)` SHOULD do, but for some reason doesn't.
function getEntity(db, eid) {
  let propValuePairs = datascript.q('[:find ?prop ?val :where [' + eid + ' ?prop ?val]]', db);
  if (propValuePairs.length === 0) return null;
  let entity = {':db/id': eid};
  for (let [prop, val] of propValuePairs) {
    entity[prop] = val;
  }
  return entity;
}

// Given the DB and an entity, return an updated DB with the entity added.
function createEntity(db, entity) {
  // TODO assert entity is an object with only valid DB values
  entity[':db/id'] = -1;
  return datascript.db_with(db, [entity]);
}

// Given the DB, an EID, a property to update, and a value, return an updated DB
// with the property set to the given value in the specified entity.
function updateProperty(db, eid, prop, val) {
  // TODO assert eid is a valid EID, prop is a string, val is a valid DB value
  return datascript.db_with(db, [[':db/add', eid, prop, val]]);
}

// Given the DB, an EID, and an object of properties to update, return an updated DB
// with the properties set to the given values in the specified entity.
function updateProperties(db, eid, props) {
  for (let prop of Object.keys(props)) {
    db = updateProperty(db, eid, prop, props[prop]);
  }
  return db;
}

/*
// Given the DB and an EID, return an updated DB with the specified entity removed.
function deleteEntity(db, eid) {
  return datascript.db_with(db, [[':db/retractEntity', eid]]);
}
*/
