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
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import CircleType from './CircleType';
import { nodeInterface } from './Node';

import getCircleByKey from '../gcp/datastore';

export default new GraphQLObjectType({
  name: 'User',
  interfaces: [nodeInterface],
  description: 'user who can create and interact with circles.',

  fields: {
    id: globalIdField(),

    _id: { type: new GraphQLNonNull(GraphQLID) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    emailConfirmed: { type: GraphQLBoolean },
    ui: {
      description: 'The users default user inteface',
      type: CircleType,
      resolve: async (circle, args, { loaders }) => {
        if (circle.rating) {
          return loaders.pageLoader.load(circle.ui);
        }
        return null;
      },
    },
    styles: {
      type: new GraphQLList(CircleType),
      description: 'Styles a user wants to override specific content types',
      resolve: async (user, args, { loaders }) => {
        if (user.styles) {
          return await loaders.circleLoader.loadMany(user.styles);
        }
        return null;
      },
    },
    home: {
      type: CircleType,
      description: 'The home circle of myiworlds.com/user/userName.',
      resolve: user => {
        if (user.home) {
          return getCircleByKey(user.circle);
        }
        return null;
      },
    },
    circlesCreated: {
      type: CircleType,
      description:
        'All circles created by this user, they are not stored on the user object but its own node in the graph to prevent overloading this',
      resolve: user => {
        if (user.circlesCreated) {
          return getCircleByKey(user.circle);
        }
        return null;
      },
    },
  },
});
