import { mutationWithClientMutationId } from 'graphql-relay';
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { deleteEntity } from '../../../../gcp/datastore/queries';

const userId = 'davey';

const DeleteUserMutation = mutationWithClientMutationId({
  name: 'deleteUser',

  inputFields: {
    _id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },

  outputFields: {
    message: {
      type: GraphQLString,
      resolve: response => response.message,
    },
    idToDelete: {
      type: GraphQLString,
      resolve: response => response.idToDelete,
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
  },

  mutateAndGetPayload: async ({ _id }) => deleteEntity('Users', _id, userId),
});

export default DeleteUserMutation;
