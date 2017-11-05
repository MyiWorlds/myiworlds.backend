import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { getEntityByKey } from '../../../../gcp/datastore/queries';
import CircleType from '../CircleType';
import updateCirclePassword from './functions/updateCirclePassword';

// Pull from context
const userId = 'davey';

const UpdateCircleMutation = mutationWithClientMutationId({
  name: 'updateCircle',
  inputFields: {
    _id: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
  },

  outputFields: {
    message: {
      type: GraphQLString,
      resolve: payload => payload.message,
    },
    updatedCircle: {
      type: CircleType,
      resolve: async payload =>
        getEntityByKey('Circles', payload.createdEntityId, userId).then(
          response => response.entity,
        ),
    },
    latestVersionOfCircle: {
      type: CircleType,
      resolve: async payload =>
        getEntityByKey(
          payload.latestVersionOfEntity.newKind,
          payload.latestVersionOfEntity.new_id,
          userId,
        ).then(response => response.entity),
    },
  },

  mutateAndGetPayload: async inputFields =>
    updateCirclePassword(inputFields, userId),
});
export default UpdateCircleMutation;
