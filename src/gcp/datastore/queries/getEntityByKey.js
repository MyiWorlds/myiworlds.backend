import datastoreClient from '../datastoreConnection';

export default async function getEntityByKey(kind, uid, contextUserUid) {
  console.time('getEntityByKey time to complete: ');

  let response = {
    status: '',
    message: '',
    entity: null,
  };
  try {
    const entityKey = await datastoreClient.key([kind, uid]);
    const result = await datastoreClient.get(entityKey);
    if (
      (result &&
        // For getting circles
        (result[0].public ||
          contextUserUid === result[0].creator ||
          (result[0].viewers && result[0].viewers.includes(contextUserUid)) ||
          uid === contextUserUid ||
          (result[0].kind === 'users' && contextUserUid === 'new-user'))) ||
      // For getting users.  MIGHT BE OLD AND NOT USED
      result[0].userUid === contextUserUid ||
      // Keep an eye out for this as it may be a security hole to see user data
      // Main purpose is so you can view creators
      // The only time a User is queried is by root (yourself) or from circle (CreatorType)
      kind === 'users'
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
          uid,
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
