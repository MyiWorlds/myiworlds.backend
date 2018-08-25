/* eslint-disable import/prefer-default-export */

import {
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import CircleType from '../Circle/CircleType';
import globalSearchFunction from '../functions/globalSearch';

export const globalSearch = {
  name: 'Search',
  type: CircleType,
  args: {
    circle: { type: new GraphQLNonNull(GraphQLJSON) },
  },
  resolve: async (
    query,
    { circle },
    context,
  ) => globalSearchFunction( circle, context.user.uid).then(res => res),
};
