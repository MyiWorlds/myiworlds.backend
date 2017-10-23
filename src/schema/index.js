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
import { circle } from './Types/Circle/Queries/Circle';
import { user } from './Types/User/Queries/User';
import createCircle from './Types/Circle/Mutations/CreateCircleMutation';
import updateCircle from './Types/Circle/Mutations/UpdateCircleMutation';
import deleteCircle from './Types/Circle/Mutations/DeleteCircleMutation';

import createUser from './Types/User/Mutations/CreateUserMutation';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user,
      circle,
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
      createUser,
      // updateUser,
    },
  }),
});
