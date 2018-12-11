import fs from 'fs'
import mongo from './index.js'
import Data from '../eldeeb/lib/custom/data'
import schema from './schema/tmp.articles.js'

export default function(shortId) {
  if (!shortId) return null
  let data = new Data()
  return data.cache(
    `articles/${shortId}.json`,
    async () => {
      return await mongo.connect().then(db => {
        let { model } = db.model('tmp.articles', schema[0])
        return model
          .findOne({ shortId: shortId })
          .lean()
          .exec()
      })
    },
    3,
    'json'
  )
}
