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
    getMyCreations: {type: new GraphQLNonNull(GraphQLBoolean)},
    getMyViewable: {type: new GraphQLNonNull(GraphQLBoolean)},
    getMyEditable: {type: new GraphQLNonNull(GraphQLBoolean)},
    getAllResults: {type: new GraphQLNonNull(GraphQLBoolean)},
    kind: { type:   GraphQLString },
    filters: { type: new GraphQLNonNull(GraphQLJSON) },
    requestedNumberOfResults: { type: GraphQLInt },
    cursor: { type: GraphQLString },
  },
  resolve: async (
    query,
    {
      getMyCreations,
      getMyViewable,
      getMyEditable,
      getAllResults,
      kind,
      filters,
      requestedNumberOfResults,
      cursor
    },
    context,
  ) => globalSearchFunction(
    getMyCreations,
    getMyViewable,
    getMyEditable,
    getAllResults,
    kind,
    filters.searchConditions,
    requestedNumberOfResults,
    cursor,
    context.user.uid
  ).then(res => {
    return res;
  }),
};
