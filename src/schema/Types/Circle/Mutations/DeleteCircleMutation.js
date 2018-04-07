import { mutationWithClientMutationId } from 'graphql-relay';
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { deleteEntity } from '../../../../gcp/datastore/queries';

const DeleteCircleMutation = mutationWithClientMutationId({
  name: 'deleteCircle',

  inputFields: {
    _id: {
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

  mutateAndGetPayload: async ({ _id }, context) =>
    deleteEntity('Circles', _id, context.user._id),
});

export default DeleteCircleMutation;
