"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eldeeb = _interopRequireDefault(require("../eldeeb/"));

var _shortId = require("shortId");

var _eldeebConfig = _interopRequireDefault(require("../eldeeb.config.js"));

var _objects = _interopRequireDefault(require("./schema/objects.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
connects to db and returns a promise
usgae  require('index').then(db=>{==queries goes here==})
*/
//nx: in production mode convert theese files to .json (no comments)
//or function(options){options=eldeeb.merge(require('../eldeeb.config.js').db,options)}
var _default = {
  db: null,
  connect: function connect(options) {
    var _this = this;

    options = options || {};
    options = _eldeeb.default.merge(_eldeebConfig.default.db, options);
    options.debug = false;
    return _eldeeb.default.db('mongoDB', options).done(function (db) {
      //if (!db) Promise.reject('db=null!')
      _this.db = db;
      return db;
    });
  },
  model: function model(coll, obj) {
    var options,
        _this$db$model = this.db.model('objects', _objects.default[0], {
      modifiedAt: true
    }),
        objectsModel = _this$db$model.model,
        objectsSchema = _this$db$model.schema;

    if (obj) options = {
      //adjust options for models that needs to be saved in the Objects collection
      fields: {
        modifiedAt: true
      },
      adjust: {
        statics: {
          insertObj: function insertObj(doc, object) {
            //  console.log('this:', this)
            doc.shortId = (0, _shortId.generate)(); //also it will be auto generated

            return this.create(doc).then(function (data) {
              objectsModel.create({
                shortId: data.shortId,
                _id: data._id,
                link: data.link,
                object: object
              });
              return data;
            }, function (err) {
              return err;
            });
          }
        }
      }
    };else options = {
      fields: {
        modifiedAt: true
      }
    };
    return this.db.model(coll, require("./schema/".concat(coll, ".js"))[0], //or .json
    options);
  }
}; //.fail(err => console.log(err), true) //nx: save errors ->gives error

exports.default = _default;