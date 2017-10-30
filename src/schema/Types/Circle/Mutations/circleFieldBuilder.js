import uuid from 'uuid/v1';

export default function circleFieldBuilder(inputFields) {
  const entityToCreate = [];

  function buildField(name) {
    let field;

    function customIdLogic() {
      if (
        !inputFields._id ||
        (inputFields._id === '' || inputFields._id === null)
      ) {
        field = {
          name,
          value: uuid(),
        };
      } else {
        field = {
          name,
          value: inputFields[name],
        };
      }
    }

    function indexedField() {
      field = {
        name,
        value: inputFields[name],
      };
    }

    function notIndexedField() {
      field = {
        name,
        value: inputFields[name],
        excludeFromIndexes: true,
      };
    }

    const entityData = {
      _id: customIdLogic,
      type: indexedField,
      creator: indexedField,
      dateCreated: indexedField,
      dateUpdated: indexedField,
      slug: indexedField,
      title: indexedField,
      subtitle: indexedField,
      description: indexedField,
      public: indexedField,
      tags: indexedField,

      default: notIndexedField,
    };
    (entityData[name] || entityData.default)();

    return field;
  }

  const requiredFields = [
    {
      name: 'kind',
      value: 'Circles',
      excludeFromIndexes: true,
    },
  ];

  entityToCreate.push(requiredFields[0]);

  Object.keys(inputFields).forEach(prop => {
    const object = buildField(prop);
    entityToCreate.push(object);
  });

  return entityToCreate;
}
