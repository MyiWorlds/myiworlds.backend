/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLList } from 'graphql';
import CircleType from '../CircleType';
import { getEntities } from '../../../../gcp/datastore/queries';

export const getCirclesByUserKey = {
  name: 'GetCirclesByUserKey',
  type: new GraphQLList(CircleType),
  resolve: async (query, args, context) => {
    const userUid = context.user && context.user.uid ? context.user.uid : null;

    if (!userUid) {
      return null;
    }

    return getEntities(
      'circles',
      [
        {
          property: 'creator',
          condition: '=',
          value: userUid,
        },
        {
          property: 'dateUpdated',
          condition: '<',
          value: Date.now().toString(),
        },
      ],
      15,
      null,
      userUid,
    ).then(response => response.entities);
  },
};
