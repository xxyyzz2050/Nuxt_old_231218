//use tmp.articles & tmp.articles_index
import Data from '../eldeeb/lib/custom/data.js'
import schema from './schema/tmp.articles_index.js'
import mongo from './index.js'

let data = new Data()
export default data.cache(
  'articles_index.json',
  async () => {
    //  return [{ title: 'title#1', link: '#', x: 1 }] //for test

    return await mongo.connect().then(db => {
      //return [{ title: 'title#2', link: '#', x: 1 }] //nx: not returned??
      let { model } = db.model('tmp.articles_index', schema[0])
      return model
        .find()
        .lean()
        .limit(5)
        .exec()

      //  .then(data => console.log('data', data))
    })
  },
  3,
  'json'
)
