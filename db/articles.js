const mongo = require('./index.js')

//use tmp.articles & tmp.articles_index

mongo
  .connect()
  .done(db => {
    let { model } = db.model('articles', require('./schema/articles.js')[0]) //or use mongo.model()

    let agg = model.aggregate([{ $limit: 3 }]).project({ _id: 1, title: 1 })

    console.log('pipeLine:', agg.pipeline())

    agg
      .explain()
      .then(
        data => console.log('explain:', data),
        err => console.log('explain Error:', err)
      )

    agg.exec((err, data) => {
      if (err) console.error('error:', err)
      else console.log('data:', data)
    })

    agg.out('tmp.articles').exec((err, data) => {
      if (err) console.error('tmp error:', err)
      else console.log('tmp data:', data)
    })
  })
  .fail(err => console.error('db error:', err))
