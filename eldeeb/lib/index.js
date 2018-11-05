module.exports = {
  op: {
    //options
    log: true, //nx: min log level
    minLogLevel: 'log', //log,warn,error (verbose)
    debug: false
  },
  run: function(mark, fn) {
    //nx: mark="eldeeb:"+this.run.caller (not allowed in strict mode), https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee
    /*
     if fn returns a value, you mast return this.run()
     ex: function test(){
           return eldeeb.run("test",function(){return 123});
         }
         alert(test()); //123

         nx: to use await pass async fn, ex: this.run(async fn(){await sleep(1); alert(1);});
    */

    if (this.op.debug) debugger
    if (typeof fn != 'function') {
      if (typeof mark != 'function') {
        if (this.op.log) console.warn('eldeeb run: not a function ', mark, fn)
        return
      }
      tmp = fn
      fn = mark
      mark = tmp
    }

    try {
      f = fn()
      if (mark && this.op.log) console.log('success: ', 'eldeeb:' + mark, f)
      return f
    } catch (e) {
      this.err(e, mark, fn)
    }
    //note that any console.log() inside fn() will appear BEFORE console.log("Success:**"), success must be at the end of try{}
    //don't concatenate mark (or other objects) to expand them to show their properties (concatenation will cast it to string)
  },
  err: function(e, at, extra) {
    if (typeof at == 'undefined') at = 'eldeeb.js'
    console.error(
      `Error @eldeeb: ${at} (${e.name})${e.message ? ' :' + e.message : ''}${
        e.lineNumber
          ? ' @' + e.lineNumber + ' in' + e.fileName
          : e.stack
            ? e.stack
            : e.description
              ? e.description
              : '--'
      }\n->` /*, (extra ? extra : "")*/
    )
    //console.error("Error @eldeeb: " + at + "(" + e.name + "): " + e.message + " @" + (e.lineNumber || "") + ":" + (e.columnNumber || "") + " in: " + (e.fileName || "--") + " \n->", (extra ? extra : "")) //+"; by:"+(e.stack||e.description||"")
  },
  sleep: function(seconds) {
    //to pause a js function make it async and use await sleep(duration);
    //ex: this.run(async fn(){await this.sleep(1); alert(1);})
    if (!seconds) seconds = 2
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
  },
  df: function(k, v) {
    if (typeof k == 'undefined') return v
    else return k
  },
  objectType: function(obj) {
    return Object.prototype.toString
      .call(obj)
      .replace('[object ', '')
      .replace(']', '')
      .toLowerCase()
    /*
   {} => object
   [] => array
   null => null
   function(){} => function
   1 => number
   "x", 'x', `x` => string
   */
  },
  in_array: function(x, a, str) {
    if (typeof a != 'object') return
    for (i = 0; i < a.length; i++) {
      if (a[i] == x || (str && x.indexOf(a[i]) != -1)) return true
    }
  },
  isEmpty(obj) {
    return typeof obj == 'undefined' || this.in_array(obj, ['', null, [], {}])
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

  //Loading modules
  db(type) {
    if (typeof type == 'undefined' || type == 'mongo' || type == 'mongoose')
      type = 'mongoDB'
    return require(`./db-${type}.js`) //nx: if file_exists
  }
}
