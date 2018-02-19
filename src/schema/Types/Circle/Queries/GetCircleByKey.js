/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString } from 'graphql';
import CircleType from '../CircleType';
import { getEntityByKey } from '../../../../gcp/datastore/queries';

export const getCircleByKey = {
  name: 'GetCircleByKey',
  type: CircleType,
  args: {
    _id: { type: GraphQLString },
  },
  resolve: async (query, { _id }, context) =>
    getEntityByKey('Circles', _id, context.user._id).then(response => response.entity),
};
