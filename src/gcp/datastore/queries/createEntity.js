import datastoreClient from '../datastoreConnection';

export default async function createEntity(entity) {
  console.time('Time to createEntity');
  let response = {
    message: null,
    createdEntityId: null,
  };
  let data = entity;
  let kind = null;
  let dsKeyId = null;
  let isDateCreated = false;
  let isDateUpdated = false;

  try {
    entity.map(entityFeilds => {
      if (entityFeilds.name === '_id') {
        dsKeyId = entityFeilds.value;

        return dsKeyId;
      }
      if (entityFeilds.name === 'kind') {
        kind = entityFeilds.value;
        return kind;
      }

      // if (
      //   (entityFeilds.name === 'dateCreated' && entityFeilds.value === '') ||
      //   entityFeilds.value === null ||
      //   entityFeilds.value === undefined
      // ) {
      //   return (isDateCreated = true), (entityFeilds.value = Date.now());
      // }

      // if (
      //   entityField.name === 'dateUpdated' &&
      //   (entityField.value === '' || entityField.value === null || undefined)
      // ) {
      //   return (isDateUpdated = true), (entityFeilds.value = Date.now());
      // }

      return null;
    });

    // if (isDateCreated === false) {
    //   entity
    //     .find(entityFields.name === 'dateCreated')
    //     .then(field => (field.value = Date.now()));
    // }
    // if (isDateUpdated === false) {
    //   entity
    //     .find(entityFields.name === 'dateUpdated')
    //     .then(field => (field.value = Date.now()));
    // }

    const key = datastoreClient.key([kind, dsKeyId]);
    const newEntity = {
      key,
      data,
    };

    await datastoreClient.insert(newEntity);

    response = {
      message: 'SUCCESS: createEntity',
      createdEntityId: dsKeyId,
    };
  } catch (error) {
    throw error;
  }
  console.timeEnd('Time to createEntity');
  return response;
}
