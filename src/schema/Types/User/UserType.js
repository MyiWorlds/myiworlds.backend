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

import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import CircleType from '../Circle/CircleType';
import { nodeInterface } from '../../Node';
// import getCircleByKey from '../../gcp/datastore';

export default new GraphQLObjectType({
  name: 'User',
  description: 'user who can create and interact with circles.',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField(),
    _id: { type: new GraphQLNonNull(GraphQLID) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    emailConfirmed: { type: GraphQLBoolean },
    level: {
      description:
        'Users account level. Higher rank has more unlocked services with a greator discount',
      type: new GraphQLNonNull(GraphQLInt),
    },
    balance: {
      description: 'The users currently oweing balance',
      type: CircleType,
      resolve: async (circle, args, { circleByKey }) => {
        if (circle.balance) {
          return circleByKey.load(circle.balance);
        }
        return null;
      },
    },
    rating: {
      description: 'The Users rating',
      type: CircleType,
      resolve: async (circle, args, { circleByKey }) => {
        if (circle.rating) {
          return circleByKey.load(circle.rating);
        }
        return null;
      },
    },
    ui: {
      description: 'How the user wants to view the system.',
      type: CircleType,
      resolve: (user, args, { userByKey }) => {
        if (user.ui) {
          return userByKey.load(user.ui);
        }
        return null;
      },
    },
    homePublic: {
      description: 'The home circle of myiworlds.com/user/userName.',
      type: CircleType,
      resolve: (user, args, { userByKey }) => {
        if (user.home) {
          return userByKey.load(user.home);
        }
        return null;
      },
    },
    homePrivate: {
      description: 'The home circle of myiworlds.com/user/userName.',
      type: CircleType,
      resolve: (user, args, { userByKey }) => {
        if (user.home) {
          return userByKey.load(user.home);
        }
        return null;
      },
    },
    watching: {
      description:
        'All circles created by this user, they are not stored on the user object but its own node in the graph to prevent overloading this.  No concepts of friends, just things you follow, it could be a friends page though.',
      type: CircleType,
      resolve: (user, args, { userByKey }) => {
        if (user.line) {
          return userByKey.load(user.line);
        }
        return null;
      },
    },
  }),
});
