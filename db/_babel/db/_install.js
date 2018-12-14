"use strict";

require("@babel/polyfill");

var _articles_update = _interopRequireDefault(require("./articles_update.js"));

var _index = _interopRequireDefault(require("./index.js"));

var _fs = _interopRequireDefault(require("fs"));

var _convert = _interopRequireDefault(require("./_convert.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_convert.default.then(function () {
  return _index.default.connect({
    autoIndex: false
  });
}).then(
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(db) {
    var dir, models, files, f, file, coll, data, obj, _db$model, model, i, doc, invalid, _loop;

    return regeneratorRuntime.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('========= connected ============'); //console.log('db:', db)

            dir = './__db/step4', models = [], files = _fs.default.readdirSync(dir);
            f = 0;

          case 3:
            if (!(f < files.length)) {
              _context3.next = 24;
              break;
            }

            file = files[f];

            if (!(file.slice(-5) != '.json')) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("continue", 21);

          case 7:
            coll = file.slice(0, -5), data = require("".concat(dir, "/").concat(file)), obj = require("./schema/".concat(coll, ".js")), _db$model = db.model(coll, obj[0], {
              validateBeforeSave: false
            }, obj.slice(1)), model = _db$model.model; //true: add insertObj();     db.set('validateBeforeSave', false) //all data will be validated before sending it to the server

            models[coll] = model; //to avoid re compile the model again (mongoose error)

            /*
            for (let i = 1; i < obj.length; i++)
              if (!obj[i] instanceof Array) model.index(obj[i]) //nx: schema.index()
              else model.index(obj[i][0], obj[i][1]) //[{fields},{options}]
              */
            //test validation

            console.log("validate coll: ".concat(coll, " ========="));
            i = 0;

          case 11:
            if (!(i < data.length)) {
              _context3.next = 21;
              break;
            }

            doc = new model(data[i]), invalid = doc.validateSync();

            if (!invalid) {
              _context3.next = 17;
              break;
            }

            throw {
              //or Promise.reject()
              msg: 'validation error',
              error: invalid,
              doc: doc //if any collection has validation error, don't insert any data ar create any index

            };

          case 17:
            console.log("validate ".concat(coll, "-").concat(i, ": ok"));

          case 18:
            i++;
            _context3.next = 11;
            break;

          case 21:
            f++;
            _context3.next = 3;
            break;

          case 24:
            console.log('========= validation Done ============');
            _loop =
            /*#__PURE__*/
            regeneratorRuntime.mark(function _loop(coll) {
              var model;
              return regeneratorRuntime.wrap(function _loop$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      //or for(files); all models created from files already exists in step4, so we don't have to check if if exists
                      //create indexes then insert data
                      model = models[coll];
                      _context2.next = 3;
                      return model.createIndexes().then(
                      /*#__PURE__*/
                      function () {
                        var _ref2 = _asyncToGenerator(
                        /*#__PURE__*/
                        regeneratorRuntime.mark(function _callee(idx) {
                          var data;
                          return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  console.log("".concat(coll, ": indexs created"), idx); //nx: is createIndexes() resolve [indexes]?

                                  data = require("".concat(dir, "/").concat(coll, ".json"));

                                  if (data) {
                                    _context.next = 4;
                                    break;
                                  }

                                  return _context.abrupt("return");

                                case 4:
                                  _context.next = 6;
                                  return model.insertMany(data, {
                                    ordered: false
                                  }).then(function (data) {
                                    return console.log("".concat(coll, ": data inserted"), data);
                                  }).catch(function (e) {
                                    return console.error("insertion error: ".concat(coll), err);
                                  });

                                case 6:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee, this);
                        }));

                        return function (_x2) {
                          return _ref2.apply(this, arguments);
                        };
                      }()).catch(function (err) {
                        return console.error("error: ".concat(coll), err);
                      });

                    case 3:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _loop, this);
            });
            _context3.t0 = regeneratorRuntime.keys(models);

          case 27:
            if ((_context3.t1 = _context3.t0()).done) {
              _context3.next = 32;
              break;
            }

            coll = _context3.t1.value;
            return _context3.delegateYield(_loop(coll), "t2", 30);

          case 30:
            _context3.next = 27;
            break;

          case 32:
            (0, _articles_update.default)(db, models['articles']); //must wait untin creating indexes & writing data finished

          case 33:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()).catch(function (err) {
  return console.log('error:', err);
});
/*db.done(db => {
  content = require(`./articles.js`)
  var { model, schema } = db.model('articles', content[0])
  //console.log('schema=', schema)
  db.createIndex(model, content[1]).then(
    x => console.log('index:', x),
    err => console.log('index err', err)
  )
})*/