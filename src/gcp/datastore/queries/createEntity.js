import datastoreClient from '../datastoreConnection';

export default async function createEntity(entity, contextUserUid) {
  console.time('Time to createEntity');
  let response = {
    status: '',
    message: null,
    createdEntityUid: null,
  };
  const data = entity;
  let kind = null;
  let uid = null;

  try {
    entity.map(entityFeilds => {
      if (entityFeilds.name === 'uid') {
        uid = entityFeilds.value;

        return uid;
      }
      if (entityFeilds.name === 'kind') {
        kind = entityFeilds.value;
        return kind;
      }

      return null;
    });

    // You must pass key in to create an entity
    const key = datastoreClient.key([kind, uid]);
    const newEntity = {
      key,
      data,
    };

    await datastoreClient.insert(newEntity);

    response = {
      status: 'SUCCESS',
      message: 'Entity was created',
      createdEntityUid: uid,
      contextUserUid,
    };
  } catch (error) {
    console.log(error);
    response = {
      status: 'ERROR',
      message: 'There was an error creating the Entity',
      createdEntityUid: uid,
      contextUserUid,
    };
  }
  console.timeEnd('Time to createEntity');
  return response;
}
