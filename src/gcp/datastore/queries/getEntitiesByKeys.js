import datastoreClient from '../datastoreConnection';

/* eslint-disable camelcase */
export default async function getEntitiesByKeys(kind, _ids, contextUserId) {
  console.time('getEntitiesByKeys TTC: ');
  let response = {
    status: '',
    message: '',
    _ids: [],
    entities: [],
  };

  try {
    if (_ids && _ids.length > 0) {
      const dsKeys = _ids.map(_id => [kind, _id]);
      const keys = dsKeys.map(key => datastoreClient.key(key));
      const getEntities = await datastoreClient.get(keys);

      // Transform undefined into objects
      const itemsById = getEntities[0].reduce((lookupTable, item) => {
        lookupTable[item._id] = item;
        return lookupTable;
      }, {});

      const sortedEntities = _ids.reduce((matchingItems, _id) => {
        const item = itemsById[_id];

        if (item) {
          matchingItems.push(item);
        }
        if (item === undefined) {
          matchingItems.push({ _id, type: 'DOES_NOT_EXIST' });
        }

        return matchingItems;
      }, []);

      sortedEntities.forEach(entity => {
        if (entity.type === 'DOES_NOT_EXIST') {
          response.entities.push({
            _id: entity._id,
            type: entity.type,
          });
        } else if (
          entity.public === true ||
          contextUserId === entity.creator ||
          (entity.viewers && entity.viewers.includes(contextUserId)) ||
          entity._id === contextUserId
        ) {
          response.entities.push(entity);
        } else {
          response.entities.push({
            _id: entity._id,
            type: 'PERMISSION_DENIED',
            title:
              'Sorry, you do not have the required permissions to see this.',
          });
        }
      });
      response = {
        status: 'SUCCESS',
        message: 'Here is all the Entities I can provide you.',
      };
    }
  } catch (error) {
    console.log(error);
    response = {
      status: 'ERROR',
      message:
        'Sorry, I had an error getting the Entities.  Please refresh and try again.',
    };
  }
  console.timeEnd('getEntitiesByKeys TTC: ');
  return response;
}
