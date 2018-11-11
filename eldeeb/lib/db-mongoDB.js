const mongoose = require('mongoose'),
  eldeeb = require('./index.js')
eldeeb.op.mark = 'db/mongoDB'

module.exports = class db_mongoDB /* extends mongoose.constructor*/ {
  //mongoose/lib/index.js exports new mongoose(), not the class itself; also mongoose is a Function
  constructor(options, done,fail) {
    //nx: return Promise
    //note: if this class didn't extends mongoose, 1- don't use super() 2- use mongoose instead of this to access mongoose properties
    //when extends
    //super(options)

return eldeeb.run(['()', options /*,callback*/], () => {
     this.promise=eldeeb.promise((resolve,reject)=>{
       let err=eldeeb.error(100)

    if(typeof options=="function")options=options()
    if (eldeeb.isEmpty(options))reject(err)
    else if(typeof(options)=="string"){
      if(options != '')options={uri:options}
      else reject(err)
    }
    else if (options instanceof Array) {
        //don't use typeof options=="Array"
        options = {
          user: options[0],
          pass: options[1],
          host: options[2],
          db: options[3]
        }
      }

     if(eldeeb.objectType(options)!="object")reject(err)

     if(typeof options.uri=="function")options.uri=(options.uri)(options)

    let uri=""
    if(("uri" in options)&&!eldeeb.isEmpty(options.uri)){
      uri = (options.uri.substr(0, 7) != 'mongodb'?'mongodb' + (options.srv ? '+srv' : '') + '://':'') + options.uri
    }else{
      if(!("user" in options)||!("pass" in options)||eldeeb.isEmpty(options.use)||eldeeb.isEmpty(options.pass))reject(err)
      if (!options['host']) options['host'] = 'localhost' //nx: default port
      // if(!("db" in options))options["db"]="database"
      uri = `mongodb${options.srv ? '+srv' : ''}://${encodeURIComponent(options['user'])}:${encodeURIComponent(options['pass'])}@${options['host'] instanceof Array? options['host'].join(','): options['host']}/${options['db']}}` //?${options["options"]
    }

  delete options['uri']
  delete options['user']
  delete options['pass']
  delete options['host']
  delete options['db']
  delete options['options'] //deprecated: options for native dbMongo (appended to uri ->uri?options)
  //options may has another properties for Mongoose or mongoDB, so don't set options to null

    }

if (options.debug) {
  mongoose.set('debug', true)
  eldeeb.op.log = true
} else {
  mongoose.set('debug', false)
  eldeeb.op.log = false //default is true
}
delete options['debug']
if (eldeeb.op.log) console.log('===uri===', uri, options)

if (options.pk) {
  this.pk == options.pk
  delete options.pk
} else this.pk == '__id'

if (!('useNewUrlParser' in options)) options['useNewUrlParser'] = true
if (!('useCreateIndex' in options)) options['useCreateIndex'] = true
this.models = './models' //default path for model schema objects
this.mongoose = mongoose //nx: just to use outside this class ex: mongo.mongoose.set(..), we don't need this var for our class

mongoose.set('autoIndex', false)
mongoose.set('useNewUrlParser', true) //also provided inside connect()
mongoose.set('useFindAndModify', false) //https://mongoosejs.com/docs/deprecations.html
mongoose.set('useCreateIndex', true)

this.connection=mongoose.createConnection(uri, options, function(error) {
  //mongoose.connect() is the default connection using .createConnection, here every instance has only one connection
  if (error){ //the error occures on mongoose, not mongoDB, success here doesn't mean we have a success connection to the real database
    err['extra']=error;
    reject(err)
  }

  // https://nodejs.org/api/events.html#events_emitter_once_eventname_listener
  //nx: needs review
  //nx: return a promise.resolve(this,status) ,on('error',reject(e))
   this.once(
     [
       'connected',
       'disconnected',
       'reconnected',
       'connecting',
       'reconnecting',
       'disconnecting',
       'index',
       'close',
       'error',
       'open'
     ],
     function(event) {
       resolve(event) //nx: reject on error
     }
   )



}) //.createConnection()

},done,fail) //promise
return this; //for chaining
}
}

  connect(options, ,done,fail) {
    //this function just creats a new instance of this class
    return eldeeb.run(['connect', options /*,callback*/], () => {
      return new db-mongoDB(options,done,fail)

  }
}

  on(event, callback, once) {
    var ev = this.connection.on

    /*
    ev(event,callback) will not work because it cantains "this" whitch refers to this.connection, not to this class
    so we use ev.call() to change the context to this.connection
   */ return eldeeb.run(
      'on',
      () => {
        if (this.connection) {
          let ev = once ? this.connection.once : this.connection.on
          //console.log(ev('error')); //OK gives mongooseError
          //console.log('conn:', this.connection) //OK
          //console.log('ev:', this.connection.on('error', function() {})) //error!
          if (event instanceof Array) {
            for (let i = 0; i < event.length; i++) {
              //nx: useing var instead of let gives a wrong (i) inside function(){..}, why?
              ev.call(this.connection, event[i], function() {
                callback(event[i])
              })
            }
          } else ev.call(this.connection, event, callback) //nx: if once .once(..)
        }
        return this //chaining this function will NOT wait it to finish, so on(error,fn).on(open,fn) will work fine
      }
    )
  }

  once(event, callback) {
    return this.on(event, callback, true)
  }
  _schema(obj, options) {
    //this.Schema != super.Schema without this function ; nx: not called by model() if it's name is "Schema"
    let $this = this
    return eldeeb.run(['schema', obj], () => {
      options = options || { autoIndex: false }
      if (!('autoIndex' in options)) options['autoIndex'] = false
      return new mongoose.Schema(obj, options) //nx: $this.Schema != mongoose.Schema
    })
  }

  model(coll, schema, options) {
    if (!this.connection) return null
    return eldeeb.run(['model', schema, options], () => {
      if (typeof schema == 'string')
        schema = require(`${schema}/${coll}.js`) || {}
      else if (schema == null || typeof schema == 'undefined') {
        schema = require(`${this.options.models}/${coll}.js`) || {}
      }
      if (!(schema instanceof mongoose.Schema)) {
        options = options || {}
        if (!('collection' in options)) options['collection'] = coll
        schema = this._schema(schema, options)
      }
      return { model: this.connection.model(coll, schema), schema: schema } //var {model,schema}=db.model(..); or {model:MyModel,schema:mySchema}=db.model(..) then: schema.set(..)
      //don't use $super(model) because it referce to the default connection created by mongoose.connect(), not the current connection
    })
  }

  select() {
    //aggregate=select([stages])
  }

  get() {}

  then(ok, err) {
    return then(ok, err)
  }
}
