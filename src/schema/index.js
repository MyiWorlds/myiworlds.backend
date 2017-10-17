/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { node, nodes } from './Node';
import { Circle, createCircle, updateCircle, deleteCircle } from './Circle';
// import { User } from './User';
// import { createUser, updateUser } from './User';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      // User,
      Circle,
      node,
      nodes,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createCircle,
      updateCircle,
      deleteCircle,
      // createUser,
      // updateUser,
    },
  }),
});
