/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString, GraphQLList } from 'graphql';
import CircleType from '../CircleType';
import { getEntities } from '../../../../gcp/datastore/queries';

// Pull from context
const userId = 'davey';

export const getCirclesByUserKey = {
  name: 'GetCirclesByUserKey',
  type: new GraphQLList(CircleType),
  args: {
    creator: { type: GraphQLString },
  },
  resolve: async (query, { creator }) => {
    if (creator === undefined || creator === '' || creator === null) {
      creator = creator || userId;
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
      userId,
    ).then(response => response.entities);
  },
};
