import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import GraphQLBigInt from 'graphql-bigint';
import { getEntityByKey } from '../../../../gcp/datastore/queries';
import UserType from '../UserType';
import createUsername from './functions/createUsername';

// This mutation will most likely only be called after visiting a page after account created
// or if they try to create content and do not have it set
const CreateUsernameMutation = mutationWithClientMutationId({
  name: 'createUsername',
  inputFields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    dateUpdated: { type: new GraphQLNonNull(GraphQLBigInt) },
  },

  outputFields: {
    status: {
      type: GraphQLString,
      resolve: payload => payload.status,
    },
    message: {
      type: GraphQLString,
      resolve: payload => payload.message,
    },
    updatedUser: {
      type: UserType,
      resolve: async payload =>
        getEntityByKey(
          'Users',
          payload.updatedEntityId,
          payload.contextUserId,
        ).then(response => response.entity),
    },
    latestVersionOfUser: {
      type: UserType,
      resolve: async payload =>
        getEntityByKey(
          payload.latestVersionOfEntity.newKind,
          payload.latestVersionOfEntity.new_id,
          payload.contextUserId,
        ).then(response => response.entity),
    },
  },

  mutateAndGetPayload: async (inputFields, context) =>
    createUsername(inputFields, context.user._id),
});

export default CreateUsernameMutation;
