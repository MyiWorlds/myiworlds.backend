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
  resolve: (query, args, context) => {
    const userUid = context.user && context.user.uid ? context.user.uid : null;

    if (userUid) {
      return getEntityByKey('users', userUid, userUid).then(
        response => response.entity,
      );
    }
    return null;
  },
};
