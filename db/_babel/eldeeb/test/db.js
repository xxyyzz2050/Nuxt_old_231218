"use strict";

var insert = false;

var eldeeb = require('../lib/index.js'); //to see logs put options.debug=true (don't use eldeeb.op.log=true)


var options = require('./options').db,
    wrongOptions = {
  //to test faild connection
  uri: 'mongodb://wrong-uri'
};

eldeeb.db('mongoDB', options, function (db) {
  db.on('all', function (ev) {
    return console.log('event2:', ev);
  }); //db is connected & open, it will trigger only on other events, to listen to ALL events use events parameter

  console.log('uri:', db.uri);

  var _db$model = db.model('users'),
      userModel = _db$model.model,
      userSchema = _db$model.schema;
  /*
  console.log('model:', userModel)
  console.log('schema:', userSchema)
  */

  /*userModel
    .findOne()
    .then(
      data => console.log('findOne/data:', data),
      err => console.error('findOne/error:', err)
    )*/

  /*userModel.create({ name: 'test9' }).then(
    data => {
      console.log('creat/data: ', data)
      console.log('creat/data/id: ', data._id)
      userModel.findById(data._id).then(
        data => {
          console.log('find/data', data)
          console.log('find/data.toObject()', data.toObject())
        },
        err => console.log('find/err', err)
      )
    },
    err => console.error('create error:', err)
  )*/


  userModel.findById('5be92fb487e94116ac606ffe').then(function (data) {
    console.log('find/$id', data);
    console.log('find/$id/toObject', data.toObject());
    console.log('find/$id/toObject->getters:true', data.toObject({
      getters: true
    }));
  }, function (err) {
    return console.error('find/$id', err);
  });
  userModel.findById('5be92fb487e94116ac606ffe').lean().then(function (data) {
    return console.error('find/$id/lean', data);
  }, function (err) {
    return console.error('find/$id/lean', err);
  }); //--------/Queries----------//
}, function (err) {
  return console.log('err: ', err);
}, function (ev) {
  return console.log('event:', ev);
});