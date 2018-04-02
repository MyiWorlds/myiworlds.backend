import datastoreClient from '../datastoreConnection';

export default async function getEntityByKey(kind, _id, contextUserId) {
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
          contextUserId === result[0].creator ||
          (result[0].viewers && result[0].viewers.includes(contextUserId)) ||
          _id === contextUserId ||
          (result[0].kind === 'Users' && contextUserId === 'new-user'))) ||
      // For getting users
      result[0].Users_id === contextUserId ||
      // Keep an eye out for this as it may be a security hole to see user data
      // Main purpose is so you can view creators
      // The only time a User is queries is by root (yourself) or from circle (CreatorType)
      kind === 'Users'
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
