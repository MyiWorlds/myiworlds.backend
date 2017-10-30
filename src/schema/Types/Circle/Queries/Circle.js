/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString } from 'graphql';
import CircleType from '../CircleType';
import { getEntities } from '../../../../gcp/datastore/queries';

// Pull from context
const userId = 'viewer00000000000000000000000000001';

export const circle = {
  name: 'Circle',
  type: CircleType,
  args: {
    slug: { type: GraphQLString },
  },
  resolve: async (query, { slug }) =>
    getEntities(
      'Circles',
      [
        {
          property: '_id',
          condition: '=',
          value: slug,
        },
      ],
      1,
      null,
      userId,
    ).then(response => response.entities[0]),
};
