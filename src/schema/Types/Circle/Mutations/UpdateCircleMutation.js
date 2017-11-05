import { mutationWithClientMutationId } from 'graphql-relay';
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { getEntityByKey } from '../../../../gcp/datastore/queries';
import CircleType from '../CircleType';
import updateCircle from './functions/updateCircle';

// Pull from context
const userId = 'davey';

const UpdateCircleMutation = mutationWithClientMutationId({
  name: 'updateCircle',
  inputFields: {
    _id: { type: new GraphQLNonNull(GraphQLString) },
    slug: { type: GraphQLString },
    slugName: { type: GraphQLString },
    public: { type: GraphQLBoolean },
    passwordRequired: { type: GraphQLBoolean },
    viewers: { type: new GraphQLList(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    styles: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    order: { type: GraphQLInt },
    title: { type: GraphQLString },
    subtitle: { type: GraphQLString },
    description: { type: GraphQLString },
    media: { type: GraphQLString },
    creator: { type: new GraphQLNonNull(GraphQLString) },
    editors: { type: new GraphQLList(GraphQLString) },
    dateCreated: { type: GraphQLString },
    dateUpdated: { type: GraphQLString },
    string: { type: GraphQLString },
    blob: { type: GraphQLJSON },
    number: { type: GraphQLInt },
    boolean: { type: GraphQLBoolean },
    line: { type: GraphQLString },
    lines: { type: new GraphQLList(GraphQLString) },
    linesMany: { type: new GraphQLList(GraphQLString) },
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

  mutateAndGetPayload: async inputFields => updateCircle(inputFields, userId),
});
export default UpdateCircleMutation;
