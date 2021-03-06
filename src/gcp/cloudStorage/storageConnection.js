// import GCPConfig from '../config/settings';

const credentials = process.env.GCP_CLOUD_STORAGE_ADMIN
  ? JSON.parse(process.env.GCP_CLOUD_STORAGE_ADMIN)
  : {};

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = require('@google-cloud/storage')({
  credentials,
  // keyFilename: GCPConfig.storage.adminServiceKeyPath,
});

// Makes an authenticated API request.
export default async function getStorage() {
  return await storage
    .getBuckets()
    .then(results => {
      const buckets = results[0];

      console.log('Buckets:');
      buckets.forEach(bucket => {
        console.log(bucket.name);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}
