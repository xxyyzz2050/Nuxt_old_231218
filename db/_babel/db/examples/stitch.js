"use strict";

var _require = require('mongodb-stitch-browser-sdk'),
    Stitch = _require.Stitch,
    RemoteMongoClient = _require.RemoteMongoClient,
    AnonymousCredential = _require.AnonymousCredential;

var client = Stitch.initializeDefaultAppClient('stitch-test-pqmxa');
var db = client.getServiceClient(RemoteMongoClient.factory, 'mongo').db('stitch');
client.auth.loginWithCredential(new AnonymousCredential()).then(function (user) {
  return db.collection('test').updateOne({
    owner_id: client.auth.user.id
  }, {
    $set: {
      number: 42
    }
  }, {
    upsert: true
  });
}).then(function () {
  return db.collection('test').find({
    owner_id: client.auth.user.id
  }, {
    limit: 100
  }).asArray();
}).then(function (docs) {
  console.log('Found docs', docs);
  console.log('[MongoDB Stitch] Connected to Stitch');
}).catch(function (err) {
  console.error(err);
});