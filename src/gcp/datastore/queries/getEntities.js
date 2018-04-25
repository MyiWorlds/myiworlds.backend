import datastoreClient from '../datastoreConnection';

/* Caution: Be careful when passing a Cloud Datastore cursor
to a client, such as in a web form. Although the client cannot
change the cursor value to access results outside of the original
query, it is possible for it to decode the cursor to expose
information about result entities, such as the project ID, entity
kind, key name or numeric ID, ancestor keys, and properties used
in the query's filters and sort orders. If you don't want users to
have access to that information, you can encrypt the cursor, or store
it and provide the user with an opaque key. */

export default async function getEntities(
  kind,
  filters,
  numberOfResults,
  pageCursor,
  contextUserUid,
) {
  console.time('getEntities time to complete');
  let response = {
    status: '',
    message: '',
    entities: [],
    cursor: null,
  };

  try {
    let query = datastoreClient.createQuery(kind).limit(numberOfResults);

    if (filters) {
      filters.forEach(item => {
        query = query.filter(item.property, item.condition, item.value);
      });
    }

    if (pageCursor) {
      query = query.start(pageCursor);
    }

    await datastoreClient.runQuery(query).then(queryResults => {
      if (queryResults[0]) {
        queryResults[0].forEach(entity => {
          if (entity) {
            const circleIsPublic = entity.public && entity.public === true;
            const userIsCreator = contextUserUid === entity.creator;
            const userCanView =
              entity.viewers && entity.viewers.includes(contextUserUid);
            const userIsServer = contextUserUid === 'SERVER';

            if (
              circleIsPublic ||
              userIsCreator ||
              userCanView ||
              userIsServer
            ) {
              response.entities.push(entity);
            } else {
              response.entities.push({
                uid: entity.uid,
                type: 'PERMISSION_DENIED',
                title:
                  'Sorry, you do not have the required permissions to see this.',
              });
            }
          }
        });
      }
      response = {
        status: 'SUCCESS',
        messsage: 'Here is all the Entities I can provide you.',
        entities: response.entities,
        cursor: queryResults[1],
      };
    });
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
  console.time('getEntities time to complete');
  return response;
}
