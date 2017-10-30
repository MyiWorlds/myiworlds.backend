import uuid from 'uuid/v1';
import {
  createEntity,
  createEntities,
  getEntities,
} from '../../../../../gcp/datastore/queries';
import { passwordHash } from '../../../../../utils/index';
import circleFieldBuilder from '../../../Circle/Mutations/circleFieldBuilder';

export default async function createUser(inputFields) {
  // Make sure username is lowercase
  inputFields.username = inputFields.username.toLowerCase();

  const checkUsername = await getEntities(
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
    null,
  );

  const checkEmail = await getEntities(
    'Users',
    [
      {
        property: 'email',
        condition: '=',
        value: inputFields.email,
      },
    ],
    1,
    null,
    null,
  );

  // Check the username/email and build a message response if one is taken
  if (checkUsername.entities[0] || checkEmail.entities[0]) {
    const username = checkUsername.entities[0] ? 'Username ' : '';
    const email = checkEmail.entities[0] ? 'Email ' : '';
    const message =
      checkUsername.entities[0] && checkEmail.entities[0]
        ? `${username}and ${email}`
        : username + email;
    return {
      message: `${message}is already in use`,
    };
  }

  // For testing without have context
  const userId = 'viewer000000000000000000000000000001';
  // const userId = await uuid();
  const levelId = await uuid();
  const balanceId = await uuid();
  const ratingId = await uuid();
  const uiId = await uuid();
  const homePublicId = await uuid();
  const homePrivateId = await uuid();
  const followingId = await uuid();
  const notificationsId = await uuid();

  let hashedPassword = await passwordHash(inputFields.password);
  hashedPassword = Buffer.from(hashedPassword).toString('base64');

  const level = circleFieldBuilder({
    _id: levelId,
    kind: 'Circles',
    public: true,
    type: 'NUMBER_LINESMANY',
    title: 'Account level',
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    number: 0,
  });

  const balance = circleFieldBuilder({
    _id: balanceId,
    kind: 'Circles',
    public: false,
    type: 'NUMBER_LINESMANY',
    title: 'Account Balance',
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    viewers: [userId],
  });

  const rating = circleFieldBuilder({
    _id: ratingId,
    kind: 'Circles',
    public: true,
    type: 'NUMBER_LINESMANY',
    title: 'Rating',
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    number: 0,
  });

  const ui = circleFieldBuilder({
    _id: uiId,
    kind: 'Circles',
    public: true,
    type: 'LINES',
    title: 'User Interface',
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    viewers: [userId],
    editors: [userId],
  });

  const homePublic = circleFieldBuilder({
    _id: homePublicId,
    kind: 'Circles',
    public: true,
    type: 'LINESMANY',
    title: `${inputFields.username}'s Home`,
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    viewers: [userId],
    editors: [userId],
  });

  const homePrivate = circleFieldBuilder({
    _id: homePrivateId,
    kind: 'Circles',
    public: false,
    type: 'LINESMANY',
    title: `${inputFields.username}'s Private Home`,
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    viewers: [userId],
    editors: [userId],
  });

  const following = circleFieldBuilder({
    _id: followingId,
    kind: 'Circles',
    public: true,
    type: 'LINESMANY',
    title: 'Following',
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    viewers: [userId],
    editors: [userId],
  });

  const notifications = circleFieldBuilder({
    _id: notificationsId,
    kind: 'Circles',
    public: true,
    type: 'LINESMANY',
    title: 'Notifications',
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    viewers: [userId],
    editors: [userId],
  });

  await createEntities([
    level,
    balance,
    rating,
    ui,
    homePublic,
    homePrivate,
    following,
    notifications,
  ]);

  const userToCreate = [
    {
      name: '_id',
      value: userId,
    },
    {
      name: 'kind',
      value: 'Users',
      excludeFromIndexes: true,
    },
    {
      name: 'username',
      value: inputFields.username,
    },
    {
      name: 'email',
      value: inputFields.email,
    },
    {
      name: 'password',
      value: hashedPassword,
      excludeFromIndexes: true,
    },
    {
      name: 'dateCreated',
      value: inputFields.dateCreated,
    },
    {
      name: 'level',
      value: levelId,
      excludeFromIndexes: true,
    },
    {
      name: 'balance',
      value: balanceId,
      excludeFromIndexes: true,
    },
    {
      name: 'rating',
      value: ratingId,
      excludeFromIndexes: true,
    },
    {
      name: 'ui',
      value: uiId,
      excludeFromIndexes: true,
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
    {
      name: 'following',
      value: followingId,
      excludeFromIndexes: true,
    },
    {
      name: 'notifications',
      value: notificationsId,
      excludeFromIndexes: true,
    },
  ];

  return createEntity(userToCreate);
}
