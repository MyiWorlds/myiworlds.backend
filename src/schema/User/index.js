import { GraphQLObjectType as ObjectType } from 'graphql';

import CreateUserMutation from './CreateUserMutation';
import UpdateUserMutation from './UpdateUserMutation';
import DeleteUserMutation from './DeleteUserMutation';

const Mutation = new ObjectType({
  name: 'Mutation',
  fields: {
    createUser: CreateUserMutation,
    updateUser: UpdateUserMutation,
    deleteUser: DeleteUserMutation,
  },
});

export default Mutation;
