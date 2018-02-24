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
import { getEntitiesByKeys } from './gcp/datastore/queries';

// import db from './db';
// import { mapTo, mapToMany, mapToValues } from './utils';
import { UnauthorizedError } from './errors';

// Get from context
// const userId = 'davey';

class Context {
  request: Request;
  user: any;
  t: Translator;

  constructor(request: Request) {
    this.request = request;
    this.t = request.t;

  }

  get user(): any {
    if (!this.request.user) {
      const guest = {
        _id: 'GUEST'
      }
      return guest;
    }
    return this.request.user
  }
  /*
   * Data loaders to be used with GraphQL resolve() functions. For example:
   *
   *   resolve(post: any, args: any, { userById }: Context) {
   *     return userById.load(post.author_id);
   *   }
   *
   * For more information visit https://github.com/facebook/dataloader
   */

  userByKey = new DataLoader(keys =>
    getEntitiesByKeys('Users', keys).then(
      response => response.entities,
    ),
  );

  circleByKey = new DataLoader(keys =>
    getEntitiesByKeys('Circles', keys).then(
      response => response.entities,
    ),
  );

  /*
   * Authenticatinon and permissions.
   */

  ensureIsAuthenticated() {
    if (!this.user) throw new UnauthorizedError();
  }
}

export default Context;
