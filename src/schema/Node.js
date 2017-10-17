/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable global-require, no-underscore-dangle */

import { nodeDefinitions, fromGlobalId } from 'graphql-relay';

const { nodeInterface, nodeField: node, nodesField: nodes } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'User') return context.userById.load(id);
    if (type === 'Circle') return context.circleBy_id.load(id);

    return null;
  },
  obj => {
    if (obj.__type === 'User') return require('./User/UserType').default;
    if (obj.__type === 'Circle') return require('./Circle/CircleType').default;

    return null;
  },
);

export { nodeInterface, node, nodes };
