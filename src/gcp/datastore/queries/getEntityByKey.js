import datastoreClient from '../datastoreConnection';

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
      (result &&
        // For getting circles
        (result[0].public ||
          userId === result[0].creator ||
          (result[0].viewers && result[0].viewers.includes(userId)) ||
          _id === userId ||
          (result[0].kind === 'Users' && userId === 'new-user'))) ||
      // For getting users
      result[0].Users_id === userId
    ) {
      response = {
        message: 'SUCCESS: getEntityByKey. Got it! Heres the entity',
        entity: result[0],
      };
    } else {
      response = {
        message:
          'PERMISSIONS_ERROR: getEntityByKey was not able to return anything.  The creator has not allowed you to see this',
      };
    }
  } catch (error) {
    throw error;
  }
  console.timeEnd('getEntityByKey time to complete: ');
  return response;
}
