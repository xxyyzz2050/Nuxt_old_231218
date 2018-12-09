const mongo = require('./index.js').default
export default function(shortId) {
  console.log('shortId:', shortId)
  if (!shortId) return null
  return mongo.connect().done(db => {
    let { model } = db.model(
      'tmp.articles',
      require('./schema/tmp.articles.js')[0]
    )
    return model.findOne({ shortId: shortId })
  })
}
