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
import { nodeInterface } from '../../Node';
import UserType from '../User/UserType';

const CircleType = new GraphQLObjectType({
  name: 'Circle',
  description: 'Every circle you see can be placed inside a circle.',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField('Circle', circle => circle._id),
    _id: {
      description:
        'A unique id used to instantly locate this inside the database',
      type: GraphQLID,
    },
    ui: {
      description: 'If a user interface is not set',
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
    type: {
      description:
        'The type of data this node is holding, it allows the frontend to choose the perfect component to show you.',
      type: new GraphQLNonNull(GraphQLString),
    },
    settings: {
      description: 'The settings of this circle.  Will be used as an object.',
      type: GraphQLString,
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
      resolve: (circle, args, { circlesByKeys }) => {
        if (circle.styles && circle.styles.length > 0) {
          return circlesByKeys.loadMany(circle.styles);
        }
        return null;
      },
    },
    tags: {
      type: new GraphQLList(CircleType),
      resolve: (circle, args, { circlesByKeys }) => {
        if (circle.tags && circle.tags.length > 0) {
          return circlesByKeys.loadMany(circle.tags);
        }
        return null;
      },
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
    viewers: {
      description: 'Who is allowed to see this node?',
      type: new GraphQLList(UserType),
      resolve: async (circle, args, { usersByKeys }) => {
        if (circle.viewers && circle.viewers.length > 0) {
          return usersByKeys.loadMany(circle.viewers);
        }
        return null;
      },
    },
    creator: {
      description: 'The User who created this piece of content',
      type: UserType,
      resolve: (circle, args, { userByKey }) => {
        if (circle.creator) {
          return userByKey.load(circle.creator);
        }
        return null;
      },
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

    // Circle content types below
    string: { type: GraphQLString },
    text: { type: GraphQLString },
    blob: { type: GraphQLJSON },
    number: { type: GraphQLInt },
    boolean: { type: GraphQLBoolean },
    date: { type: GraphQLString },
    geoPoint: { type: GraphQLString },
    line: {
      description:
        'When you want to point to a single circle type.  Normally used for changing a node but without actually changing it.',
      type: CircleType,
      resolve: (circle, args, { circleByKey }) => {
        if (circle.line) {
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
        if (circle.lines && circle.lines.length > 0) {
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
        if (circle.linesMany) {
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
