import uuid from 'uuid/v1';
import datastoreClient from '../dbconnection';

// This function updates existing entities with the same id.
// Try not to use this as it would need to build a new array of _ids
// query them and then only insert the ones you can
export default async function createEntities(items) {
  console.time('Time to createEntities');
  let response = null;
  let dsKey = null;
  let kind = null;

  try {
    const entities = items.map(entity => {
      entity.map(entityFeilds => {
        if (entityFeilds.name === '_id') {
          if (entityFeilds.value === '') {
            entityFeilds.value = uuid();
          }
          dsKey = entityFeilds.value;
          return dsKey;
        }
        if (entityFeilds.name === 'kind') {
          kind = entityFeilds.value;
          return kind;
        }
        return null;
      });

      const key = datastoreClient.key([kind, dsKey]);
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
