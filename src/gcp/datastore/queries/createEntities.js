import uuid from 'uuid/v1';
import datastoreClient from '../datastoreConnection';

// This function updates existing entities with the same id.
// Try not to use this as it would need to build a new array of keys
// query them and then only insert the ones you can
export default async function createEntities(items) {
  console.time('Time to createEntities');
  let response = null;
  let uid = null;
  let kind = null;

  try {
    const entities = items.map(entity => {
      entity.map(entityFeilds => {
        if (entityFeilds.name === 'uid') {
          if (entityFeilds.value === '') {
            entityFeilds.value = uuid();
          }
          uid = entityFeilds.value;
          return uid;
        }
        if (entityFeilds.name === 'kind') {
          kind = entityFeilds.value;
          return kind;
        }
        return null;
      });

      // This must be called key
      const key = datastoreClient.key([kind, uid]);
      const data = entity;

      return { key, data };
    });

    response = await datastoreClient.insert(entities);
  } catch (error) {
    throw error;
  }
  console.timeEnd('Time to createEntities');
  return response[0];
}
