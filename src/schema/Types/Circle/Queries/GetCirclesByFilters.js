/* @flow */
/* eslint-disable import/prefer-default-export */

import {
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import { getEntities } from '../../../../gcp/datastore/queries';

import CircleType from '../CircleType';

export const getCirclesByFilters = {
  name: 'GetCirclesByFilters',
  type: new GraphQLList(CircleType),
  args: {
    kind: { type: new GraphQLNonNull(GraphQLString) },
    filters: { type: new GraphQLNonNull(GraphQLJSON) },
    requestedNumberOfResults: { type: GraphQLInt },
  },
  resolve: async (
    query,
    { kind, filters, requestedNumberOfResults },
    context,
  ) => {
    const numberOfResults =
      requestedNumberOfResults > 15 || !requestedNumberOfResults
        ? 15
        : requestedNumberOfResults;

    const filtersToSearch = filters.list.map(filter => ({
      property: filter.property,
      condition: filter.condition,
      value: filter.value,
    }));

    const userUid = context.user && context.user.uid ? context.user.uid : null;

    return getEntities(
      kind,
      filtersToSearch,
      numberOfResults,
      null,
      userUid,
    ).then(response => response.entities);
  },
};
