/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString } from 'graphql';
import CircleType from '../CircleType';
import { getEntities } from '../../../../gcp/datastore/queries';

export const getCircleBySlug = {
  name: 'GetCircleBySlug',
  type: CircleType,
  args: {
    slug: { type: GraphQLString },
  },
  resolve: async (query, { slug }, context) => {
    let searchSlug = slug;

    if (searchSlug === undefined || searchSlug === '' || searchSlug === null) {
      searchSlug = '/';
    }
    const userUid = context.user && context.user.uid ? context.user.uid : null;

    return getEntities(
      'circles',
      [
        {
          property: 'slug',
          condition: '=',
          value: searchSlug.toLowerCase(),
        },
      ],
      1,
      null,
      userUid,
    ).then(response => response.entities[0]);
  },
};
