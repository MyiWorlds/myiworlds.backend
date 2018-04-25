import datastoreClient from '../datastoreConnection';
import cloneToNewEntity from './cloneToNewEntity';

export default async function updateEntity(entityToUpdate, contextUserUid) {
  console.time('updateEntity time to complete');
  let response = {
    status: '',
    message: '',
    updatedEntityUid: null,
    latestVersionOfEntity: null,
  };
  let kind = null;
  let uid = null;

  entityToUpdate.map(entityFeilds => {
    if (entityFeilds.name === 'uid') {
      if (!entityFeilds.value) {
        response = {
          status: 'ERROR',
          message:
            'There should have been an auto generated uid given to me, there was nothing.  Something has gone wrong',
        };
        return response;
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

  const key = datastoreClient.key([kind, uid]);
  const data = entityToUpdate;
  // Must pass in key property to create entity
  const newEntity = {
    key,
    data,
  };

  try {
    await datastoreClient.get(key).then(async entity => {
      if (
        (entity[0].creator && contextUserUid === entity[0].creator) ||
        (entity[0].editors && entity[0].editors.includes(contextUserUid)) ||
        contextUserUid === entity[0].uid
      ) {
        const createdCloneEntity = await cloneToNewEntity(entity[0]);
        await datastoreClient.update(newEntity);

        response = {
          status: 'SUCCESS',
          message: 'I successfully updated that for you',
          latestVersionOfEntity: createdCloneEntity,
          updatedEntityUid: uid,
          contextUserUid,
        };
      } else {
        response = {
          status: 'ERROR',
          message: 'Sorry, you must be the creator or an editor to update this',
        };
      }
    });
  } catch (error) {
    console.log(error);
    response = {
      status: 'ERROR',
      message: 'Sorry, I had an error updating that.',
    };
  }

  console.timeEnd('updateEntity time to complete');
  return response;
}
