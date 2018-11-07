const mongoose = require('mongoose'),
  eldeeb = require('./index.js')

module.exports = class db_mongoDB /* extends mongoose.constructor*/ {
  //mongoose/lib/index.js exports new mongoose(), not the class itself; also mongoose is a Function
  constructor(options, callback) {
    //nx: return Promise
    //note: if this class didn't extends mongoose, 1- don't use super() 2- use mongoose instead of this to access mongoose properties
    //when extends
    //super(options)
    if (callbck instanceof this) {
      this.connection = callback
      return
    }

    this.options = options
    this.mongoose = mongoose //nx: just to use outside this class ex: mongo.mongoose.set(..), we don't need this var for our class

    if (options.pk) {
      this.pk == options.pk
      delete options.pk
    } else this.pk == '__id'

    if (options.debug) {
      mongoose.set('debug', true)
      eldeeb.op.log = true //don't use $this.debug, to controll all logs via eldeeb
    } else {
      mongoose.set('debug', false)
      eldeeb.op.log = false //default is true
    }
    delete options['debug']

    mongoose.set('autoIndex', false)
    mongoose.set('useNewUrlParser', true) //also provided inside connect()
    mongoose.set('useFindAndModify', false) //https://mongoosejs.com/docs/deprecations.html
    mongoose.set('useCreateIndex', true)

    if (callback && typeof callback == 'function') this.connect(callback) //auto establish a connection; set to false when you like to set some properties to mongoose interface before establishing a connection
    return this //for chaining
  }

  run(mark, fn) {
    if (typeof mark == 'string') mark = 'mongoDB/' + mark
    else if (mark instanceof Array) mark[0] = 'mongoDB/' + mark[0]
    return eldeeb.run(mark, fn)
  }

  connect(options, callback) {
    //nx: return promise
    //nx: connect(fn(){..}), connect() => use default connection
    let $this = this
    if (typeof options == 'function') {
      callback = options
      options = this.options
    }

    return this.run(['connect', options /*,callback*/], () => {
      if (eldeeb.isEmpty(options)) {
        if (!eldeeb.isEmpty($this.options)) options = $this.options
        else {
          if (callback && typeof callback == 'function') callback('error') //nx: error details;
          return null
        }
      }

      if (!('useNewUrlParser' in options)) options['useNewUrlParser'] = true
      if (!('useCreateIndex' in options)) options['useCreateIndex'] = true

      let uri = ''
      if (options.uri && !eldeeb.isEmpty(options.uri)) {
        //don't use options[uri], if so, encodeURIComponent(user & pass)
        uri = options['uri']
      } else {
        if (typeof options == 'string' && options != '') {
          if (options.substr(0, 7) != 'mongodb')
            options = 'mongodb' + (options.srv ? '+srv' : '') + '://' + options
          uri = options
          options = {}
        } else {
          if (options instanceof Array) {
            options = {
              user: options[0],
              pass: options[1],
              host: options[2],
              db: options[3]
            }
          }

          /* if(eldeeb.objectType(options["options"])=="object"){
             options["options"]= Object.keys(options["options"]).map(key => key + '=' + options["options"][key]).join('&');
           }*/
          if (!options['user'] || !options['pass']) {
            if (callback && typeof callback == 'function') callback('error') //nx: error details; or throw error
            return null
          }
          if (!options['host']) options['host'] = 'localhost' //nx: default port
          // if(!("db" in options))options["db"]="database" //nx: default port
          uri = `mongodb${options.srv ? '+srv' : ''}://${encodeURIComponent(
            options['user']
          )}:${encodeURIComponent(options['pass'])}@${
            options['host'] instanceof Array
              ? options['host'].join(',')
              : options['host']
          }/${options['db']}}` //?${options["options"]
        }
      }
      delete options['uri']
      delete options['user']
      delete options['pass']
      delete options['host']
      delete options['db']
      delete options['options']
      //options may has another properties for Mongoose or mongoDB, so don't set options to null
      if (eldeeb.op.log) console.log('===uri===', uri, options)
      const db = mongoose.createConnection(uri, options, function(error) {
        if (error) {
          if (callback) callback('mongooseError') //the error occures on mongoose, not mongoDB, success here doesn't mean we have a success connection to the real database
          return //nx: throw an error
        }
      })

      //db=$this.connection; //returns the default connection by mongoose.connect(), not the current connection

      // https://nodejs.org/api/events.html#events_emitter_once_eventname_listener
      if (callback && typeof callback == 'function') {
        //or: if(eldeeb.objectType(callback)=="function"); nx: how to get a reference to the current connection i.e: db
        db.on('error', function(err) {
          callback('error', err)
        }) //connectionError;the listener must be a function

        //let $this=this,$super=super;
        db.once('open', () => {
          //tmp for testing
          /*  console.log("=findOne=");
           let {model:myModel,schema:mySchema} = this.model('users', { name: String, email:String });
           myModel.findOne(function(error,data){console.log("findOne",error,data);}) //nx: not called??
        */
          /*
           let mySchema= new mongoose.Schema({ name: String, email:String },{collection:"users",autoIndex:false});
           let myModel=db.model("users",mySchema)
           myModel.findOne({name:"test"}, { timeout: 1000 },function(error, data) {
                console.log("findOne",error,data);
           }); */

          callback('open', db)
          //db.close();
        })
        db.once('connected', function() {
          callback('connected', db)
        })
        db.once('disconnected', function() {
          callback('disconnected', db)
        })
        db.once('reconnected', function() {
          callback('reconnected', db)
        })
        db.once('connecting', function() {
          callback('connecting', db)
        })
        db.once('disconnecting', function() {
          callback('disconnecting', db)
        })
        db.once('index', function() {
          callback('index', db)
        })
        db.once('close', function() {
          callback('close', db)
        })
        //or {error:fn(){..}, open:fn(){..}, connected:fn(){..}}
      }
      $this.connection = db
      return db
    })
  }

  _schema(obj, options) {
    //this.Schema != super.Schema without this function ; nx: not called by model() if it's name is "Schema"
    let $this = this
    return this.run(['schema', obj], () => {
      options = options || { autoIndex: false }
      if (!('autoIndex' in options)) options['autoIndex'] = false
      return new mongoose.Schema(obj, options) //nx: $this.Schema != mongoose.Schema
    })
  }

  model(coll, schema, options) {
    let $this = this
    return this.run(['model', schema, options], () => {
      if (!(schema instanceof mongoose.Schema)) {
        options = options || {}
        if (!('collection' in options)) options['collection'] = coll
        schema = $this._schema(schema, options)
      }
      console.log('conn', $this.connection)
      return { model: $this.connection.model(coll, schema), schema: schema } //var {model,schema}=db.model(..); or {model:MyModel,schema:mySchema}=db.model(..) then: schema.set(..)
      //don't use $super(model) because it referce to the default connection created by mongoose.connect(), not the current connection
    })
  }

  select() {
    //aggregate=select([stages])
  }

  get() {}
}
