/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString } from 'graphql';
import CircleType from '../CircleType';
import { getEntityByKey } from '../../../../gcp/datastore/queries';

// Pull from context
const userId = 'davey';

export const getCircleByKey = {
  name: 'GetCircleByKey',
  type: CircleType,
  args: {
    _id: { type: GraphQLString },
  },
  resolve: async (query, { _id }) =>
    getEntityByKey('Circles', _id, userId).then(response => response.entity),
};
