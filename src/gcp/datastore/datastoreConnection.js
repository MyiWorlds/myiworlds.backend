const credentials = process.env.GCP_DATASTORE_OWNER
  ? JSON.parse(process.env.GCP_DATASTORE_OWNER)
  : {};

const datastoreClient = require('@google-cloud/datastore')({
  credentials,
});

export default datastoreClient;
