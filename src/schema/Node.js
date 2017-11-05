/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable global-require */

import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import { assignType, getType } from '../utils';

const { nodeInterface, nodeField: node, nodesField: nodes } = nodeDefinitions(
  (globalId, context) => {
    const { type, _id } = fromGlobalId(globalId);

    switch (type) {
      case 'User':
        return context.userByKey.load(_id).then(assignType('User'));
      case 'Circle':
        return context.circleByKey.load(_id).then(assignType('Circle'));
      default:
        return null;
    }
  },
  obj => {
    switch (getType(obj)) {
      case 'User':
        return require('./Types/User/UserType').default;
      case 'Circle':
        return require('./Types/Circle/CircleType').default;
      default:
        return null;
    }
  },
);

export { nodeInterface, node, nodes };
