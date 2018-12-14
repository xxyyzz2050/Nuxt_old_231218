"use strict";

require("@babel/polyfill");

var _index = _interopRequireDefault(require("./index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.clear();
console.log(Math.floor(Math.random() * 1000));
new Promise(function (r) {
  return r();
}).then(function () {
  return _index.default.connect({
    autoIndex: false
  });
}).then(function (db) {
  console.log('== connected ==');

  var dir = './__db/step4',
      coll = 'xx',
      obj = require("./schema/".concat(coll, ".js"));

  var _db$model = db.model(coll, obj[0], {
    validateBeforeSave: false
  }, obj.slice(1)),
      model = _db$model.model,
      schema = _db$model.schema;

  console.log('schema:', schema);
  console.log('obj.slice(1):', obj.slice(1));
  model.createIndexes().then(function (idx) {
    console.log("".concat(coll, ": indexs created"), idx); //nx: is createIndexes() resolve [indexes]?

    var data = "".concat(dir, "/").concat(coll, ".json");
    if (!fs.existsSync(data)) return;
    data = require(data);
    if (!data) throw new Error('no data');
    model.insertMany(data, {
      ordered: false
    }).then(function (x) {
      return console.log('Done:', x);
    }).catch(function (err) {
      return console.error('err:', err);
    });
  });
}).then(function (x) {
  return console.log('Done2:', x);
}).catch(function (err) {
  return console.error('err2:', err);
});