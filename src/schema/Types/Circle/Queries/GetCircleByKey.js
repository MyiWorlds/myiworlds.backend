/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString } from 'graphql';
import CircleType from '../CircleType';
import { getEntityByKey } from '../../../../gcp/datastore/queries';

export const getCircleByKey = {
  name: 'GetCircleByKey',
  type: CircleType,
  args: {
    uid: { type: GraphQLString },
  },
  resolve: async (query, { uid }, context) => {
    const userUid = context.user && context.user.uid ? context.user.uid : null;
    return getEntityByKey('circles', uid, userUid).then(
      response => response.entity,
    );
  },
};
