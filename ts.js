/*
nx: index by categoy or use article_categories
- to match by id: $match{_id:mongodb.ObjectId('id')}
- we make a tmp collection and save a ready-to-use data because many devices will retrive these data (instead of making each device handle cahing process)
*/
const mongo = require('./db/index.js'),
  util = require('util'),
  log = function(mark, obj) {
    if (!obj) {
      obj = mark
      mark = null
    }
    if (!mark) mark = Math.ceil(Math.random() * 1000)
    obj = util.inspect(obj, {
      maxArrayLength: null,
      depth: null,
      colors: true,
      compact: false,
      breakLength: 100
    })
    console.log(`# ${mark}:\n`, obj)

    //fs.writeFileSync('log.htm', obj.replace(//g, '\n')) -> use chrome devTools
  }

mongo
  .connect()
  .done(db => {
    let { model } = db.model(
      'tmp.articles',
      require('./db/schema/tmp.articles.js')[0]
    ) //or use mongo.model()

    let agg = model
      .aggregate()

      .project({
        link: 1,
        shortId: 1
      })

    agg.exec().then(
      data => {
        console.log(data)
      },
      err => log('error', { pipeline: agg.pipeline(), err: err })
    )
  })
  .fail(err => log('db error:', err))
