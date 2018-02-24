/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString, GraphQLList } from 'graphql';
import CircleType from '../CircleType';
import { getEntities } from '../../../../gcp/datastore/queries';

export const getCirclesByUserKey = {
  name: 'GetCirclesByUserKey',
  type: new GraphQLList(CircleType),
  resolve: async (query, args, context) => {
    return getEntities(
      'Circles',
      [
        {
          property: 'creator',
          condition: '=',
          value: context.user._id,
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
