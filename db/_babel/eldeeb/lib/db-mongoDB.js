"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index2 = _interopRequireDefault(require("./index.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dbMongoDBSchema = _interopRequireDefault(require("./db-mongoDB-schema.js"));

var _dbMongoDBModel = _interopRequireDefault(require("./db-mongoDB-Model.js"));

var _shortId2 = require("shortId");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_index2.default.op.mark = 'db/mongoDB';

var db_mongoDB
/* extends mongoose.constructor*/
=
/*#__PURE__*/
function () {
  //mongoose/lib/index.js exports new mongoose(), not the class itself; also mongoose is a Function
  function db_mongoDB(options, done, fail, events) {
    var _this = this;

    _classCallCheck(this, db_mongoDB);

    //nx: return Promise
    //note: if this class didn't extends mongoose, 1- don't use super() 2- use mongoose instead of this to access mongoose properties
    //when extends
    //super(options)
    return _index2.default.run(['()', options
    /*,callback*/
    ], function () {
      _this.promise = _index2.default.promise(function (resolve, reject) {
        var err = _index2.default.error(100),
            defaultOptions = {
          useCreateIndex: true,
          //useNewUrlParser: true, //https://mongoosejs.com/docs/deprecations.html; now it gives "MongoError: authentication fail"
          useFindAndModify: false,
          bufferCommands: false,
          //https://mongoosejs.com/docs/connections.html
          autoIndex: false,
          retryWrites: true
        };

        if (typeof options == 'function') options = options();
        if (_index2.default.isEmpty(options)) reject(_objectSpread({}, err, {
          details: {
            uri: _this.uri,
            error: 'options is empty',
            options: options
          }
        }));else if (typeof options == 'string') options = {
          uri: options
        };else if (options instanceof Array) {
          //don't use typeof options=="Array"
          options = {
            user: options[0],
            pass: options[1],
            host: options[2],
            db: options[3]
          };
        }
        if (_index2.default.objectType(options) != 'object') reject(_objectSpread({}, err, {
          details: {
            uri: _this.uri,
            error: 'options is not an object',
            options: options
          }
        }));
        if (typeof options.uri == 'function') options.uri = options.uri(options);

        if ('uri' in options && !_index2.default.isEmpty(options.uri)) {
          _this.uri = (options.uri.substr(0, 7) != 'mongodb' ? 'mongodb' + (options.srv ? '+srv' : '') + '://' : '') + options.uri;
        } else {
          if (!('user' in options) || !('pass' in options) || _index2.default.isEmpty(options.user) || _index2.default.isEmpty(options.pass)) reject(_objectSpread({}, err, {
            details: {
              uri: _this.uri,
              error: 'no uri or user/pass',
              options: options
            }
          }));
          if (!options['host']) options['host'] = 'localhost'; //nx: default port
          // if(!("db" in options))options["db"]="database"

          _this.uri = "mongodb".concat(options.srv ? '+srv' : '', "://").concat(_this.encode(options['user']), ":").concat(_this.encode(options['pass']), "@").concat(options['host'] instanceof Array ? options['host'].join(',') : options['host'], "/").concat(options['db']); //?${options["options"]
        }

        _this.models = options.models ? options.models : '../../../models'; //default path for model schema objects (related to THIS file)

        _this.ext = options.ext ? options.ext : 'json';

        if (options.debug) {
          _mongoose.default.set('debug', true);

          _index2.default.op.log = true;
        } else {
          _mongoose.default.set('debug', false);

          _index2.default.op.log = false; //default is true
        }

        delete options['uri'];
        delete options['user'];
        delete options['pass'];
        delete options['host'];
        delete options['db'];
        delete options['options']; //deprecated: options for native dbMongo (appended to uri ->uri?options)

        delete options['models'];
        delete options['ext'];
        delete options['debug'];
        delete options['srv']; //options may has another properties for Mongoose or mongoDB, so don't set options to null

        if (options.pk) {
          _this.pk == options.pk;
          delete options.pk;
        } else _this.pk == '__id';

        options = _index2.default.merge(defaultOptions, options); //if (eldeeb.op.log)  console.log('connection details:', this.uri, options)

        _this.connection = _mongoose.default.createConnection(_this.uri, options);
        if (!_this.connection) reject(_objectSpread({}, err, {
          details: {
            uri: _this.uri,
            error: 'connection error',
            options: options
          }
        }));
        if (events) _this.on('all', function (ev) {
          return events(ev);
        }); //this will be run for all events, .then(..db.on('all')) will be run for all events AFTER 'open' because .then() only occurs after 'open' stage

        _this.connection.then(function () {
          return resolve(_this);
        }, //db is connected & open, using .on() will be run on other events
        function (error) {
          return reject(_objectSpread({}, err, {
            details: {
              uri: _this.uri,
              error: error,
              options: options
            }
          }));
        }); //after mongoose.createConnection() response, resolve/reject this promise
        //the error occures on mongoose, not mongoDB, success here doesn't mean we have a success connection to the real database
        //mongoose.connect() is the default connection using .createConnection, here every instance has only one connection
        // https://nodejs.org/api/events.html#events_emitter_once_eventname_listener
        //nx: needs review
        //nx: return a promise.resolve(this,status) ,on('error',reject(e))

      }, done, //nx: pass this.connection to done()
      fail);
      return _this.promise;
    }); //run
  }

  _createClass(db_mongoDB, [{
    key: "connect",
    value: function connect(options, done, fail) {
      //this function just creats a new instance of this class
      return _index2.default.run(['connect', options
      /*,callback*/
      ], function () {
        return new db() - mongoDB(options, done, fail);
      });
    }
  }, {
    key: "encode",
    value: function encode(str) {
      return encodeURIComponent(str).replace(/%/g, '%25');
    }
  }, {
    key: "uri",
    value: function uri(options) {//return a well formed url string
    }
  }, {
    key: "on",
    value: function on(event, callback, once) {
      var _this2 = this;

      /*
      ev(event,callback) will not work because it cantains "this" whitch refers to this.connection, not to this class
      so we use ev.call() to change the context to this.connection
      */
      return _index2.default.run(once ? 'once' : 'on', function () {
        if (_this2.connection) {
          var ev = once ? _this2.connection.once : _this2.connection.on; //console.log('==ev==', ev)
          //console.log('==this==', this.connection)
          //console.log(ev('error')); //OK gives mongooseError
          //console.log('conn:', this.connection) //OK
          //console.log('ev:', this.connection.on('error', function() {})) //error!

          if (event == 'all') event = ['connected', 'disconnected', 'reconnected', 'connecting', 'reconnecting', 'disconnecting', 'index', 'close', 'error', 'open'];

          if (event instanceof Array) {
            var _loop = function _loop(_i) {
              //nx: useing var instead of let gives a wrong (i) inside function(){..}, why?
              ev.call(_this2.connection, event[_i], function () {
                callback(event[_i]);
              });
            };

            for (var _i = 0; _i < event.length; _i++) {
              _loop(_i);
            }
          } else ev.call(_this2.connection, event, callback); //nx: if once .once(..)

        }

        return _this2; //chaining this function will NOT wait it to finish, so on(error,fn).on(open,fn) will work fine
      });
    }
  }, {
    key: "once",
    value: function once(event, callback) {
      return this.on(event, callback, true);
    }
  }, {
    key: "schema",
    value: function schema(obj, options, indexes) {
      return new _dbMongoDBSchema.default(obj, options, indexes); //mongoose.Schema(...)
    }
  }, {
    key: "model",
    value: function model(coll, schema, options, indexes) {
      var _this3 = this;

      //nx: field: anotherSchema ??
      if (!this.connection) return {
        model: null,
        schema: null
      };
      return _index2.default.run(['model', schema, options], function () {
        if (typeof schema == 'string') schema = require(schema) || {};else if (schema == null || typeof schema == 'undefined') {
          schema = require("".concat(_this3.models, "/").concat(coll, ".").concat(_this3.ext)) || {};
        }

        if (!(schema instanceof _mongoose.default.Schema)) {
          options = options || {};
          if (!('collection' in options)) options['collection'] = coll;
          schema = _this3.schema(schema, options, indexes);
        }

        return {
          model: _this3.connection.model(coll, schema),
          schema: schema //var {model,schema}=db.model(..); or {model:MyModel,schema:mySchema}=db.model(..) then: schema.set(..)
          //nx: override mongoose.model
          //don't use $super(model) because it referce to the default connection created by mongoose.connect(), not the current connection

        };
      });
    }
  }, {
    key: "createIndex",
    value: function createIndex(model, index, options) {
      //nx: if(model:object)model=this.model(model); nx: directly use mongoDB
      //if schema contains indexes (schema.index()), use autoIndex:true or model.createIndexes()
      //use this function to create indexes that is not defined in the schema
      // model.collection perform native mongodb queries (not mongoose queries)
      var defaultOptions = {}
      /*name:'index'*/
      //index name must be unique accross the table
      ;
      options = _index2.default.merge(defaultOptions, options);

      if (index instanceof Array) {
        var r = [];

        for (i = 0; i < index.length; i++) {
          if (index[i] instanceof Array) return this.createIndex(model, index[i][0], index[i][1]); //or merge(options,index[i][1])
          else return this.createIndex(model, index[i][0], options);
        }

        return r;
      }

      return model.collection.createIndex(index, options); //promise

      /*
        eldeeb.promise(model.collection.createIndex(indexes, options),x=>x,err=>console.error(err))
        return this
        */
    }
  }, {
    key: "index",
    value: function index(model, _index, options) {
      return this.createIndex(model, _index, options);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      if (_index2.default.objectType(key) == 'object') {
        for (var k in key) {
          this.set(k, key[k]);
        }
      }

      if (key == 'models') this.models = value;else _mongoose.default.set(key, value);
    } //nx: move to mongoose-model() extends mongoose.model

  }, {
    key: "select",
    value: function select() {//aggregate=select([stages])
    }
  }, {
    key: "get",
    value: function get() {}
  }, {
    key: "shortId",
    value: function shortId() {
      return (0, _shortId2.generate)();
    } //----------------------- aggregation helpers -> move to class aggregate ------------------------ //

  }, {
    key: "replace",
    value: function replace(entry, oldString, newString) {
      return {
        $trim: {
          input: {
            $reduce: {
              input: {
                $split: [entry, oldString]
              },
              initialValue: '',
              in: {
                $cond: [{
                  $eq: ['$$this', '']
                }, //nx: or null
                '$$value', {
                  $concat: ['$$value', newString, '$$this']
                }]
              }
            }
          },
          chars: newString
        }
      };
    }
  }, {
    key: "implode",
    value: function implode(array, delimeter) {
      delimeter = delimeter || ',';
      return array; //nx: return a string of elements separated by the delimeter
    } //----------------------- /aggregation helpers ------------------------ //

  }]);

  return db_mongoDB;
}();

exports.default = db_mongoDB;