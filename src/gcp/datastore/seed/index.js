// import users from './users';
import createUser from '../../../schema/Types/User/Mutations/functions/createUser';
// import circles from './circles';

const seed = async () => {
  await Promise.all(
    createUser(
      {
        uid: 'APP',
        // username: 'APP',
        email: 'myiworlds@myiworlds.com',
        dateCreated: Date.now(),
        dateUpdated: Date.now(),
      },
      'APP',
    ),
  );
};
seed();
// createEntities(circles);
