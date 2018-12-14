"use strict";

var mongo = require('../index.js');

mongo.connect().done(function (db) {
  console.log('=============================');

  var _db$model = db.model('articles', require('../schema/articles.js')[0]),
      model = _db$model.model;

  var agg = model.aggregate([{
    $limit: 3
  }]).project({
    _id: 1,
    title: 1
  });
  console.log('pipeLine:', agg.pipeline());
  agg.explain().then(function (data) {
    return console.log('explain:', data);
  }, function (err) {
    return console.log('explain Error:', err);
  });
  agg.exec(function (err, data) {
    if (err) console.error('error:', err);else console.log('data:', data);
  });
}).fail(function (err) {
  return console.error('db error:', err);
});