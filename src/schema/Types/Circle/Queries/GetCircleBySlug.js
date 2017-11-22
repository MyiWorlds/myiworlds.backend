/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString } from 'graphql';
import CircleType from '../CircleType';
import { getEntities } from '../../../../gcp/datastore/queries';

// Pull from context
const userId = 'davey';

export const getCircleBySlug = {
  name: 'GetCircleBySlug',
  type: CircleType,
  args: {
    slug: { type: GraphQLString },
  },
  resolve: async (query, { slug }) => {
    let searchSlug = slug;

    if (searchSlug === undefined || searchSlug === '' || searchSlug === null) {
      searchSlug = '/';
    }

    return getEntities(
      'Circles',
      [
        {
          property: 'slug',
          condition: '=',
          value: searchSlug.toLowerCase(),
        },
      ],
      1,
      null,
      userId,
    ).then(response => response.entities[0]);
  },
};
