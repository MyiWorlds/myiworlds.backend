import datastoreClient from '../datastoreConnection';
import cloneToNewEntity from './cloneToNewEntity';

export default async function updateEntity(entityToUpdate, contextUserId) {
  console.time('updateEntity time to complete');
  let response = {
    status: '',
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
          status: 'ERROR',
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
        (entity[0].creator && contextUserId === entity[0].creator) ||
        (entity[0].editors && entity[0].editors.includes(contextUserId)) ||
        contextUserId === entity[0]._id
      ) {
        const createdCloneEntity = await cloneToNewEntity(entity[0]);
        await datastoreClient.update(newEntity);

        response = {
          status: 'SUCCESS',
          message: 'I successfully updated that for you',
          latestVersionOfEntity: createdCloneEntity,
          updatedEntityId: dsKey,
          contextUserId,
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
