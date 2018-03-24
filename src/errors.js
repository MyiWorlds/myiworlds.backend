/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import type { ValidationErrorEntry } from './types';
import credentials from './gcp/config/serviceKeys/erros-writer-credentials.json';
import ErrorReporting from '@google-cloud/error-reporting';

const stackdriverErrorReporting = ErrorReporting({
  projectId: credentials.project_id,
  credentials,
  ignoreEnvironmentCheck: true,
  logLevel: 2,
  reportRejections: true,
  serviceContext: {
    service: 'api',
    // TODO: Set the correct version (number)
    version: process.env.ERROR_REPORTING_CREDENTIALS ? 'latest' : 'local',
  },
});

function report(error: Error) {
  stackdriverErrorReporting.report(error);
}

export class ValidationError extends Error {
  code = 400;
  state: any;

  constructor(errors: Array<ValidationErrorEntry>) {
    super('The request is invalid.');
    this.state = errors.reduce((result, error) => {
      if (Object.prototype.hasOwnProperty.call(result, error.key)) {
        result[error.key].push(error.message);
      } else {
        Object.defineProperty(result, error.key, {
          value: [error.message],
          enumerable: true,
        });
      }
      return result;
    }, {});
  }
}

export class UnauthorizedError extends Error {
  code = 401;
  message = this.message || 'Anonymous access is denied.';
}

export class ForbiddenError extends Error {
  code = 403;
  message = this.message || 'Access is denied.';
}

export default { report };
