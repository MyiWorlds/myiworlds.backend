import GCPConfig from '../config/settings';

const datastoreClient = require('@google-cloud/datastore')({
  keyFilename: GCPConfig.datastore.gcpDatastoreOwnerServiceKeyPath,
});

export default datastoreClient;
