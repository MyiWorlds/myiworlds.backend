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
import createCircle from './functions/createCircle';

const userId = 'davey';

const CreateCircleMutation = mutationWithClientMutationId({
  name: 'createCircle',
  inputFields: {
    _id: { type: GraphQLString },
    slug: { type: GraphQLString },
    slugName: { type: GraphQLString },
    public: { type: GraphQLBoolean },
    passwordRequired: { type: GraphQLBoolean },
    password: { type: GraphQLString },
    viewers: { type: new GraphQLList(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    styles: { type: new GraphQLList(GraphQLString) },
    tags: { type: new GraphQLList(GraphQLString) },
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
      resolve: response => response.message,
    },
    createdCircle: {
      type: CircleType,
      resolve: async payload =>
        getEntityByKey('Circles', payload.createdEntityId, userId).then(
          response => response.entity,
        ),
    },
  },

  mutateAndGetPayload: async inputFields => createCircle(inputFields, userId),
});

export default CreateCircleMutation;
