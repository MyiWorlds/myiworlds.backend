import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLBoolean, GraphQLString, GraphQLNonNull } from 'graphql';
import { getEntityByKey } from '../../../../gcp/datastore/queries';
import UserType from '../UserType';
import updateUser from './functions/updateUser';

// This mutation will most likely only be called after visiting a page from email
const UpdateUiEnabledMutation = mutationWithClientMutationId({
  name: 'updateUiEnabled',
  inputFields: {
    _id: { type: new GraphQLNonNull(GraphQLString) },
    dateUpdated: { type: new GraphQLNonNull(GraphQLString) },
    uiEnabled: { type: new GraphQLNonNull(GraphQLBoolean) },
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
      resolve: async (payload, context) =>
        getEntityByKey('Users', payload.updatedEntityId, context.user._id).then(
          response => response.entity,
        ),
    },
    latestVersionOfUser: {
      type: UserType,
      resolve: async (payload, context) =>
        getEntityByKey(
          payload.latestVersionOfEntity.newKind,
          payload.latestVersionOfEntity.new_id,
          context.user._id,
        ).then(response => response.entity),
    },
  },

  mutateAndGetPayload: async (inputFields, context) =>
    updateUser(inputFields, context.user._id),
});

export default UpdateUiEnabledMutation;
