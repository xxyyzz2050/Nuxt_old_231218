"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//console.log('util:', util) //using require&module.exports will prevent this line from calling when run via localhost (called when run via cmd) ,the problem is in : eldeeb/index/isArray->Symbol.iterator, adding quotes will fix it obj['Symbol.iterator'] but it will return a wrong value; may be the error is by Nuxt or babel
var _default = {
  op: {
    //options
    log: false,
    //nx: min log level
    minLogLevel: 'log',
    //log,warn,error (verbose)
    debug: false,
    mark: '' //mark prefix

  },
  mode: function mode(_mode) {
    if (_mode == 'dev') _mode = 'development';
    return _mode ? process.env.NODE_ENV == _mode : process.env.NODE_ENV;
  },
  run: function run(mark, promise, fn) {
    //always use arrow function to keep "this" referce to the original function context (not "run()" context)
    //nx: mark="eldeeb:"+this.run.caller (not allowed in strict mode), https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee

    /*
     if fn returns a value, you mast return this.run()
     ex: function test(){
           return eldeeb.run("test",function(){return 123});
         }
         alert(test()); //123
           nx: to use await pass async fn, ex: this.run(async fn(){await sleep(1); alert(1);});
    */
    if (typeof promise == 'function') {
      fn = promise;
      promise = false;
    } else if (typeof mark == 'function') {
      fn = mark;
      mark = ''; //  promise=false
    }

    if (this.op.debug) debugger;

    if (typeof fn != 'function') {
      if (this.op.log) console.warn('eldeeb run: not a function ', mark, fn);
      return;
    }

    if (typeof mark == 'string') mark = (this.op.mark != '' ? this.op.mark + '/' : '') + mark;else if (mark instanceof Array) mark[0] = (this.op.mark != '' ? this.op.mark + '/' : '') + mark[0];

    if (!promise) {
      try {
        var f = fn();
        if (mark && this.op.log) console.log('success: eldeeb:', mark, f);
        return f;
      } catch (e) {
        this.err(e, mark, fn);
      }
    } else {
      promise = new Promise(fn); //fn must resolve the promise, fn(resolve,reject){if(finished)resolve(value)}

      if (mark && this.op.log) console.log('promise: eldeeb:', mark, promise
      /*, fn*/
      );
      return promise;
    } //note that any console.log() inside fn() will appear BEFORE console.log("Success:**"), success must be at the end of try{}
    //don't concatenate mark (or other objects) to expand them to show their properties (concatenation will cast it to string)

  },
  err: function err(e, at, extra) {
    if (typeof at == 'undefined') at = 'eldeeb.js';
    console.error("Error @eldeeb: ".concat(at, " ").concat(e.name).concat(e.message ? ': ' + e.message : e.description ? ': ' + e.description : '', "\n").concat(e.lineNumber ? ' @' + e.lineNumber + ' in' + e.fileName + '\n' : '').concat(e.stack ? e.stack : '', "\n->")
    /*, (extra ? extra : "")*/
    ); //console.error("Error @eldeeb: " + at + "(" + e.name + "): " + e.message + " @" + (e.lineNumber || "") + ":" + (e.columnNumber || "") + " in: " + (e.fileName || "--") + " \n->", (extra ? extra : "")) //+"; by:"+(e.stack||e.description||"")
  },
  log: function log(obj, mark, type) {
    //nx: log(mark='',type='log',...obj)
    if (!this.op.log || process.env.NODE_ENV != 'development') return;
    mark = mark || '';
    type = type || mark == 'error' ? 'error' : 'log';
    obj = _util.default.inspect(obj, {
      maxArrayLength: null,
      depth: null,
      colors: true,
      compact: false,
      breakLength: 100
    });
    if (typeof mark == 'string') mark = (this.op.mark != '' ? this.op.mark + '/' : '') + mark;else if (mark instanceof Array) mark[0] = (this.op.mark != '' ? this.op.mark + '/' : '') + mark[0];
    console[type]("---\n ".concat(mark, ":\n"), obj, '\n---');
  },
  now: function now() {
    //ms
    return Math.round(new Date().getTime());
  },
  isArray: function isArray(obj) {
    return obj && (obj instanceof Array || typeof obj != 'string' && typeof obj[Symbol.iterator] == 'function');
  },
  inArray: function inArray(str, arr, keepCase) {
    var _this = this;

    return this.run(['eldeeb/inArray', str, arr, keepCase], function () {
      if (!keepCase && typeof str == 'string') str = str.toLowerCase();

      if (_this.isArray(arr)) {
        for (var i = 0; i < arr.length; i++) {
          if (!keepCase && typeof arr[i] == 'string') arr[i] = arr[i].toLowerCase();
          if (arr[i] == str) return true;
        }
      } else if (_typeof(arr) == 'object') return str in arr;
    });
  },
  sleep: function sleep(seconds) {
    //to pause a js function make it async and use await sleep(duration);
    //ex: this.run(async fn(){await this.sleep(1); alert(1);})
    if (!seconds) seconds = 2;
    return new Promise(function (resolve) {
      return setTimeout(resolve, seconds * 1000);
    });
  },
  df: function df(k, v) {
    if (typeof k == 'undefined') return v;else return k;
  },
  objectType: function objectType(obj) {
    return Object.prototype.toString.call(obj).replace('[object ', '').replace(']', '').toLowerCase();
    /*
    {} => object
    [] => array
    null => null
    function(){} => function
    1 => number
    "x", 'x', `x` => string
    */
  },
  in_array: function in_array(x, a, str) {
    if (_typeof(a) != 'object') return;

    for (var i = 0; i < a.length; i++) {
      if (a[i] == x || str && x.indexOf(a[i]) != -1) return true;
    }
  },
  isEmpty: function isEmpty(obj) {
    return typeof obj == 'undefined' || this.in_array(obj, ['', null, [], {}]);
  },

  /*
   log:function(...msg){
    if(msg[0]=="e" || msg[0]=="error"){msg.shift();cns=console.error;}
    else if(msg[0]=="w" || msg[0]=="warn" || msg[0]=="warning"){msg.shift();cns=console.warn;}
    else{
      if(msg[0]=="log")msg.shift();
      cns=console.log;
    }
    cns(...msg);
  },*/
  merge: function merge(target) {
    var _this2 = this,
        _arguments = arguments;

    for (var _len = arguments.length, obj = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      obj[_key - 1] = arguments[_key];
    }

    //merge objects,arrays,classes (must besame type) ;
    return this.run(['merge', target].concat(obj), function () {
      var type = _this2.objectType(target);

      for (var i = 1; i < _arguments.length; i++) {
        if (_this2.objectType(_arguments[i]) !== type) return target;
      }

      if (type == 'array') {
        var _target;

        target = (_target = target).concat.apply(_target, obj);
      } else if (type == 'object') {
        //target=Object.assign(target,...obj) //later objects dosen't override previous ones
        for (var i = 1; i < _arguments.length; i++) {
          for (var p in _arguments[i]) {
            target[p] = _arguments[i][p]; //to override current values
          }
        }
      } else if (type == 'class') {//add or override target's methods & properties
      }

      return target;
    });
  },
  json: function json(data) {
    if (typeof data == 'string') {
      if (data.trim().charAt(0) == '{') return JSON.parse(data);
      if (data.split('.').pop().toLowerCase() == 'json') return require(data); //load a .json file

      data = require('fs').readFileSync(data);
      return JSON.parse(data);
    } else return JSON.stringify(data); //nx: if(string & !start)

  },
  //Loading modules
  db: function db(type, options, done, fail, events) {
    if (typeof type == 'undefined' || type == 'mongo' || type == 'mongoose') type = 'mongoDB';else if (this.objectType(type) == 'object') {
      fail = done;
      done = options;
      options = type;
      type = 'mongoDB';
    }

    var db = require("./db-".concat(type, ".js")).default;

    return new db(options, done, fail, events); //nx: if file_exists
  },
  promise: function promise(fn, done, failed) {
    //eldeeb = this
    var promise = require('./promise.js').default;

    return new promise(fn, done, failed);
  },
  when: function when(fn, done, failed) {
    return this.promise(fn, done, failed);
  },
  error: function error(err, throwError, jsError) {
    var promise = require('./error.js').default;

    return new promise(err, throwError, jsError);
  }
};
exports.default = _default;