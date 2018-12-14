"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("./index.js"));

var _mongoose = require("mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

_index.default.op.mark = 'db/mongoDB-schema';

var db_mongoDB_schema =
/*#__PURE__*/
function (_Schema) {
  _inherits(db_mongoDB_schema, _Schema);

  function db_mongoDB_schema(obj, options, indexes) {
    var _this2 = this;

    var _this;

    _classCallCheck(this, db_mongoDB_schema);

    //console.log('==obj==', obj)
    return _possibleConstructorReturn(_this, _index.default.run('()', function () {
      /*
      nx: if(options.times){
        createdAt: { type: Date, default: Date.now },
        modifiedAt: { type: Date, default: Date.now },
      }
      */

      /*
      adjust adds properties 'after' creating mongoose.schema (ex: statics,methode,...)
      fields are added to obj (i.e before creating the schema)
        */
      obj = obj || {};
      options = options || {}; //console.log('Options:', obj)

      if (_index.default.objectType(obj) == 'object') {
        if ('fields' in options) obj = _index.default.merge(obj, options['fields']);
        var adjust = options['adjust'] || {};
        delete options['fields'];
        delete options['adjust'];

        if (
        /*!('times' in obj) || */
        obj.times === true || obj.times === 1) {
          obj.createdAt = {
            type: Date,
            default: Date.now
          };
          obj.modifiedAt = {
            type: Date,
            default: Date.now
          };
          delete obj.times;
        } else {
          if (obj.createdAt === true || obj.createdAt === 1) obj.createdAt = {
            type: Date,
            default: Date.now
          };
          if (obj.modifiedAt === true || obj.modifiedAt === 1) obj.modifiedAt = {
            type: Date,
            default: Date.now
          };
        }

        var defaultOptions = {
          strict: false
        };
        options = _index.default.merge(defaultOptions, options);

        var schema = _this = _possibleConstructorReturn(_this2, _getPrototypeOf(db_mongoDB_schema).call(_this2, obj, options));
      } else {
        if (!(obj instanceof _mongoose.Schema)) return; //nx: add indexes & modify options

        suber();
        var schema = obj; //nx: call super()?
      }

      if (adjust) {
        //deeply modify obj fields, allowing to create base obj and modify it for each schema
        for (var key in adjust) {
          if (_index.default.objectType(adjust[key] == 'object')) {
            for (var x in adjust[key]) {
              schema[key][x] = adjust[key][x];
            }
          } else schema[key] = adjust[key];
        }
      } //add indexes to schema, use this option to create indexes via autoIndex:true or model.createIndexes()
      //to create indexes without adding them to schama: eldeeb.db().index(model,indexes,options)


      if (indexes && indexes instanceof Array) {
        for (var i = 0; i < indexes.length; i++) {
          if (indexes[i] instanceof Array) schema.index(indexes[i][0], indexes[i][1]); //[{fields},{options}]
          else schema.index(indexes[i]);
        } //{fields}

      }

      return schema;
    }));
  }

  return db_mongoDB_schema;
}(_mongoose.Schema);

exports.default = db_mongoDB_schema;