import uuid from 'uuid/v1';

import {
  updateEntity,
  getEntityByKey,
  createEntities,
  getEntities,
} from '../../../../../gcp/datastore/queries';
import datastoreClient from '../../../../../gcp/datastore/datastoreConnection';

import buildCircle from '../../../Circle/Mutations/functions/buildCircle';

export default async function createUsername(inputFields, contextUserId) {
  inputFields.username = inputFields.username.toLowerCase();
  const entityToUpdate = [];
  const userId = contextUserId;
  // Make sure username is lowercase

  const checkUsernameDoesNotExist = await getEntities(
    'Users',
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
    'Users',
    contextUserId,
    contextUserId,
  ).then(response => response.entity);

  if (getUser.username) {
    return {
      message: 'You already have username, you cannot create another',
    };
  }

  const homePublicId = await uuid();
  const homePrivateId = await uuid();

  const homePublic = await buildCircle(
    {
      _id: homePublicId,
      kind: 'Circles',
      public: true,
      type: 'LINESMANY',
      title: `${inputFields.username}'s Home`,
      slug: `${inputFields.username}`,
      creator: 'myiworlds',
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      viewers: [userId],
      editors: [userId],
    },
    userId,
  );

  const homePrivate = await buildCircle(
    {
      _id: homePrivateId,
      kind: 'Circles',
      public: false,
      type: 'LINESMANY',
      title: `${inputFields.username}'s Private Home`,
      slug: `private/${inputFields.username}`,
      creator: 'myiworlds',
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      viewers: [userId],
      editors: [userId],
    },
    userId,
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
      _id: indexedField,
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
      value: homePublicId,
      excludeFromIndexes: true,
    },
    {
      name: 'homePrivate',
      value: homePrivateId,
      excludeFromIndexes: true,
    },
  ];
  const newEntity = entityToUpdate.concat(mergeCreated);

  return updateEntity(newEntity, contextUserId);
}
