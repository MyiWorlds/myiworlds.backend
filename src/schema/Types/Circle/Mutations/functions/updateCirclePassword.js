import {
  updateEntity,
  getEntityByKey,
} from '../../../../../gcp/datastore/queries';
import { passwordHash } from '../../../../../utils/index';

export default async function updateCirclePassword(inputFields, userId) {
  const entityToUpdate = [];
  const getCircle = await getEntityByKey('Circles', inputFields._id, userId);

  let hash = await passwordHash(inputFields.password);
  hash = Buffer.from(hash).toString('base64');

  function buildField(name) {
    let field;

    function encryptPassword() {
      field = {
        name,
        value: hash,
        excludeFromIndexes: true,
      };
    }

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

  Object.keys(getCircle).forEach(prop => {
    const object = buildField(prop);
    entityToUpdate.push(object);
  });

  return updateEntity(entityToUpdate, userId);
}
