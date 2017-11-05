import {
  updateEntity,
  getEntityByKey,
} from '../../../../../gcp/datastore/queries';

export default async function updateCircle(inputFields, userId) {
  if (
    userId !== inputFields.creator &&
    (inputFields.editors && inputFields.editors.includes(userId) === false)
  ) {
    return {
      message: 'Sorry, you must be the creator.',
    };
  }

  const entityToUpdate = [];
  // Need to get the actual saved entity (passwords wont be supplied from frontend)
  const getCircle = await getEntityByKey(
    'Circles',
    inputFields._id,
    userId,
  ).then(response => response.entity);

  function buildField(name) {
    let field;

    function indexedField() {
      field = {
        name,
        value: getCircle[name],
      };
    }

    function notIndexedField() {
      field = {
        name,
        value: getCircle[name],
        excludeFromIndexes: true,
      };
    }

    const entityData = {
      _id: indexedField,
      type: indexedField,
      creator: indexedField,
      editors: indexedField,
      dateUpdated: indexedField,
      dateCreated: indexedField,
      slug: indexedField,
      title: indexedField,
      subtitle: indexedField,
      description: indexedField,
      public: indexedField,
      tags: indexedField,
      order: indexedField,

      default: notIndexedField,
    };
    (entityData[name] || entityData.default)();

    return field;
  }

  Object.keys(getCircle).forEach(prop => {
    const object = buildField(prop);
    entityToUpdate.push(object);
  });

  return updateEntity(entityToUpdate, userId);
}
