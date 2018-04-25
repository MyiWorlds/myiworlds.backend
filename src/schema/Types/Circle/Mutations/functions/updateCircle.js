import {
  updateEntity,
  getEntityByKey,
} from '../../../../../gcp/datastore/queries';

export default async function updateCircle(inputFields, userUid) {
  // Have a feeling this should be a || instead of &&
  if (
    userUid !== inputFields.creator &&
    (inputFields.editors && inputFields.editors.includes(userUid) === false)
  ) {
    return {
      message: 'Sorry, you must be the creator.',
    };
  }

  const entityToUpdate = [];

  const circle = await getEntityByKey('circles', inputFields.uid, userUid).then(
    response => response.entity,
  );

  if (circle === undefined) {
    const response = {
      message: 'The uid you gave me no longer exists',
    };
    return response;
  }

  // hashedPassword was removed from this project, need to find a way to do this now
  let hash;
  if (inputFields.password && circle.creator === userUid) {
    hash = inputFields.password;
    // hash = await passwordHash(inputFields.password);
    // hash = Buffer.from(hash).toString('base64');
  }
  if (inputFields.password && circle.creator !== userUid) {
    const response = {
      message: 'You must be the creator to edit the password',
    };
    return response;
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
        value:
          inputFields[name] !== undefined || null
            ? inputFields[name]
            : circle[name],
      };
    }

    function notIndexedField() {
      field = {
        name,
        value:
          inputFields[name] !== undefined || null
            ? inputFields[name]
            : circle[name],
        excludeFromIndexes: true,
      };
    }

    const entityData = {
      uid: indexedField,
      type: indexedField,
      creator: indexedField,
      password: inputFields.password ? encryptPassword : notIndexedField,
      editors: indexedField,
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

  const entityToBuild = Object.assign({}, circle, inputFields);

  Object.keys(entityToBuild).forEach(prop => {
    const object = buildField(prop);
    entityToUpdate.push(object);
  });

  return updateEntity(entityToUpdate, userUid);
}
