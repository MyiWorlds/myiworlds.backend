import GCPConfig from '../config/settings';

const datastoreClient = require('@google-cloud/datastore')({
  keyFilename: GCPConfig.datastore.ownerServiceKeyPath,
  // Only used for seeding the database to create the necessary entities
  // Not sure if I will keep
  // keyFilename: GCPConfig.datastore.ownerServiceKeySeedPath,
});

export default datastoreClient;
