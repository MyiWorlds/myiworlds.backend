import uuid from 'uuid/v1';

import {
  updateEntity,
  getEntityByKey,
  createEntities,
  getEntities,
} from '../../../../../gcp/datastore/queries';

import buildCircle from '../../../Circle/Mutations/functions/buildCircle';

export default async function createUsername(inputFields, contextUserUid) {
  inputFields.username = inputFields.username.toLowerCase();
  const entityToUpdate = [];
  const userUid = contextUserUid;
  // Make sure username is lowercase

  const checkUsernameDoesNotExist = await getEntities(
    'users',
    [
      {
        property: 'username',
        condition: '=',
        value: inputFields.username,
      },
    ],
    1,
    null,
    'SERVER',
  );

  if (checkUsernameDoesNotExist.entities[0]) {
    return {
      message: `Username is already in use`,
    };
  }

  const getUser = await getEntityByKey(
    'users',
    contextUserUid,
    contextUserUid,
  ).then(response => response.entity);

  if (getUser.username) {
    return {
      message: 'You already have username, you cannot create another',
    };
  }

  const homePublicUid = await uuid();
  const homePrivateUid = await uuid();

  const homePublic = await buildCircle(
    {
      uid: homePublicUid,
      public: true,
      type: 'LINESMANY',
      title: `${inputFields.username}'s Home`,
      slug: `${inputFields.username}`,
      creator: 'myiworlds',
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      viewers: [userUid],
      editors: [userUid],
    },
    userUid,
  );

  const homePrivate = await buildCircle(
    {
      uid: homePrivateUid,
      public: false,
      type: 'LINESMANY',
      title: `${inputFields.username}'s Private Home`,
      slug: `private/${inputFields.username}`,
      creator: 'myiworlds',
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      viewers: [userUid],
      editors: [userUid],
    },
    userUid,
  );

  await createEntities([homePublic, homePrivate]);

  function buildField(name) {
    let field;

    function indexedField() {
      field = {
        name,
        value:
          inputFields[name] !== undefined || null
            ? inputFields[name]
            : getUser[name],
      };
    }

    function notIndexedField() {
      field = {
        name,
        value:
          inputFields[name] !== undefined || null
            ? inputFields[name]
            : getUser[name],
        excludeFromIndexes: true,
      };
    }

    const entityData = {
      uid: indexedField,
      email: indexedField,
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

  const mergeCreated = [
    {
      name: 'username',
      value: inputFields.username,
    },
    {
      name: 'homePublic',
      value: homePublicUid,
      excludeFromIndexes: true,
    },
    {
      name: 'homePrivate',
      value: homePrivateUid,
      excludeFromIndexes: true,
    },
  ];
  const newEntity = entityToUpdate.concat(mergeCreated);

  return updateEntity(newEntity, contextUserUid);
}
