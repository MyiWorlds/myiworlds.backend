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

import UserType from '../UserType';
import { getEntityByKey } from '../../../../gcp/datastore/queries';

export const getUser = {
  name: 'User',
  type: UserType,
  // resolve: async (query, { _id }) =>
  //   getEntityByKey('Users', _id, 'davey').then(response => response.entity),

  resolve: async (query, args, context) =>
    await getEntityByKey('Users', context.user._id, context.user._id).then(
      response => response.entity,
    ),
};
