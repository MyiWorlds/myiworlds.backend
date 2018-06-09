// import GCPConfig from '../config/settings';

const credentials = process.env.GCP_DATASTORE_OWNER
  ? JSON.parse(process.env.GCP_DATASTORE_OWNER)
  : {};

const datastoreClient = require('@google-cloud/datastore')({
  // keyFilename: GCPConfig.datastore.ownerServiceKeyPath,
  credentials,
  // Only used for seeding the database to create the necessary entities
  // Not sure if I will keep
  // keyFilename: GCPConfig.datastore.ownerServiceKeySeedPath,
});

export default datastoreClient;
