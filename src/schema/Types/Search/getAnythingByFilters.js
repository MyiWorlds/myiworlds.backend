/* @flow */
/* eslint-disable import/prefer-default-export */

import {
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import { getEntities } from '../../../gcp/datastore/queries';

import CircleType from '../Circle/CircleType';

export const getAnythingByFilters = {
  name: 'GetAnythingByFilters',
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
    if (!filters.searchConditions) {
      return;
    }
    const numberOfResults =
      requestedNumberOfResults > 100 || !requestedNumberOfResults
        ? 100
        : requestedNumberOfResults;

    if (filters.searchConditions.length > 20) {
      filters.searchConditions.length = 20
    }

    const filtersToSearch = filters.searchConditions.map(filter => ({
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
