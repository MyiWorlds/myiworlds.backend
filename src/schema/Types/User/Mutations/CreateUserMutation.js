import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import GraphQLBigInt from 'graphql-bigint';

import { getEntityByKey } from '../../../../gcp/datastore/queries';
import UserType from '../UserType';
import createUser from './functions/createUser';

const CreateUserMutation = mutationWithClientMutationId({
  name: 'createUser',
  inputFields: {
    uid: { type: GraphQLString },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    // password: { type: new GraphQLNonNull(GraphQLString) },
    dateCreated: { type: new GraphQLNonNull(GraphQLBigInt) },
    dateUpdated: { type: new GraphQLNonNull(GraphQLBigInt) },
  },

  outputFields: {
    status: {
      type: GraphQLString,
      resolve: response => response.status,
    },
    message: {
      type: GraphQLString,
      resolve: response => response.message,
    },
    createdUser: {
      type: UserType,
      resolve: async payload =>
        getEntityByKey('users', payload.createdEntityUid, 'new-user').then(
          response => response.entity,
        ),
    },
  },

  mutateAndGetPayload: async inputFields => createUser(inputFields),
});

export default CreateUserMutation;
