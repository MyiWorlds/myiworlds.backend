import datastoreClient from '../dbconnection';
import getEntities from './getEntities';

// Used for right after creation, until maybe after a few hours then it goes to create only.
export default async function deleteEntity(kind, _id, userId) {
  console.time('deleteEntity time to complete');
  const response = {
    message: '',
    idToDelete: _id,
    numberOfClones: 0,
    clonesDeleted: false,
    wasDeleted: false,
  };
  const checkIfExists = await datastoreClient.get(
    datastoreClient.key([kind, _id]),
  );

  try {
    if (checkIfExists[0] !== undefined) {
      if (
        userId === checkIfExists[0].creator ||
        userId === checkIfExists[0]._id
      ) {
        const clones = await getEntities(
          `${kind}-clones`,
          [
            {
              property: `${kind}_id`,
              condition: '=',
              value: _id,
            },
          ],
          // Might have to make if there is more after 999999 send another query/delete request
          999999,
          null,
          userId,
        );

        if (clones.entities && clones.entities.length > 0) {
          const cloneEntitiesToDelete = [];

          clones.entities.forEach(entity =>
            cloneEntitiesToDelete.push(entity[datastoreClient.KEY]),
          );

          await datastoreClient.delete(cloneEntitiesToDelete).then(() => {
            response.clonesDeleted = true;
            response.numberOfClones = clones.entities.length;
          });
        }

        const delEntity = await datastoreClient.delete(
          datastoreClient.key([kind, _id]),
        );

        if (delEntity[0].mutationResults) {
          response.message =
            'I successfully deleted that and its clones for you';
          response.wasDeleted = true;
        } else {
          response.message = 'I had an error deleting that';
        }
      } else {
        response.message = 'Sorry, you must be the creator to delete this';
      }
    } else {
      response.message = 'Sorry, that no longer exists';
    }
  } catch (error) {
    response.message =
      'Sorry, I am not sure what went wrong.  I sent my creators a message to upgrade me.';
    console.error([error, kind, _id, userId]);
  }
  console.timeEnd('deleteEntity time to complete');
  return response;
}
