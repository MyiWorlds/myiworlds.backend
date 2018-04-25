import datastoreClient from '../datastoreConnection';
import getEntities from './getEntities';

// Used for right after creation, until maybe after a few hours then it goes to create only.
export default async function deleteEntity(kind, uid, contextUserUid) {
  console.time('deleteEntity time to complete');
  let response = {
    status: '',
    message: '',
    uidToDelete: uid,
    numberOfClones: 0,
    clonesDeleted: false,
    wasDeleted: false,
  };
  const checkIfExists = await datastoreClient.get(
    datastoreClient.key([kind, uid]),
  );

  try {
    if (checkIfExists[0] !== undefined) {
      if (
        contextUserUid === checkIfExists[0].creator ||
        contextUserUid === checkIfExists[0].uid
      ) {
        const clones = await getEntities(
          `${kind}-clones`,
          [
            {
              property: `${kind}uid`,
              condition: '=',
              value: uid,
            },
          ],
          // Might have to make if there is more after 999999 send another query/delete request
          999999,
          null,
          contextUserUid,
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
          datastoreClient.key([kind, uid]),
        );

        if (delEntity[0].mutationResults) {
          response = {
            status: 'SUCCESS',
            message: 'I successfully deleted that and its clones for you',
            wasDeleted: true,
          };
        } else {
          response = {
            status: 'ERROR',
            message:
              'I had an error deleting that.  My function deleteEntity failed.',
          };
        }
      } else {
        response = {
          status: 'ERROR',
          message:
            'Sorry, I could not delete that. You must be the creator to delete this.',
        };
      }
    } else {
      response = {
        status: 'ERROR',
        message: 'I could not delete that, it no longer exists.',
      };
    }
  } catch (error) {
    console.log(error);
    response = {
      status: 'ERROR',
      message: 'I had an error, please refresh and try again try again.',
    };
  }
  console.timeEnd('deleteEntity time to complete');
  return response;
}
