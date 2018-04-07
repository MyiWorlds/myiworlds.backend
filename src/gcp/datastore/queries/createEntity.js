import datastoreClient from '../datastoreConnection';

export default async function createEntity(entity, contextUserId) {
  console.time('Time to createEntity');
  let response = {
    status: '',
    message: null,
    createdEntityId: null,
  };
  const data = entity;
  let kind = null;
  let dsKeyId = null;

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

      return null;
    });

    const key = datastoreClient.key([kind, dsKeyId]);
    const newEntity = {
      key,
      data,
    };

    await datastoreClient.insert(newEntity);

    response = {
      status: 'SUCCESS',
      message: 'Entity was created',
      createdEntityId: dsKeyId,
      contextUserId,
    };
  } catch (error) {
    console.log(error);
    response = {
      status: 'ERROR',
      message: 'There was an error creating the Entity',
      createdEntityId: dsKeyId,
      contextUserId,
    };
  }
  console.timeEnd('Time to createEntity');
  return response;
}
