import datastoreClient from '../datastoreConnection';
import cloneToNewEntity from './cloneToNewEntity';

export default async function updateEntity(entityToUpdate, userId) {
  console.time('updateEntity time to complete');
  let response = {
    message: '',
    updatedEntityId: null,
    latestVersionOfEntity: null,
  };
  let kind = null;
  let dsKey = null;

  entityToUpdate.map(entityFeilds => {
    if (entityFeilds.name === '_id') {
      if (!entityFeilds.value) {
        response = {
          message:
            'There should have been an auto generated ID given to me, there was nothing.  Something has gone wrong',
        };
        return response;
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
  const data = entityToUpdate;
  const newEntity = {
    key,
    data,
  };

  try {
    await datastoreClient.get(key).then(async entity => {
      if (
        (entity[0].creator && userId === entity[0].creator) ||
        (entity[0].editors && entity[0].editors.includes(userId)) ||
        userId === entity[0]._id
      ) {
        const createdCloneEntity = await cloneToNewEntity(entity[0]);
        await datastoreClient.update(newEntity);

        response = {
          message: 'SUCCESS: updateEntity updated that for you',
          latestVersionOfEntity: createdCloneEntity,
          updatedEntityId: dsKey,
        };
      } else {
        response = {
          message:
            'PERMISSIONS: updateEntity Sorry, you must be the creator or an editor to update this',
        };
      }
    });
  } catch (error) {
    throw error;
  }

  console.timeEnd('updateEntity time to complete');
  return response;
}
