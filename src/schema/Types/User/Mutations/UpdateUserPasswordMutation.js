import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { getEntityByKey } from '../../../../gcp/datastore/queries';
import UserType from '../UserType';
import updateUser from './functions/updateUser';

// Get from context
const userId = 'davey';

// This mutation will most likely only be called after visiting a page from email
const UpdateUserPasswordMutation = mutationWithClientMutationId({
  name: 'updateUserPassword',
  inputFields: {
    _id: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    dateUpdated: { type: new GraphQLNonNull(GraphQLString) },
  },

  outputFields: {
    message: {
      type: GraphQLString,
      resolve: payload => payload.message,
    },
    updatedUser: {
      type: UserType,
      resolve: async payload =>
        getEntityByKey('Users', payload.updatedEntityId, userId).then(
          response => response.entity,
        ),
    },
    latestVersionOfUser: {
      type: UserType,
      resolve: async payload =>
        getEntityByKey(
          payload.latestVersionOfEntity.newKind,
          payload.latestVersionOfEntity.new_id,
          userId,
        ).then(response => response.entity),
    },
  },

  mutateAndGetPayload: async inputFields => updateUser(inputFields, userId),
});

export default UpdateUserPasswordMutation;
