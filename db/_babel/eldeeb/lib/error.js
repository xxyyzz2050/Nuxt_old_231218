"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = _interopRequireDefault(require("./index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index.default.mark = 'error';
/*
- nx: add: file,line,colNumber,stack,...
- wrong: throw new Error() from this file, will include file & lineNumber of this file (not the file witch throw the error), so we have to get the correct file,lineNumber

*/

function _default(err, throwError, jsError) {
  var _this = this;

  //or: class error extends Error -> to add trace to error info (returns only Error object, not object)
  var errors = {
    0: {
      type: 'eldeeb/$className/fn',
      msg: '$details'
    },
    100: {
      type: 'eldeeb/db-mongoDB/()',
      msg: 'connection uri'
    } //to get the default format errors[0]

  };
  if (typeof err == 'function') err = err();
  if (err instanceof Array) err = {
    num: err[0],
    type: err[1],
    msg: err[2],
    link: err[3],
    details: err[4]
  };else if (typeof err == 'number') err = {
    num: err,
    type: 'eldeeb'
  };

  if (_index.default.objectType(err) == 'object') {
    //if(eldeeb.isEmpty(tmp.type)||tmp.type=="eldeeb"){tmp[1]="eldeeb"; err=errors[tmp.num]}
    if (err.type == 'eldeeb') {
      //standard eldeeb error
      this.err = errors[err.num];
    } else this.err = {
      type: err.type
    };

    this.err.num = err.num; //override default err object

    if (!_index.default.isEmpty(err.msg)) this.err.msg = err.msg;
    if (!_index.default.isEmpty(err.details)) this.err.details = err.details;
    this.err.link = (!_index.default.isEmpty(err.link) ? err.link : 'https://eldeeb.com/error/{num}-{msg}').replace(/{(.*?)}/gi, function (a, b) {
      return _this.err[b];
    }).replace(' ', '-'); //or: ${..}; this.err[$1] is invalid

    if (throwError) {
      if (jsError) throw new Error(this.err); //or Error(this.err.msg) because it accepts 'string' (not object)

      throw this.err;
    }
  } else {
    if (throwError) throw new Error(this.err);else this.err = {
      msg: err
    };
  }

  return this.err;
}