import ErrorReporting from '@google-cloud/error-reporting';
import credentials from './gcp/config/serviceKeys/erros-writer-credentials.json';

export default ErrorReporting({
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
