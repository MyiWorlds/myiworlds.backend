import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { getEntityByKey } from '../../../../gcp/datastore/queries';
import CircleType from '../CircleType';
import updateCircle from './functions/updateCircle';

const UpdateCirclePasswordMutation = mutationWithClientMutationId({
  name: 'updateCirclePassword',
  inputFields: {
    uid: { type: new GraphQLNonNull(GraphQLString) },
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
        if (payload.updatedEntityUid) {
          return getEntityByKey(
            'circles',
            payload.updatedEntityUid,
            payload.contextUserUid,
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
            payload.latestVersionOfEntity.newUid,
            payload.contextUserUid,
          ).then(response => response.entity);
        }
        return null;
      },
    },
  },

  mutateAndGetPayload: async (inputFields, context) =>
    updateCircle(inputFields, context.user.uid),
});

export default UpdateCirclePasswordMutation;
