// import users from './users';
import createUser from '../../../schema/Types/User/Mutations/functions/createUser';
// import circles from './circles';
// import { createEntities } from '../queries';

const seed = async () => {
  await createUser(
    {
      uid: 'APP',
      // username: 'APP',
      email: 'app@myworlds.com',
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      profileMedia: 'https://www.w3schools.com/w3css/img_lights.jpg',
    },
    'APP',
  );
  // await createEntities(circles);
};
seed();
