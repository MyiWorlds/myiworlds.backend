import uuid from 'uuid/v1';
import {
  createEntity,
  createEntities,
  getEntities,
} from '../../../../../gcp/datastore/queries';
import buildCircle from '../../../Circle/Mutations/functions/buildCircle';

export default async function createUser(inputFields, contextUserUid) {
  const checkEmailDoesNotExist = await getEntities(
    'users',
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
  let userUid;
  if (contextUserUid) {
    userUid = contextUserUid;
  } else {
    userUid = await uuid();
  }

  const profileMediaUid = await uuid();
  const levelUid = await uuid();
  const balanceuid = await uuid();
  const ratingUid = await uuid();
  const uiUid = await uuid();
  const followingUid = await uuid();
  const inboxUid = await uuid();

  // Note no longer using Passwords for accounts. Purley social based
  // hashedPassword was removed from this project, need to find a way to do this now
  // const hashedPassword = inputFields.password;
  // let hashedPassword = await passwordHash(inputFields.password);
  // hashedPassword = Buffer.from(hashedPassword).toString('base64');

  const profileMedia = await buildCircle({
    uid: profileMediaUid,
    public: true,
    type: 'IMAGE',
    title: 'My Profile Media',
    creator: 'myiworlds',
    editors: [userUid],
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    string: inputFields.profileMedia,
  });

  const level = await buildCircle({
    uid: levelUid,
    public: true,
    type: 'NUMBER_LINESMANY',
    title: 'Account level',
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    number: 0,
  });

  const balance = await buildCircle({
    uid: balanceuid,
    public: false,
    type: 'NUMBER_LINESMANY',
    title: 'Account Balance',
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    viewers: [userUid],
  });

  const rating = await buildCircle({
    uid: ratingUid,
    public: true,
    type: 'NUMBER_LINESMANY',
    title: 'Rating',
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    number: 0,
  });

  const ui = await buildCircle({
    uid: uiUid,
    public: true,
    type: 'LINES',
    title: 'User Interface',
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    viewers: [userUid],
    editors: [userUid],
  });

  const following = await buildCircle({
    uid: followingUid,
    public: true,
    type: 'LINESMANY',
    title: 'Following',
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    viewers: [userUid],
    editors: [userUid],
  });

  const inbox = await buildCircle({
    uid: inboxUid,
    public: true,
    type: 'LINESMANY',
    title: 'Inbox',
    creator: 'myiworlds',
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    viewers: [userUid],
    editors: [userUid],
  });

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
      name: 'uid',
      value: userUid,
    },
    {
      name: 'kind',
      value: 'users',
      excludeFromIndexes: true,
    },
    {
      name: 'profileMedia',
      value: profileMediaUid,
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
      value: levelUid,
      excludeFromIndexes: true,
    },
    {
      name: 'balance',
      value: balanceuid,
      excludeFromIndexes: true,
    },
    {
      name: 'rating',
      value: ratingUid,
      excludeFromIndexes: true,
    },
    {
      name: 'uiEnabled',
      value: false,
      excludeFromIndexes: true,
    },
    {
      name: 'ui',
      value: uiUid,
      excludeFromIndexes: true,
    },
    {
      name: 'following',
      value: followingUid,
      excludeFromIndexes: true,
    },
    {
      name: 'inbox',
      value: inboxUid,
      excludeFromIndexes: true,
    },
  ];

  return createEntity(userToCreate, userUid);
}
