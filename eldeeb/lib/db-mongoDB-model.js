import eldeeb from './index.js'
import { model as Model } from 'mongoose'
eldeeb.op.mark = 'db/mongoDB-model'

export default class db_mongoDB_model extends Model {
  constructor(coll, schema) {
    return super(coll, schema)
  }
}
