/**
 * Copyright © 2016-present Kriasoft.
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

import { UnauthorizedError } from './errors';

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
      return null;
    }
    return this.request.user;
  }
  /*
   * Data loaders to be used with GraphQL resolve() functions.
   * For more information visit https://github.com/facebook/dataloader
   */

  userByKey = new DataLoader(keys =>
    getEntitiesByKeys(
      'users',
      keys,
      this.user && this.user.uid ? this.user.uid : null,
    ).then(response => response.entities),
  );

  circleByKey = new DataLoader(keys =>
    getEntitiesByKeys(
      'circles',
      keys,
      this.user && this.user.uid ? this.user.uid : null,
    ).then(response => response.entities),
  );

  /*
   * Authenticatinon and permissions.
   */

  ensureIsAuthenticated() {
    if (!this.user) throw new UnauthorizedError();
  }
}

export default Context;
