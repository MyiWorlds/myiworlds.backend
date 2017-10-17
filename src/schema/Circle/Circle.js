/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString } from 'graphql';
import CircleType from './CircleType';
import getEntities from '../../gcp/datastore';

const Circle = {
  type: CircleType,
  args: {
    pathFull: { type: GraphQLString },
  },
  resolve: (query, { slug }) =>
    getEntities(
      'Circles',
      {
        property: 'slug',
        condition: '=',
        value: slug,
      },
      1,
      null,
      'viewerId00000000000001----ADD HERE',
    ).then(response => response.entities[0]),
};

export default Circle;
