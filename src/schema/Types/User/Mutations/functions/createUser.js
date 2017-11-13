import uuid from 'uuid/v1';
import {
  createEntity,
  createEntities,
  getEntities,
} from '../../../../../gcp/datastore/queries';
import { passwordHash } from '../../../../../utils/index';
import circleFieldBuilder from '../../../Circle/Mutations/functions/circleFieldBuilder';

export default async function createUser(inputFields) {
  // Make sure username is lowercase
  inputFields.username = inputFields.username.toLowerCase();

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
    null,
  );

  const checkEmailDoesNotExist = await getEntities(
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
  if (
    checkUsernameDoesNotExist.entities[0] ||
    checkEmailDoesNotExist.entities[0]
  ) {
    const usernameMessage = checkUsernameDoesNotExist.entities[0]
      ? 'Username '
      : '';
    const emailMessage = checkEmailDoesNotExist.entities[0] ? 'Email ' : '';
    const message =
      checkUsernameDoesNotExist.entities[0] &&
      checkEmailDoesNotExist.entities[0]
        ? `${usernameMessage}and ${emailMessage}`
        : usernameMessage + emailMessage;
    return {
      message: `${message}is already in use`,
    };
  }

  // Generate IDs for the entities we are going to create
  // For testing userId is set, this should be generated
  const userId = 'davey';
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

  const level = await circleFieldBuilder({
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

  const balance = await circleFieldBuilder({
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

  const rating = await circleFieldBuilder({
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

  const ui = await circleFieldBuilder({
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

  const homePublic = await circleFieldBuilder({
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
  });

  const homePrivate = await circleFieldBuilder({
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
  });

  const following = await circleFieldBuilder({
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

  const notifications = await circleFieldBuilder({
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

  // Create the default fields each user requires
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
      name: 'emailConfirmed',
      value: false,
      excludeFromIndexes: true,
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
      name: 'dateUpdated',
      value: inputFields.dateUpdated,
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
      name: 'uiEnabled',
      value: false,
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
