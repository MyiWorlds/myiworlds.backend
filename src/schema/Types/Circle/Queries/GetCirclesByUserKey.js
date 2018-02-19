/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString, GraphQLList } from 'graphql';
import CircleType from '../CircleType';
import { getEntities } from '../../../../gcp/datastore/queries';

export const getCirclesByUserKey = {
  name: 'GetCirclesByUserKey',
  type: new GraphQLList(CircleType),
  args: {
    creator: { type: GraphQLString },
  },
  resolve: async (query, { creator }, context) => {
    if (creator === undefined || creator === '' || creator === null) {
      creator = creator || context.user._id;
    }

    return getEntities(
      'Circles',
      [
        {
          property: 'creator',
          condition: '=',
          value: creator.toLowerCase(),
        },
        {
          property: 'dateUpdated',
          condition: '<',
          value: Date.now().toString(),
        },
      ],
      15,
      null,
      context.user._id,
    ).then(response => response.entities);
  },
};
