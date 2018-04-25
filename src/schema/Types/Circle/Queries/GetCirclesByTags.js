/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import CircleType from '../CircleType';
import { getEntities } from '../../../../gcp/datastore/queries';

export const getCirclesByTags = {
  name: 'GetCircleBySlug',
  type: new GraphQLList(CircleType),
  args: {
    tags: { type: new GraphQLList(GraphQLString) },
    requestedNumberOfResults: { type: GraphQLInt },
  },
  resolve: async (query, { tags, requestedNumberOfResults }, context) => {
    const numberOfResults =
      requestedNumberOfResults > 15 || !requestedNumberOfResults
        ? 15
        : requestedNumberOfResults;

    const tagSearch = tags.map(tag => ({
      property: 'tags',
      condition: '=',
      value: tag,
    }));

    const userUid = context.user && context.user.uid ? context.user.uid : null;

    return getEntities(
      'circles',
      tagSearch,
      numberOfResults,
      null,
      userUid,
    ).then(response => response.entities);
  },
};
