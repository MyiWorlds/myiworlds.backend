import datastoreClient from '../datastoreConnection';

/* eslint-disable camelcase */
export default async function getEntitiesByKeys(kind, uids, contextUserUid) {
  console.time('getEntitiesByKeys TTC: ');
  let response = {
    status: '',
    message: '',
    uids: [],
    entities: [],
  };

  try {
    if (uids && uids.length > 0) {
      const dsKeys = uids.map(uid => [kind, uid]);
      const entityKeys = dsKeys.map(uid => datastoreClient.key(uid));
      const getEntities = await datastoreClient.get(entityKeys);

      // Transform undefined into objects
      const itemsByUid = getEntities[0].reduce((lookupTable, item) => {
        lookupTable[item.uid] = item;
        return lookupTable;
      }, {});

      const sortedEntities = uids.reduce((matchingItems, uid) => {
        const item = itemsByUid[uid];

        if (item) {
          matchingItems.push(item);
        }
        if (item === undefined) {
          matchingItems.push({ uid, type: 'DOES_NOT_EXIST' });
        }

        return matchingItems;
      }, []);

      sortedEntities.forEach(entity => {
        const isUser = entity.uid === contextUserUid;
        const isPublic = entity.public === true;
        const isCreator = contextUserUid === entity.creator;
        const isViewer =
          entity.viewers && entity.viewers.includes(contextUserUid);

        if (entity.type === 'DOES_NOT_EXIST') {
          response.entities.push({
            uid: entity.uid,
            type: entity.type,
          });
        } else if (isUser || isPublic || isCreator || isViewer) {
          response.entities.push(entity);
        } else {
          response.entities.push({
            uid: entity.uid,
            type: 'PERMISSION_DENIED',
            title:
              'Sorry, you do not have the required permissions to see this.',
          });
        }
      });
      response = {
        status: 'SUCCESS',
        message: 'Here is all the Entities I can provide you.',
        entities: response.entities,
      };
    }
  } catch (error) {
    console.log(error);
    response = {
      status: 'ERROR',
      message:
        'Sorry, I had an error getting the Entities.  Please refresh and try again.',
      entities: [],
    };
  }
  console.timeEnd('getEntitiesByKeys TTC: ');
  return response;
}
