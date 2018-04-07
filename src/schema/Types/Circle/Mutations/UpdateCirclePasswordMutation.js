import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { getEntityByKey } from '../../../../gcp/datastore/queries';
import CircleType from '../CircleType';
import updateCircle from './functions/updateCircle';

const UpdateCirclePasswordMutation = mutationWithClientMutationId({
  name: 'updateCirclePassword',
  inputFields: {
    _id: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
    dateUpdated: { type: new GraphQLNonNull(GraphQLString) },
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
    updatedCircle: {
      type: CircleType,
      resolve: async payload => {
        if (payload.updatedEntityId) {
          return getEntityByKey(
            'Circles',
            payload.updatedEntityId,
            payload.contextUserId,
          ).then(response => response.entity);
        }
        return null;
      },
    },
    latestVersionOfCircle: {
      type: CircleType,
      resolve: async payload => {
        if (payload.latestVersionOfEntity) {
          return getEntityByKey(
            payload.latestVersionOfEntity.newKind,
            payload.latestVersionOfEntity.new_id,
            payload.contextUserId,
          ).then(response => response.entity);
        }
        return null;
      },
    },
  },

  mutateAndGetPayload: async (inputFields, context) =>
    updateCircle(inputFields, context.user._id),
});

export default UpdateCirclePasswordMutation;
