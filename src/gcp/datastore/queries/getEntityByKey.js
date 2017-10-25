import datastoreClient from '../dbconnection';

export default async function getEntityByKey(kind, _id, userId) {
  console.time('getEntityByKey time to complete: ');

  let response = {
    message: '',
    entity: null,
  };

  try {
    const key = await datastoreClient.key([kind, _id]);
    const result = await datastoreClient.get(key);
    if (
      result &&
      (result[0].public ||
        userId === result[0].creator ||
        (result[0].viewers && result[0].viewers.includes(userId)) ||
        _id === userId)
    ) {
      response = {
        message: 'Got it! Heres the entity',
        entity: result[0],
      };
    } else {
      response = {
        message: 'Sorry, the creator has not allowed you to see this',
      };
    }
  } catch (error) {
    response = {
      message: 'getEntityByKey had a actual error, something is wrong',
      error,
      inputs: {
        kind,
        _id,
        userId,
      },
    };
  }
  console.timeEnd('getEntityByKey time to complete: ');
  return response;
}
