/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString } from 'graphql';
import CircleType from '../CircleType';
import { getEntities } from '../../../../gcp/datastore/queries';

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
          value: '0fd2aab0-b7a9-11e7-bf27-9790433b5050',
        },
      ],
      1,
      null,
      'viewer000000000000000000000000000001',
    ).then(response => response.entities[0]),
};
