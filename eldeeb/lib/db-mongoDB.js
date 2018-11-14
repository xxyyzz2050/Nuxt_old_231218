const mongoose = require('mongoose'),
  eldeeb = require('./index.js')

eldeeb.op.mark = 'db/mongoDB'

module.exports = class db_mongoDB /* extends mongoose.constructor*/ {
  //mongoose/lib/index.js exports new mongoose(), not the class itself; also mongoose is a Function
  constructor(options, done, fail, events) {
    //nx: return Promise
    //note: if this class didn't extends mongoose, 1- don't use super() 2- use mongoose instead of this to access mongoose properties
    //when extends
    //super(options)

    return eldeeb.run(['()', options /*,callback*/], () => {
      this.promise = eldeeb.promise(
        (resolve, reject) => {
          let err = eldeeb.error(100),
            defaultOptions = {
              useNewUrlParser: true,
              useCreateIndex: true,
              useNewUrlParser: true, //https://mongoosejs.com/docs/deprecations.html
              useFindAndModify: false,
              bufferCommands: false, //https://mongoosejs.com/docs/connections.html
              autoIndex: false
            }

          if (typeof options == 'function') options = options()
          if (eldeeb.isEmpty(options))
            reject({ ...err, extra: ['options is empty', this.uri, options] })
          else if (typeof options == 'string') options = { uri: options }
          else if (options instanceof Array) {
            //don't use typeof options=="Array"
            options = {
              user: options[0],
              pass: options[1],
              host: options[2],
              db: options[3]
            }
          }

          if (eldeeb.objectType(options) != 'object')
            reject({
              ...err,
              extra: ['options is not an object', this.uri, options]
            })

          if (typeof options.uri == 'function')
            options.uri = options.uri(options)

          if ('uri' in options && !eldeeb.isEmpty(options.uri)) {
            this.uri =
              (options.uri.substr(0, 7) != 'mongodb'
                ? 'mongodb' + (options.srv ? '+srv' : '') + '://'
                : '') + options.uri
          } else {
            if (
              !('user' in options) ||
              !('pass' in options) ||
              eldeeb.isEmpty(options.user) ||
              eldeeb.isEmpty(options.pass)
            )
              reject({
                ...err,
                extra: ['no uri or user/pass', this.uri, options]
              })
            if (!options['host']) options['host'] = 'localhost' //nx: default port
            // if(!("db" in options))options["db"]="database"
            this.uri = `mongodb${
              options.srv ? '+srv' : ''
            }://${encodeURIComponent(options['user'])}:${encodeURIComponent(
              options['pass']
            )}@${
              options['host'] instanceof Array
                ? options['host'].join(',')
                : options['host']
            }/${options['db']}` //?${options["options"]
          }

          this.models = options.models ? options.models : '../../../models' //default path for model schema objects (node_modules/eldeeb/lib/this-file) (don't use '/models')
          if (options.debug) {
            mongoose.set('debug', true)
            eldeeb.op.log = true
          } else {
            mongoose.set('debug', false)
            eldeeb.op.log = false //default is true
          }
          delete options['uri']
          delete options['user']
          delete options['pass']
          delete options['host']
          delete options['db']
          delete options['options'] //deprecated: options for native dbMongo (appended to uri ->uri?options)
          delete options['models']
          delete options['debug']
          //options may has another properties for Mongoose or mongoDB, so don't set options to null

          if (options.pk) {
            this.pk == options.pk
            delete options.pk
          } else this.pk == '__id'

          options = eldeeb.merge(defaultOptions, options)
          if (eldeeb.op.log)
            console.log('connection details:', this.uri, options)
          this.connection = mongoose.createConnection(this.uri, options)
          if (!this.connection)
            reject({ ...err, extra: ['connection error', this.uri, options] })
          if (events) this.on('all', ev => events(ev)) //this will be run for all events, .then(..db.on('all')) will be run for all events AFTER 'open' because .then() only occurs after 'open' stage
          this.connection.then(
            () => resolve(this), //db is connected & open, using .on() will be run on other events
            error => reject({ ...err, extra: [error, this.uri, options] })
          ) //after mongoose.createConnection() response, resolve/reject this promise
          //the error occures on mongoose, not mongoDB, success here doesn't mean we have a success connection to the real database
          //mongoose.connect() is the default connection using .createConnection, here every instance has only one connection

          // https://nodejs.org/api/events.html#events_emitter_once_eventname_listener
          //nx: needs review
          //nx: return a promise.resolve(this,status) ,on('error',reject(e))
        },
        done, //nx: pass this.connection to done()
        fail
      )

      return this.promise
    }) //run
  }

  connect(options, done, fail) {
    //this function just creats a new instance of this class
    return eldeeb.run(['connect', options /*,callback*/], () => {
      return new db() - mongoDB(options, done, fail)
    })
  }

  on(event, callback, once) {
    /*
    ev(event,callback) will not work because it cantains "this" whitch refers to this.connection, not to this class
    so we use ev.call() to change the context to this.connection
   */ return eldeeb.run(
      once ? 'once' : 'on',
      () => {
        if (this.connection) {
          let ev = once ? this.connection.once : this.connection.on
          //console.log('==ev==', ev)
          //console.log('==this==', this.connection)
          //console.log(ev('error')); //OK gives mongooseError
          //console.log('conn:', this.connection) //OK
          //console.log('ev:', this.connection.on('error', function() {})) //error!
          if (event == 'all')
            event = [
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
            ]
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
  schema(obj, options) {
    //this.Schema != super.Schema without this function ; nx: not called by model() if it's name is "Schema"
    /*
    nx: if(options.times){
      createdAt: { type: Date, default: Date.now },
      modifiedAt: { type: Date, default: Date.now },
    }
    */
    if (obj instanceof mongoose.Schema) return obj
    return eldeeb.run(['schema', obj], () => {
      options = options || {}
      let defaultOptions = {
        createdAt: { type: Date, default: Date.now },
        modifiedAt: { type: Date, default: Date.now }
      }
      options = eldeeb.merge(defaultOptions, options)
      return new mongoose.Schema(obj, options) //nx: $this.Schema != mongoose.Schema
    })
  }

  model(coll, schema, options) {
    //nx: field: anotherSchema ??
    if (!this.connection) return { model: null, schema: null }
    return eldeeb.run(['model', schema, options], () => {
      if (typeof schema == 'string') schema = require(schema) || {}
      else if (schema == null || typeof schema == 'undefined') {
        schema = require(`${this.models}/${coll}.json`) || {}
      }

      if (!(schema instanceof mongoose.Schema)) {
        options = options || {}
        if (!('collection' in options)) options['collection'] = coll
        schema = this.schema(schema, options)
      }

      return { model: this.connection.model(coll, schema), schema: schema } //var {model,schema}=db.model(..); or {model:MyModel,schema:mySchema}=db.model(..) then: schema.set(..)
      //don't use $super(model) because it referce to the default connection created by mongoose.connect(), not the current connection
    })
  }

  createIndex(model, indexes, options) {
    //nx: if(model:object)model=this.model(model); nx: directly use mongoDB
     //schema.index() only set index for autoIndex option
     let defaultOptions={name:'index'} 
     options=eldeeb.merge(defaultOptions,options)
     return model.collection.createIndex(indexes, options) //promise
      /*
      eldeeb.promise(model.collection.createIndex(indexes, options),x=>x,err=>console.error(err))
      return this
      */
  }
  index(model, indexes, options) {
    return this.createIndex(model, indexes, options)
  }

  set(key, value) {
    if (eldeeb.objectType(key) == 'object') {
      for (var k in key) this.set(k, key[k])
    }
    if (key == 'models') this.models = value
    else mongoose.set(key, value)
  }

  //nx: move to mongoose-model() extends mongoose.model
  select() {
    //aggregate=select([stages])
  }

  get() {}
}
