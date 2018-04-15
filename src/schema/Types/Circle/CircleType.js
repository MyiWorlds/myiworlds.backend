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
import GraphQLBigInt from 'graphql-bigint';

import { nodeInterface } from '../../node';

import CreatorType from '../User/CreatorType';

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
    parent: {
      description: 'The circle this was originally cloned from',
      type: CircleType,
      resolve: async (circle, args, { circleByKey }) => {
        if (circle.parent) {
          return circleByKey.load(circle.parent);
        }
        return null;
      },
    },
    ui: {
      description:
        'If a user interface is not set, the user will take the default styles of the page',
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
      description:
        'The name of this slug without creators name before it. This allows shared Users to edit the title, but not the root path.  This is stored incase the creators name changes',
      type: GraphQLString,
    },
    public: {
      description: 'Is this circle visable to the public?',
      type: GraphQLBoolean,
    },
    passwordRequired: {
      description: 'Does it require a password to view?',
      type: GraphQLBoolean,
    },
    type: {
      description:
        'The type of data this node is holding, it allows the frontend to choose the perfect component to show you.',
      type: new GraphQLNonNull(GraphQLString),
    },
    settings: {
      description:
        'This circle type will iteslf be a circle.lines, it will contain links to all the circles that build this circle settings',
      type: new GraphQLList(CircleType),
      resolve: (circle, args, { circleByKey }) => {
        if (circle.settings && circle.settings.length > 0) {
          return circleByKey.loadMany(circle.settings);
        }
        return null;
      },
    },
    styles: {
      description:
        'This circle type will iteslf be a circle.lines, it will contain links to all the circles that build this circle styles',
      type: new GraphQLList(CircleType),
      resolve: (circle, args, { circleByKey }) => {
        if (circle.styles && circle.styles.length > 0) {
          return circleByKey.loadMany(circle.styles);
        }
        return null;
      },
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
    tags: { type: new GraphQLList(GraphQLString) },
    title: { type: GraphQLString },
    subtitle: { type: GraphQLString },
    description: { type: GraphQLString },
    media: {
      description:
        'A piece of media (font icon/image/gif/video) that helps identify this piece of content.',
      type: CircleType,
      resolve: async (circle, args, { circleByKey }) => {
        if (circle.media) {
          return circleByKey.load(circle.media);
        }
        return null;
      },
    },
    icon: {
      description:
        'A piece of icon (font icon/image/gif/video) that helps identify this piece of content.  Defaults to creators display pic',
      type: CircleType,
      resolve: async (circle, args, { circleByKey }) => {
        if (circle.icon) {
          return circleByKey.load(circle.icon);
        }
        return null;
      },
    },
    viewers: {
      description: 'Who is allowed to see this node?',
      type: new GraphQLList(CircleType),
      resolve: (circle, args, { circleByKey }) => {
        if (circle.viewers && circle.viewers.length > 0) {
          return circleByKey.loadMany(circle.viewers);
        }
        return null;
      },
    },
    creator: {
      description:
        'A publicly viewable profile of the User who created this piece of content',
      type: CreatorType,
      resolve: async (circle, args, { circleByKey }) => {
        if (circle.creator) {
          return circleByKey.load(circle.creator);
        }
        return null;
      },
    },
    editors: {
      description: 'Users that can edit this circle',
      type: new GraphQLList(CircleType),
      resolve: (circle, args, { circleByKey }) => {
        if (circle.editors && circle.editors.length > 0) {
          return circleByKey.loadMany(circle.editors);
        }
        return null;
      },
    },
    dateCreated: { type: GraphQLBigInt },
    dateUpdated: { type: GraphQLBigInt },

    // Circle content types below
    string: { type: GraphQLString },
    object: { type: GraphQLJSON },
    number: { type: GraphQLInt },
    bigNumber: { type: GraphQLBigInt },
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
      resolve: (circle, args, { circleByKey }) => {
        if (circle.lines && circle.lines.length > 0) {
          return circleByKey.loadMany(circle.lines);
        }
        return null;
      },
    },
    linesMany: {
      description:
        'When you need to connect lots of Circles together, but you only want to show a certain amount at a time',
      type: require('./CircleConnection').default, // eslint-disable-line global-require
      args: connectionArgs,
      resolve: async (circle, { ...args }, { circleByKey }) => {
        if (circle.linesMany && circle.linesMany.length > 0) {
          const linesMany = await circleByKey.loadMany(circle.linesMany);
          const connection = connectionFromArray(linesMany, args);
          return connection;
        }
        return null;
      },
    },
  }),
});

export default CircleType;
