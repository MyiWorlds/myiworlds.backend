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

const UpdateCircleMutation = mutationWithClientMutationId({
  name: 'updateCircle',
  inputFields: {
    uid: { type: new GraphQLNonNull(GraphQLString) },
    parent: { type: GraphQLString },
    slug: { type: GraphQLString },
    slugName: { type: GraphQLString },
    public: { type: GraphQLBoolean },
    passwordRequired: { type: GraphQLBoolean },
    viewers: { type: new GraphQLList(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    settings: { type: new GraphQLList(GraphQLString) },
    styles: { type: new GraphQLList(GraphQLString) },
    tags: { type: new GraphQLList(GraphQLString) },
    rating: { type: GraphQLString },
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
    object: { type: GraphQLJSON },
    number: { type: GraphQLInt },
    boolean: { type: GraphQLBoolean },
    line: { type: GraphQLString },
    lines: { type: new GraphQLList(GraphQLString) },
    linesMany: { type: new GraphQLList(GraphQLString) },
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
            payload.latestVersionOfEntity.newId,
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
export default UpdateCircleMutation;
