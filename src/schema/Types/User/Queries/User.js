/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable import/prefer-default-export */

import { GraphQLString } from 'graphql';
import UserType from '../UserType';
import { getEntityByKey } from '../../../../gcp/datastore/queries';

export const user = {
  name: 'User',
  type: UserType,
  args: {
    _id: { type: GraphQLString },
  },
  resolve: async (query, { _id }) =>
    getEntityByKey(
      'Viewers',
      'viewer000000000000000000000000000001',
      'viewer000000000000000000000000000001',
    ).then(response => response.entity),
};
