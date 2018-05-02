/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString } from 'graphql';
import CircleType from '../CircleType';
import { getEntities } from '../../../../gcp/datastore/queries';

export const getCircleBySlug = {
  name: 'GetCircleBySlug',
  type: CircleType,
  args: {
    username: { type: GraphQLString },
    slug: { type: GraphQLString },
  },
  resolve: async (query, { username, slug }, context) => {
    let searchSlug = slug;

    if (searchSlug === undefined || searchSlug === '' || searchSlug === null) {
      searchSlug = '/';
    } else {
      searchSlug = slug.toLowerCase();
    }
    const userUid = context.user && context.user.uid ? context.user.uid : null;

    const creatorId = await getEntities(
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
    ).then(response => response.entities[0].uid);

    return getEntities(
      'circles',
      [
        {
          property: 'creator',
          condition: '=',
          value: creatorId,
        },
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
