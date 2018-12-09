const mongo = require('./index.js').default

//use tmp.articles & tmp.articles_index

module.exports = mongo.connect().done(db => {
  let { model } = db.model(
    'tmp.articles_index',
    require('./schema/tmp.articles_index.js')[0]
  )
  return model.find().limit(5) //.then(data => console.log('data', data))
})
