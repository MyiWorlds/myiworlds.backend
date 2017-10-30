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
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import CircleType from '../Circle/CircleType';
import { nodeInterface } from '../../Node';

export default new GraphQLObjectType({
  name: 'User',
  description: 'user who can create and interact with circles.',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField('User', user => user._id),
    _id: { type: new GraphQLNonNull(GraphQLID) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    emailConfirmed: { type: GraphQLBoolean },
    dateCreated: { type: GraphQLString },
    level: {
      type: CircleType,
      resolve: (user, args, { circleByKey }) => {
        if (user.level) {
          return circleByKey.load(user.level);
        }
        return null;
      },
    },
    balance: {
      description: 'The users currently oweing balance',
      type: CircleType,
      resolve: (user, args, { circleByKey }) => {
        if (user.balance) {
          return circleByKey.load(user.balance);
        }
        return null;
      },
    },
    rating: {
      description: 'The Users rating',
      type: CircleType,
      resolve: (user, args, { circleByKey }) => {
        if (user.rating) {
          return circleByKey.load(user.rating);
        }
        return null;
      },
    },
    ui: {
      description: 'How the user wants to view the system.',
      type: CircleType,
      resolve: (user, args, { circleByKey }) => {
        if (user.ui) {
          return circleByKey.load(user.ui);
        }
        return null;
      },
    },
    homePublic: {
      description: 'The home circle of myiworlds.com/user/userName.',
      type: CircleType,
      resolve: (user, args, { circleByKey }) => {
        if (user.homePublic) {
          return circleByKey.load(user.homePublic);
        }
        return null;
      },
    },
    homePrivate: {
      description: 'The home circle of myiworlds.com/user/userName.',
      type: CircleType,
      resolve: (user, args, { circleByKey }) => {
        if (user.homePrivate) {
          return circleByKey.load(user.homePrivate);
        }
        return null;
      },
    },
    following: {
      description:
        'All circles created by this user, they are not stored on the user object but its own node in the graph to prevent overloading this.  No concepts of friends, just things you follow, it could be a friends page though.',
      type: CircleType,
      resolve: (user, args, { circleByKey }) => {
        if (user.following) {
          return circleByKey.load(user.following);
        }
        return null;
      },
    },
    notifications: {
      description: 'Contains a list of notifications.',
      type: CircleType,
      resolve: (user, args, { circleByKey }) => {
        if (user.notifications) {
          return circleByKey.load(user.notifications);
        }
        return null;
      },
    },
  }),
});
