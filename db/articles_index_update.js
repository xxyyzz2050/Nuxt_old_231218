/*
nx: index by categoy or use article_categories
*/
const mongo = require('./index.js')

mongo
  .connect()
  .done(db => {
    let { model } = db.model('articles', require('./schema/articles.js')[0]) //or use mongo.model()

    let agg = model
      .aggregate()
      .match({
        status: 'approved',
        $or: [
          // don't use feild:{$or:[]}, use $or:[{exp1},{exp2},..]
          { expireAt: { $lt: new Date() } }, //nx: check timezones
          { expireAt: { $exists: false } },
          { expireAt: null }
        ]
      })
      .project({
        shortId: 1,
        author: 1,
        title: 1,
        subtitle: 1,
        summary: 1,
        keywords: 1,
        stars: 1,
        link: 1,
        location: 1,
        extra: 1,
        category: 1
        //  week: { $week: '$_id' } //to groupBy week
      })
      .sort({ _id: -1, stars: -1 })
      .out('tmp.articles_index')

    agg.exec().then(
      data => console.log('data:', data), //nx: populate(): author,categories,keywords then update tmp.articles_index
      err => console.error('error:\n', { pipeline: agg.pipeline(), err: err })
    )
  })
  .fail(err => console.error('db error:', err))
