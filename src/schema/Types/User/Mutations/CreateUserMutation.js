import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { getEntityByKey } from '../../../../gcp/datastore/queries';
import UserType from '../UserType';
import createUser from './functions/createUser';

const CreateUserMutation = mutationWithClientMutationId({
  name: 'createUser',
  inputFields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    dateCreated: { type: GraphQLString },
  },

  outputFields: {
    message: {
      type: GraphQLString,
      resolve: response => response.message,
    },
    createdUser: {
      type: UserType,
      resolve: async payload =>
        getEntityByKey('Users', payload.createdEntityId, 'new-user').then(
          response => response.entity,
        ),
    },
  },

  mutateAndGetPayload: async inputFields => createUser(inputFields),
});

export default CreateUserMutation;
