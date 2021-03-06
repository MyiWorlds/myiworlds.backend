import { mutationWithClientMutationId } from 'graphql-relay';
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import GraphQLBigInt from 'graphql-bigint';
import GraphQLJSON from 'graphql-type-json';

import { getEntityByKey } from '../../../../gcp/datastore/queries';
import CircleType from '../CircleType';
import createCircle from './functions/createCircle';

const CreateCircleMutation = mutationWithClientMutationId({
  name: 'createCircle',
  inputFields: {
    uid: { type: GraphQLString },
    pii: { type: new GraphQLNonNull(GraphQLBoolean) },
    parent: { type: GraphQLString },
    slug: { type: GraphQLString },
    public: { type: new GraphQLNonNull(GraphQLBoolean) },
    passwordRequired: { type: GraphQLBoolean },
    password: { type: GraphQLString },
    viewers: { type: new GraphQLList(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    settings: { type: GraphQLJSON },
    styles: { type: new GraphQLList(GraphQLString) },
    tags: { type: new GraphQLList(GraphQLString) },
    rating: { type: GraphQLString },
    title: { type: GraphQLString },
    subtitle: { type: GraphQLString },
    description: { type: GraphQLString },
    media: { type: GraphQLString },
    icon: { type: GraphQLString },
    creator: { type: new GraphQLNonNull(GraphQLString) },
    editors: { type: new GraphQLList(GraphQLString) },
    dateCreated: { type: GraphQLBigInt },
    dateUpdated: { type: GraphQLBigInt },
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
      resolve: response => response.status,
    },
    message: {
      type: GraphQLString,
      resolve: response => response.message,
    },
    createdCircle: {
      type: CircleType,
      resolve: async payload =>
        await getEntityByKey(
          'circles',
          payload.createdEntityUid,
          payload.contextUserUid,
        ).then(response => response.entity),
    },
  },

  mutateAndGetPayload: async (inputFields, context) =>
    await createCircle(inputFields, context.user.uid),
});

export default CreateCircleMutation;
