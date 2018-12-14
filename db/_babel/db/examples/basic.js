"use strict";

var dbx = require('../index.js'),
    shortId = require('shortid').generate;

dbx.connect().done(function (db, model) {
  console.log('====connected=======');

  var _dbx$model = dbx.model('articles', true),
      articleModel = _dbx$model.model,
      articleSchema = _dbx$model.schema;

  articleModel.insertObj({
    title: 'test',
    keywords: ['5bf4003eee181d2e5c7ca250']
  }, 'articles').then(function (data) {
    return console.log('data:', data);
  }, function (err) {
    return console.error('err:', err);
  });
  /*
  const { model: userModel, schema: userSchema } = db.model(
  'users',
  require('./users.js')[0], //or .json
  options
  )
  userModel.findById('5be92fb487e94116ac606ffe').then(
  data => {
    console.log('find/$id', data)
    console.log('find/$id/toObject', data.toObject())
    console.log(
      'find/$id/toObject->getters:true',
      data.toObject({ getters: true })
    )
  },
  err => console.error('find/$id', err)
  )*/
}).fail(function (err) {
  return console.log('connection Error:', err);
}); //not work??