import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { getEntityByKey } from '../../../../gcp/datastore/queries';
import UserType from '../UserType';
import updateUser from './functions/updateUser';

// This mutation will most likely only be called after visiting a page from email
const UpdateEmailConfirmedMutation = mutationWithClientMutationId({
  name: 'updateEmailConfirmed',
  inputFields: {
    _id: { type: new GraphQLNonNull(GraphQLString) },
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
        getEntityByKey('Users', payload.updatedEntityId, payload.contextUserId).then(
          response => response.entity,
        ),
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

  mutateAndGetPayload: async (inputFields, context) => {
    const updatedInputFields = Object.assign(inputFields, {
      emailConfirmed: true,
    });
    return updateUser(updatedInputFields, context.user._id);
  },
});
export default UpdateEmailConfirmedMutation;
