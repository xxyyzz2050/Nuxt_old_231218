"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("./index.js"));

var _fs = _interopRequireDefault(require("fs"));

var _path2 = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var data =
/*#__PURE__*/
function () {
  function data(root) {
    _classCallCheck(this, data);

    root = root || ''; //if it null it will be the current working dir (of the working script)

    this.root = _path2.default.resolve(root);
  }

  _createClass(data, [{
    key: "mtime",
    value: function mtime(file) {
      //modified time of a file in MS
      return _fs.default.statSync(file).mtimeMs;
    }
  }, {
    key: "path",
    value: function path(_path) {
      //add root & normalize the path to guarantee that the path seperator type of the operating system will be used consistently (e.g. this will turn C:\directory/test into C:\directory\test (when being on Windows)
      return _path2.default.normalize(_path2.default.join(this.root, _path)); //nx: resolve()?
    }
  }, {
    key: "cache",
    value: function cache(file, data, expire, type, allowEmpty) {
      var _this = this;

      /*  returns a promise (because some operations executed in async mode) , use await or .then()
          allowEmpty: allow creating an empty cache file
          expire (hours)
      */
      return _index.default.run(['cache', file],
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var now, string;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                now = _index.default.now();

                _this.mkdir(_path2.default.dirname(file));

                file = _this.path(file);
                expire *= 60 * 60 * 1000; //ms

                if (!(!_fs.default.existsSync(file) || !isNaN(expire) && (expire < 0 || _this.mtime(file) + expire < now))) {
                  _context.next = 28;
                  break;
                }

                _index.default.log("cache: ".concat(file, " updated"));

                if (!(typeof data == 'function')) {
                  _context.next = 10;
                  break;
                }

                _context.next = 9;
                return data();

              case 9:
                data = _context.sent;

              case 10:
                if (!(_index.default.isArray(data) || _index.default.objectType(data) == 'object')) {
                  _context.next = 20;
                  break;
                }

                string = JSON.stringify(data);

                _fs.default.writeFileSync(file, string);

                if (!(data == 'string')) {
                  _context.next = 17;
                  break;
                }

                return _context.abrupt("return", string);

              case 17:
                return _context.abrupt("return", data);

              case 18:
                _context.next = 26;
                break;

              case 20:
                if (allowEmpty || !_index.default.isEmpty(data)) _fs.default.writeFileSync(file, data);

                if (!(type == 'json')) {
                  _context.next = 25;
                  break;
                }

                return _context.abrupt("return", JSON.parse(data));

              case 25:
                return _context.abrupt("return", data);

              case 26:
                _context.next = 34;
                break;

              case 28:
                data = _fs.default.readFileSync(file, 'utf8'); //without encoding (i.e utf-8) will return a stream insteadof a string

                if (!(type == 'json')) {
                  _context.next = 33;
                  break;
                }

                return _context.abrupt("return", JSON.parse(data));

              case 33:
                return _context.abrupt("return", data);

              case 34:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      })));
    }
  }, {
    key: "mkdir",
    value: function mkdir(path, mode, index) {
      var _this2 = this;

      return _index.default.run(['mkdir', path, mode], function () {
        if (path instanceof Array) path.map(function (el) {
          return _this2.mkdir(el, mode, index);
        });
        path = _this2.path(path); //eldeeb.log(path, 'path')
        // mode=mode||"0777"

        /*
        //recursive https://stackoverflow.com/a/24311711
        let parts = path.split(Path.sep)
        //eldeeb.log(parts, 'mkdir/parts')
        let n = parts[0].indexOf(':') ? 2 : 1 //on windows the absoulute path starts with a drive letter (ex: C:), path.join('C:')=>'C:.' witch gives an error when we try to create it and we don't need to create a drive
        for (let i = n; i <= parts.length; i++) {
          let partPath = Path.join.apply(null, parts.slice(0, i))
          //eldeeb.log({ partPath: partPath, slice: parts.slice(0, i) },'mkdir/partPath')
          try {
            fs.existsSync(partPath) || fs.mkdirSync(partPath, {mode:mode}) //needs review -> use try&catch ?
            if (index !== false) {
              if (!index) index = '<meta http-equiv="REFRESH" content="0;url=/">'
              fs.writeFileSync(Path.join(partPath, 'index.htm'), index)
              //don't return true here, because it will exit the loop
            }
          } catch (e) {
            eldeeb.log(e, 'mkdir/error', 'error')
            return false
          }
        }*/

        try {
          _fs.default.existsSync(path) || _fs.default.mkdirSync(path, {
            recursive: true
          });

          if (index !== false) {
            if (!index) index = '<meta http-equiv="REFRESH" content="0;url=/">';

            _fs.default.writeFileSync(_path2.default.join(path, 'index.htm'), index);

            return true;
          }
        } catch (e) {
          _index.default.log(e, 'mkdir/error', 'error');

          return false;
        }
      });
    }
  }]);

  return data;
}();

exports.default = data;