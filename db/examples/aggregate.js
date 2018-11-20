const mongo = require('../index.js')

mongo
  .connect()
  .done(db => {
    console.log('=============================')
    let { model } = db.model('articles', require('../schema/articles.js')[0])

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
  })
  .fail(err => console.error('db error:', err))
