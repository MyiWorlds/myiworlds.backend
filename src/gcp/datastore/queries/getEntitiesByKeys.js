import datastoreClient from '../dbconnection';

/* eslint-disable camelcase */
export default async function getEntitiesByKeys(kind, _ids, viewerId) {
  console.time('getEntitiesByKeys TTC: ');
  let response = {
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
          viewerId === entity.creator ||
          (entity.viewers && entity.viewers.includes(viewerId)) ||
          entity._id === viewerId
        ) {
          response.entities.push(entity);
        } else {
          response.entities.push({
            _id: entity._id,
            type: 'PERMISSION_ERROR',
            title: 'Not enough permissions',
          });
        }
      });

      response.message = 'SUCCESS: getEntities returned everything it had';
    }
  } catch (error) {
    throw error;
  }
  console.timeEnd('getEntitiesByKeys TTC: ');
  return response;
}
