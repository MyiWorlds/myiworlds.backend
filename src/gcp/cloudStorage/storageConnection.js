import GCPConfig from '../config/settings';

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = require('@google-cloud/storage')({
  keyFilename: GCPConfig.storage.gcpStorageAdminServiceKeyPath,
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
