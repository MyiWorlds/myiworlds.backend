/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString } from 'graphql';
import CircleType from '../CircleType';
import { getEntities, getEntityByKey } from '../../../../gcp/datastore/queries';

export const getCircleByUsername = {
  name: 'GetCircleByUsername',
  type: CircleType,
  args: {
    username: { type: GraphQLString },
  },
  resolve: async (query, { username }, context) => {
    const userUid = context.user && context.user.uid ? context.user.uid : null;

    const user = await getEntities(
      'users',
      [
        {
          property: 'username',
          condition: '=',
          value: username,
        },
      ],
      1,
      null,
      'APP',
    ).then(response => response.entities[0]);

    const getCircle = await getEntityByKey('circles', user.homePublic, userUid);

    return getCircle.entity;
  },
};
