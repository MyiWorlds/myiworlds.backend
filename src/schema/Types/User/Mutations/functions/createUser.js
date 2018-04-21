import uuid from 'uuid/v1';
import {
  createEntity,
  createEntities,
  getEntities,
} from '../../../../../gcp/datastore/queries';
import buildCircle from '../../../Circle/Mutations/functions/buildCircle';

export default async function createUser(inputFields, contextUserId) {
  // Going to be moving it to its own Kind
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

  if (checkEmailDoesNotExist.entities[0]) {
    return {
      message: `Email is already in use`,
    };
  }

  // Generate IDs for the entities we are going to create
  // For testing userId is set, this should be generated
  // const userId = 'davey';
  let userId;
  if (contextUserId) {
    userId = contextUserId;
  } else {
    userId = await uuid();
  }

  const profileMediaId = await uuid();
  const levelId = await uuid();
  const balanceId = await uuid();
  const ratingId = await uuid();
  const uiId = await uuid();
  const followingId = await uuid();
  const inboxId = await uuid();

  // Note no longer using Passwords for accounts. Purley social based
  // hashedPassword was removed from this project, need to find a way to do this now
  // const hashedPassword = inputFields.password;
  // let hashedPassword = await passwordHash(inputFields.password);
  // hashedPassword = Buffer.from(hashedPassword).toString('base64');

  const profileMedia = await buildCircle({
    _id: profileMediaId,
    kind: 'Circles',
    public: true,
    type: 'IMAGE',
    title: 'My Profile Media',
    creator: 'myiworlds',
    editors: [userId],
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    string: inputFields.profileMedia,
  });

  const level = await buildCircle({
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

  const balance = await buildCircle(
    {
      _id: balanceId,
      kind: 'Circles',
      public: false,
      type: 'NUMBER_LINESMANY',
      title: 'Account Balance',
      creator: 'myiworlds',
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      viewers: [userId],
    },
    userId,
  );

  const rating = await buildCircle(
    {
      _id: ratingId,
      kind: 'Circles',
      public: true,
      type: 'NUMBER_LINESMANY',
      title: 'Rating',
      creator: 'myiworlds',
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      number: 0,
    },
    userId,
  );

  const ui = await buildCircle(
    {
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
    },
    userId,
  );

  const following = await buildCircle(
    {
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
    },
    userId,
  );

  const inbox = await buildCircle(
    {
      _id: inboxId,
      kind: 'Circles',
      public: true,
      type: 'LINESMANY',
      title: 'Inbox',
      creator: 'myiworlds',
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      viewers: [userId],
      editors: [userId],
    },
    userId,
  );

  // Create the default fields each user requires
  await createEntities([
    profileMedia,
    level,
    balance,
    rating,
    ui,
    following,
    inbox,
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
      name: 'profileMedia',
      value: profileMediaId,
      excludeFromIndexes: true,
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
      name: 'following',
      value: followingId,
      excludeFromIndexes: true,
    },
    {
      name: 'inbox',
      value: inboxId,
      excludeFromIndexes: true,
    },
  ];

  return createEntity(userToCreate, contextUserId);
}
