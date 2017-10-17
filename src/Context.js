/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable no-underscore-dangle */

import DataLoader from 'dataloader';
import type { request as Request } from 'express';
import type { t as Translator } from 'i18next';

import db from './db';
import { mapTo, mapToMany, mapToValues } from './utils';

import { getEntityByKey, getEntitiesByKeys } from './gcp/datastore';

class Context {
  request: Request;
  user: any;
  t: Translator;

  constructor(request: Request) {
    this.request = request;
    this.user = request.user;
    this.t = request.t;
  }

  /*
   * Data loaders to be used with GraphQL resolve() functions. For example:
   *
   *   resolve(post, args, { userById }) {
   *     return userById.load(post.author_id);
   *   }
   *
   * For more information visit https://github.com/facebook/dataloader
   */

  userByKey = new DataLoader(key =>
    getEntityByKey('Users', key, this.request.user._id),
  );

  usersByKeys = new DataLoader(keys =>
    getEntitiesByKeys('Users', keys, this.request.user._id),
  );

  circleByKey = new DataLoader(key =>
    getEntityByKey('Users', key, this.request.user._id),
  );

  circlesByKeys = new DataLoader(keys =>
    getEntitiesByKeys('Circles', keys, this.request.user._id),
  );

  /*
   * Authenticatinon and permissions.
   */

  ensureIsAuthenticated() {
    if (!this.user) throw new Error('Anonymous access is denied.');
  }
}

export default Context;
