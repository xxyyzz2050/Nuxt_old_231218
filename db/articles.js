const mongo = require('./index.js')

//use tmp.articles & tmp.articles_index

module.exports = mongo.connect().done(db => {
  let { model } = db.model(
    'tmp.articles',
    require('./schema/tmp.articles.js')[0]
  )
  return model.findOne()
})
