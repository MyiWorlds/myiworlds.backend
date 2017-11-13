import {
  updateEntity,
  getEntityByKey,
} from '../../../../../gcp/datastore/queries';
import { passwordHash } from '../../../../../utils/index';

export default async function updateUser(inputFields, userId) {
  const entityToUpdate = [];
  const getUser = await getEntityByKey('Users', inputFields._id, userId).then(
    response => response.entity,
  );

  let hash;
  if (inputFields.password) {
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

    function indexedField() {
      field = {
        name,
        value: inputFields[name] ? inputFields[name] : getUser[name],
      };
    }

    function notIndexedField() {
      field = {
        name,
        value: inputFields[name] ? inputFields[name] : getUser[name],
        excludeFromIndexes: true,
      };
    }

    const entityData = {
      _id: indexedField,
      username: indexedField,
      email: indexedField,
      password: inputFields.password ? encryptPassword : notIndexedField,
      dateCreated: indexedField,
      dateUpdated: indexedField,

      default: notIndexedField,
    };
    (entityData[name] || entityData.default)();

    return field;
  }

  Object.keys(getUser).forEach(prop => {
    const object = buildField(prop);
    entityToUpdate.push(object);
  });

  return updateEntity(entityToUpdate, userId);
}
