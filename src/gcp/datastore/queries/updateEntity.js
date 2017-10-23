import datastoreClient from '../dbconnection';
import cloneToNewEntity from './cloneToNewEntity';

export default async function updateEntity(entityToUpdate, userId) {
  console.time('updateEntity time to complete');
  let response = {
    message: '',
    updatedCircle: null,
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
        (entity[0].editors && entity[0].editors.includes(userId))
      ) {
        const createdCloneEntity = await cloneToNewEntity(entity[0]);
        const updatedEntity = await datastoreClient
          .update(newEntity)
          .then(() => datastoreClient.get(key));

        response = {
          message: 'I successfully updated that for you',
          latestVersionOfEntity: createdCloneEntity,
          updatedEntity: updatedEntity[0],
        };
      } else {
        response = {
          message: 'Sorry, you must be the creator or an editor to update this',
        };
      }
    });
  } catch (error) {
    response = {
      message: 'Sorry, I was unable to find that',
      updatedCircle: null,
      latestVersionOfEntity: null,
    };
    response.message = 'Sorry, that no longer exists';
    console.error([error, entityToUpdate, userId]);
  }
  console.timeEnd('updateEntity time to complete');
  return response;
}
