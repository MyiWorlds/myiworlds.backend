import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLBoolean, GraphQLString, GraphQLNonNull } from 'graphql';
import { getEntityByKey } from '../../../../gcp/datastore/queries';
import UserType from '../UserType';
import updateUser from './functions/updateUser';

// This mutation will most likely only be called after visiting a page from email
const UpdateUiEnabledMutation = mutationWithClientMutationId({
  name: 'updateUiEnabled',
  inputFields: {
    uid: { type: new GraphQLNonNull(GraphQLString) },
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
        getEntityByKey(
          'users',
          payload.updatedEntityUid,
          context.user.uid,
        ).then(response => response.entity),
    },
    latestVersionOfUser: {
      type: UserType,
      resolve: async (payload, context) =>
        getEntityByKey(
          payload.latestVersionOfEntity.newKind,
          payload.latestVersionOfEntity.newUid,
          context.user.uid,
        ).then(response => response.entity),
    },
  },

  mutateAndGetPayload: async (inputFields, context) =>
    updateUser(inputFields, context.user.uid),
});

export default UpdateUiEnabledMutation;
