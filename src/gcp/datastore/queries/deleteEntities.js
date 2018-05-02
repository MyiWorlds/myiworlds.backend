import datastoreClient from '../datastoreConnection';
import getEntities from './getEntities';

/* Caution: Be careful when passing a Cloud Datastore cursor
to a client, such as in a web form. Although the client cannot
change the cursor value to access results outside of the original
query, it is possible for it to decode the cursor to expose
information about result entities, such as the project ID, entity
kind, key name or numeric ID, ancestor keys, and properties used
in the query's filters and sort orders. If you don't want users to
have access to that information, you can encrypt the cursor, or store
it and provide the user with an opaque key. */

export default async function deleteEntities(keys, contextUserUid) {
  console.time('deleteEntities time to complete');
  let response = {
    status: '',
    message: '',
    numberOfClones: 0,
    clonesDeleted: false,
    wasDeleted: false,
  };

  try {
    // TODO: Delete clones first
    keys.map(async item => {
      const clones = await getEntities(
        `${item.kind}-clones`,
        [
          {
            property: `${item.kind}Uid`,
            condition: '=',
            value: item.name, // Key passes uid in name property
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
          response.numberOfClones += clones.entities.length;
        });
      }
    });

    datastoreClient.delete(keys);
  } catch (error) {
    console.log(error);
    response = {
      status: 'ERROR',
      messsage:
        'Sorry, I had an error getting the Entities.  Please refresh and try again.',
      entities: null,
      cursor: null,
    };
  }
  console.time('deleteEntities time to complete');
  return response;
}
