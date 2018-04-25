import uuid from 'uuid/v1';
import datastoreClient from '../datastoreConnection';

/* eslint-disable camelcase */
export default async function cloneToNewEntity(entityObject) {
  console.time('cloneToNewEntity time to complete');
  const newKind = `${entityObject.kind}-clones`;
  let response = null;
  const entity = [];
  const nameValues = Object.entries(entityObject);
  const newUid = uuid();
  const moveOldUid = {
    name: `${entityObject.kind}Uid`,
    value: entityObject.uid,
  };

  entity.push(moveOldUid);

  function buildEntityWithNewIndexes() {
    nameValues.forEach(nameValueArray => {
      const name = nameValueArray[0];
      const value = nameValueArray[1];
      const builtEntityPropertyObject = {};

      builtEntityPropertyObject.name = name;

      if (nameValueArray[0] !== 'uid' && nameValueArray[0] !== 'dateUpdated') {
        builtEntityPropertyObject.excludeFromIndexes = true;
      }

      if (nameValueArray[0] === 'uid') {
        builtEntityPropertyObject.value = newUid;
      } else {
        builtEntityPropertyObject.value = value;
      }

      entity.push(builtEntityPropertyObject);
    });
  }
  try {
    const key = datastoreClient.key([newKind, newUid]);
    const data = entity;
    const newEntity = {
      key,
      data,
    };

    buildEntityWithNewIndexes();

    await datastoreClient.save(newEntity);

    response = {
      newUid,
      newKind,
    };
  } catch (error) {
    throw error;
  }
  console.timeEnd('cloneToNewEntity time to complete');
  return response;
}
