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

import UserType from './UserType';

export const User = {
  type: UserType,
  resolve(root, args, { user, userByKey }) {
    return user && userByKey.load(user._id);
  },
};
