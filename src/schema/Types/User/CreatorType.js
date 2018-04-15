/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

/* eslint-disable no-underscore-dangle */

import { GraphQLObjectType, GraphQLString, GraphQLID } from 'graphql';
import GraphQLBigInt from 'graphql-bigint';

import { globalIdField } from 'graphql-relay';

import CircleType from '../Circle/CircleType';
import { nodeInterface } from '../../node';

export default new GraphQLObjectType({
  name: 'Creator',
  description: 'The only part of a User that the public can all access.',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField('Creator', creator => creator._id),
    _id: {
      description:
        'A unique id used to instantly locate this inside the database',
      type: GraphQLID,
    },
    username: { type: GraphQLString },
    profileMedia: {
      description: 'The Users profile display pic',
      type: CircleType,
      resolve: (creator, args, { circleByKey }) => {
        if (creator.profileMedia) {
          return circleByKey.load(creator.profileMedia);
        }
        return null;
      },
    },
    dateCreated: { type: GraphQLBigInt },
    dateUpdated: { type: GraphQLBigInt },
    level: {
      type: CircleType,
      resolve: (creator, args, { circleByKey }) => {
        if (creator.level) {
          return circleByKey.load(creator.level);
        }
        return null;
      },
    },
    rating: {
      description: 'The Users rating',
      type: CircleType,
      resolve: (creator, args, { circleByKey }) => {
        if (creator.rating) {
          return circleByKey.load(creator.rating);
        }
        return null;
      },
    },
    ui: {
      description: 'How the creator wants to view the system.',
      type: CircleType,
      resolve: (creator, args, { circleByKey }) => {
        if (creator.ui) {
          return circleByKey.load(creator.ui);
        }
        return null;
      },
    },
    homePublic: {
      description: 'The home circle of myiworlds.com/creator/userName.',
      type: CircleType,
      resolve: (creator, args, { circleByKey }) => {
        if (creator.homePublic) {
          return circleByKey.load(creator.homePublic);
        }
        return null;
      },
    },
    following: {
      description:
        'All circles created by this creator, they are not stored on the creator object but its own node in the graph to prevent overloading this.  No concepts of friends, just things you follow, it could be a friends page though.',
      type: CircleType,
      resolve: (creator, args, { circleByKey }) => {
        if (creator.following) {
          return circleByKey.load(creator.following);
        }
        return null;
      },
    },
  }),
});
