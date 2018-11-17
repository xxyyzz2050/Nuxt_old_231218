const Schema = require('mongoose').Schema,
  eldeeb = require('./index.js')
eldeeb.op.mark = 'db/mongoDB-schema'

module.exports = class db_mongoDB_schema extends Schema {
  constructor(obj, options) {
    return eldeeb.run('()', () => {
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
      obj = obj || {}
      if (eldeeb.objectType(obj) == 'object') {
        if ('fields' in options) obj = eldeeb.merge(obj, options['fields'])
        var adjust = options['adjust'] || {}
        delete options['fields']
        delete options['adjust']
        options = options || {}
        if (obj.times === true || obj.times === 1) {
          obj.createdAt = { type: Date, default: Date.now }
          obj.modifiedAt = { type: Date, default: Date.now }
          delete obj.times
        } else {
          if (obj.createdAt === true || obj.createdAt === 1)
            obj.createdAt = { type: Date, default: Date.now }
          if (obj.modifiedAt === true || obj.modifiedAt === 1)
            obj.modifiedAt = { type: Date, default: Date.now }
        }
        let defaultOptions = { strict: false }
        options = eldeeb.merge(defaultOptions, options)
        var schema = super(obj, options)
      } else {
        if (!(obj instanceof Schema)) return //nx: throw error
        var schema = obj //nx: call super()?
      }

      if (adjust) {
        for (let key in adjust) {
          if (eldeeb.objectType(adjust[key] == 'object')) {
            for (let x in adjust[key]) {
              schema[key][x] = adjust[key][x]
            }
          } else schema[key] = adjust[key]
        }
      }

      return schema
    })
  }
}
