/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
/* eslint-disable no-underscore-dangle */

import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import {
  connectionArgs,
  connectionFromArray,
  globalIdField,
} from 'graphql-relay';
import GraphQLJSON from 'graphql-type-json';
import { nodeInterface } from '../Node';
import UserType from '../User';

const CircleType = new GraphQLObjectType({
  name: 'Circle',
  description: 'Everycircle you see can be placed inside a circle.',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField('Circle', circle => circle._id),
    _id: {
      description:
        'A unique id used to instantly locate this circle inside the database',
      type: GraphQLID,
    },
    ui: {
      description: 'If a user interface is not set.',
      type: CircleType,
      resolve: async (circle, args, { circleByKey }) => {
        if (circle.rating) {
          return circleByKey.load(circle.ui);
        }
        return null;
      },
    },
    slug: {
      description: 'The full slug (after domain name) to this piece of content',
      type: GraphQLString,
    },
    slugName: {
      type: GraphQLString,
      description:
        'The name of this slug without creators name before it. This allows shared Users to edit the title, but not the root path.  This is stored incase the creators name changes',
    },
    public: {
      description: 'Is this circle visable to the public?',
      type: GraphQLBoolean,
    },
    viewers: {
      description: 'Who is allowed to see this node?',
      type: new GraphQLList(UserType),
      resolve: (circle, args, { usersByKeys }) =>
        usersByKeys.loadMany(circle.Users),
    },
    type: {
      description:
        'The type of data this node is holding, it allows the frontend to choose the perfect component to show you.',
      type: new GraphQLNonNull(GraphQLString),
    },
    rating: {
      type: CircleType,
      resolve: async (circle, args, { circleByKey }) => {
        if (circle.rating) {
          return circleByKey.load(circle.rating);
        }
        return null;
      },
    },
    styles: {
      type: new GraphQLList(CircleType),
      resolve: (circle, args, { circlesByKeys }) =>
        circlesByKeys.loadMany(circle.styles),
    },
    tags: {
      type: new GraphQLList(CircleType),
      resolve: (circle, args, { circlesByKeys }) =>
        circlesByKeys.loadMany(circle.tags),
    },
    title: { type: GraphQLString },
    subtitle: { type: GraphQLString },
    description: { type: GraphQLString },
    media: {
      description:
        'A piece of media (image/gif/video) that helps identify this piece of content.',
      type: CircleType,
      resolve: async (circle, args, { circleByKey }) => {
        if (circle.media) {
          return circleByKey.load(circle.media);
        }
        return null;
      },
    },
    creator: {
      description: 'The User who created this piece of content',
      type: UserType,
      resolve: (circle, args, { userByKey }) => userByKey.load(circle.creator),
    },
    editors: {
      description: 'Users that can edit this circle',
      type: new GraphQLList(UserType),
      resolve: async (circle, args, { usersByKeys }) => {
        if (circle.editors) {
          return usersByKeys.loadMany(circle.editors);
        }
        return null;
      },
    },
    dateCreated: { type: GraphQLString },
    dateUpdated: { type: GraphQLString },
    string: { type: GraphQLString },
    blob: { type: GraphQLJSON },
    number: { type: GraphQLInt },
    boolean: { type: GraphQLBoolean },
    line: {
      description:
        'When you want to point to a single circle type.  Normally used for changing a node but without actually changing it.',
      type: CircleType,
      resolve: (circle, args, { circleByKey }) => {
        if (circle.array) {
          return circleByKey.load(circle.line);
        }
        return null;
      },
    },
    lines: {
      description:
        "When you want to connect lots of Circles, but don't need pagination (used for TONS of results) ",
      type: new GraphQLList(CircleType),
      resolve: (circle, args, { circlesByKeys }) => {
        if (circle.array) {
          return circlesByKeys.loadMany(circle.lines);
        }
        return null;
      },
    },
    linesMany: {
      description:
        'When you need to connect lots of Circles together, but you only want to show a certain amount at a time',
      type: require('./CircleConnection').default, // eslint-disable-line global-require
      args: connectionArgs,
      resolve: async (circle, { ...args }, { circlesByKeys }) => {
        if (circle.array) {
          const linesMany = await circlesByKeys.loadMany(circle.linesMany);
          const connection = connectionFromArray(linesMany, args);
          return connection;
        }
        return null;
      },
    },
  }),
});

export default CircleType;
