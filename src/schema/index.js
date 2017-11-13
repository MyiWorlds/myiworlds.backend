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
import { getCircleBySlug } from './Types/Circle/Queries/GetCircleBySlug';
import { getCircleByKey } from './Types/Circle/Queries/GetCircleByKey';
import { user } from './Types/User/Queries/User';

import createCircle from './Types/Circle/Mutations/CreateCircleMutation';
import updateCircle from './Types/Circle/Mutations/UpdateCircleMutation';
import updateCirclePassword from './Types/Circle/Mutations/UpdateCirclePasswordMutation';
import deleteCircle from './Types/Circle/Mutations/DeleteCircleMutation';

import createUser from './Types/User/Mutations/CreateUserMutation';
import updateUserPassword from './Types/User/Mutations/UpdateUserPasswordMutation';
import updateEmailConfirmed from './Types/User/Mutations/UpdateEmailConfirmedMutation';
import updateUsername from './Types/User/Mutations/UpdateUsernameMutation';
import updateEmail from './Types/User/Mutations/UpdateEmailMutation';
import updateUiEnabled from './Types/User/Mutations/UpdateUiEnabledMutation';
import deleteUser from './Types/User/Mutations/DeleteUserMutation';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user,
      getCircleBySlug,
      getCircleByKey,
      node,
      nodes,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createCircle,
      updateCircle,
      updateCirclePassword,
      deleteCircle,

      createUser,
      updateUserPassword,
      updateEmailConfirmed,
      updateUsername,
      updateEmail,
      deleteUser,
      updateUiEnabled,
    },
  }),
});
