/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { nodeField, nodesField } from './node';
import { getCircleBySlug } from './Types/Circle/Queries/GetCircleBySlug';
import { getCirclesByUserKey } from './Types/Circle/Queries/GetCirclesByUserKey';
import { getCirclesByFilters } from './Types/Circle/Queries/GetCirclesByFilters';
import { getCircleByUsername } from './Types/Circle/Queries/GetCircleByUsername';
import { getCircleByKey } from './Types/Circle/Queries/GetCircleByKey';
import { getCirclesByTags } from './Types/Circle/Queries/GetCirclesByTags';

import { getUser } from './Types/User/Queries/GetUser';

import createCircle from './Types/Circle/Mutations/CreateCircleMutation';
import updateCircle from './Types/Circle/Mutations/UpdateCircleMutation';
import updateCirclePassword from './Types/Circle/Mutations/UpdateCirclePasswordMutation';
import deleteCircle from './Types/Circle/Mutations/DeleteCircleMutation';

import createUser from './Types/User/Mutations/CreateUserMutation';
import updateUserPassword from './Types/User/Mutations/UpdateUserPasswordMutation';
import updateEmailConfirmed from './Types/User/Mutations/UpdateEmailConfirmedMutation';
import createUsername from './Types/User/Mutations/CreateUsernameMutation';
import updateEmail from './Types/User/Mutations/UpdateEmailMutation';
import updateUiEnabled from './Types/User/Mutations/UpdateUiEnabledMutation';
import deleteUser from './Types/User/Mutations/DeleteUserMutation';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      nodes: nodesField,

      getUser,

      getCirclesByFilters,
      getCirclesByUserKey,
      getCircleBySlug,
      getCircleByKey,
      getCirclesByTags,
      getCircleByUsername,
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
      createUsername,
      updateEmail,
      deleteUser,
      updateUiEnabled,
    },
  }),
});
