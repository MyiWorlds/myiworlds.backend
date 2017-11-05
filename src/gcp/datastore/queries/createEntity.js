import datastoreClient from '../dbconnection';

export default async function createEntity(entity) {
  console.time('Time to createEntity');
  let response = {
    message: null,
    createdEntityId: null,
  };
  let kind = null;
  let dsKey = null;

  try {
    entity.map(entityFeilds => {
      if (entityFeilds.name === '_id') {
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
    const newEntity = {
      key,
      data,
    };

    await datastoreClient.insert(newEntity);

    response = {
      message: 'I successfully created that for you',
      createdEntityId: dsKey,
    };
  } catch (error) {
    response.message =
      'Sorry, I am not sure what went wrong.  I sent my creators a message to upgrade me.';
    console.error([error, entity[0]]);
  }
  console.timeEnd('Time to createEntity');
  return response;
}
