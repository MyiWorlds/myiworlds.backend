import datastoreClient from '../datastoreConnection';

export default async function getEntityByKey(kind, _id, contextUserId) {
  console.time('getEntityByKey time to complete: ');

  let response = {
    status: '',
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
        status: 'SUCCESS',
        message: 'Here is the Entity you requested.',
        entity: result[0],
      };
    } else {
      response = {
        status: 'SUCCESS',
        message: 'The creator has not allowed you to see this.',
        entity: {
          _id,
          type: 'PERMISSION_DENIED',
          title: 'Sorry, you do not have the required permissions to see this.',
        },
      };
    }
  } catch (error) {
    console.log(error);
    response = {
      status: 'ERROR',
      message: 'I had an error trying to get that Entity.',
    };
  }
  console.timeEnd('getEntityByKey time to complete: ');
  return response;
}
