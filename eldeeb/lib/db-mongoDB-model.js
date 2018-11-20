const Model = require('mongoose').model,
  eldeeb = require('./index.js')
eldeeb.op.mark = 'db/mongoDB-model'

module.exports = class db_mongoDB_model extends Model {
  constructor(coll, schema) {
    return super(coll, schema)
  }
}
