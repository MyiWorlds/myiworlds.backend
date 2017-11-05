import uuid from 'uuid/v1';
import { passwordHash } from '../../../../../utils/index';

export default async function circleFieldBuilder(inputFields) {
  const entityToCreate = [];

  let hash;
  if (inputFields.password !== undefined) {
    hash = await passwordHash(inputFields.password);
    hash = Buffer.from(hash).toString('base64');
  }

  function buildField(name) {
    let field;

    function encryptPassword() {
      field = {
        name,
        value: hash,
        excludeFromIndexes: true,
      };
    }

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
      editors: indexedField,
      password: encryptPassword,
      dateUpdated: indexedField,
      dateCreated: indexedField,
      slug: indexedField,
      public: indexedField,
      tags: indexedField,
      order: indexedField,

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
