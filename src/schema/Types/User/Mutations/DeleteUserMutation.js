import { mutationWithClientMutationId } from 'graphql-relay';
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import deleteUser from './functions/deleteUser';

const DeleteUserMutation = mutationWithClientMutationId({
  name: 'deleteUser',

  inputFields: {
    uid: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
    uidToDelete: {
      type: GraphQLString,
      resolve: response => response.uidToDelete,
    },
    wasDeleted: {
      type: GraphQLBoolean,
      resolve: response => response.wasDeleted,
    },
    numberOfClones: {
      type: GraphQLInt,
      resolve: response => response.numberOfClones,
    },
    clonesDeleted: {
      type: GraphQLBoolean,
      resolve: response => response.clonesDeleted,
    },
    profileMediaDeleted: {
      type: GraphQLBoolean,
      resolve: response => response.profileMediaDeleted,
    },
  },

  mutateAndGetPayload: ({ uid }, context) => deleteUser(uid, context.user.uid),
});

export default DeleteUserMutation;
