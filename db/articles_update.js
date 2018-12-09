/*
create tmp collections for articles & articles_index (index page)
- to match by id: $match{_id:mongodb.ObjectId('id')}
- we make a tmp collection and save a ready-to-use data because many devices will retrive these data (instead of making each device handle cahing process)
nx: index by categoy or use article_categories
*/
const mongo = require('./index.js'),
  util = require('util'),
  log = function(mark, obj) {
    if (!obj) {
      obj = mark
      mark = null
    }
    mark = mark || ''
    obj = util.inspect(obj, {
      maxArrayLength: null,
      depth: null,
      colors: true,
      compact: false,
      breakLength: 100
    })
    console.log(`--- ${mark}:\n`, obj)

    //fs.writeFileSync('log.htm', obj.replace(//g, '\n')) -> use chrome devTools
  }

mongo
  .connect()
  .done(db => {
    console.log('== articles_index:Start ==')
    let { model } = db.model('articles', require('./schema/articles.js')[0]) //or use mongo.model()

    let agg = model
      .aggregate()
      .match({
        status: 'approved',
        $or: [
          // don't use feild:{$or:[]}, use $or:[{exp1},{exp2},..]
          { expireAt: { $lt: new Date() } }, //nx: check timezones
          { expireAt: null } //retrive null or missing fields (i.e includes $exists:true)
        ]
      })

      .project({
        shortId: 1,
        author: 1,
        title: 1,
        subtitle: 1,
        summary: 1, //summary(content)
        stars: 1,
        location: 1,
        category: 1,
        link: 1
        //  week: { $week: '$_id' } //to groupBy week
      })
      .sort({ _id: -1, stars: -1 })
      .lookup({
        //get the article_categories of this article

        from: 'article_categories',
        as: 'categories',
        let: { article: '$_id' },
        pipeline: [{ $match: { $expr: { $eq: ['$article', '$$article'] } } }]
      })
      .addFields({
        //nx: if($category!=null)categories.push(category).toSet()
        categories: {
          $cond: [
            { $ne: ['$category', null] },
            { $concatArrays: [[{ category: '$category' }], '$categories'] },
            '$categories'
          ]
        }
      })

      .unwind('$categories') //.lookup() returns an array, so wee need to unwind() it before the next stage

      //convert categories ids to names
      .lookup({
        from: 'categories',
        as: 'categories',
        let: { id: '$categories.category' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
          { $limit: 1 }
        ]
      })
      .unwind('$categories')
      .group({
        //group the results by articles
        _id: '$_id',
        categories: { $push: '$categories.name' }, //or: [name,shortId]
        shortId: { $first: '$shortId' },
        author: { $first: '$author' },
        title: { $first: '$title' },
        subtitle: { $first: '$subtitle' },
        summary: { $first: '$summary' },
        stars: { $first: '$stars' },
        location: { $first: '$location' },
        link: { $first: '$link' },
        category: { $first: '$category' } //get the first (and the only only) element of [$category] array as a string;  or unwind("category") before group()
      })

      .lookup({
        from: 'persons',
        as: 'author',
        let: { id: '$author' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
          { $limit: 1 }
        ]
      })
      .addFields({
        //project replaces the fields, addFields add them to the existing fields
        category: { $arrayElemAt: ['$categories', 0] },
        author: { $arrayElemAt: ['$author', 0] },
        link: { $ifNull: ['$link', '$title'] }
      })

      .addFields({
        author: ['$author.shortId', db.implode('$author.name', ' ')], //nx: [id,implode(first last)]
        link: {
          //link=/article/[$category/$link/]shortId; regex:/\/articles\/(?:.*\/)?([^\/]+)/  or /\/articles\/.*\/(.*)/  or ...[a-zA-Z0-9-_]+
          $concat: [
            {
              $cond: [
                '$category',
                { $concat: [db.replace('$category', ' ', '-'), '/'] },
                ''
              ]
            },
            {
              $cond: [
                '$link',
                { $concat: [db.replace('$link', ' ', '-'), '/'] },
                ''
              ]
            },
            '$shortId' //contains (-)
          ]

          /*  $concat: [
          db.replace({ $ifNull: ['$category', 'article'] }, ' ', '-'),
            '/',
            '$shortId',
            '-',
            db.replace({ $ifNull: ['$link', '$title'] }, ' ', '-')
          ] */
        },
        category: '$remove',
        shortId: '$remove' //only used for $link
      })

      .out('tmp.articles_index')

    agg.exec().then(
      () => {
        console.log('== articles:start:==')
        agg = model
          .aggregate()
          .project({
            shortId: 1,
            author: 1,
            title: 1,
            subtitle: 1,
            content: 1,
            summary: 1,
            keywords: 1,
            location: 1,
            category: 1,
            link: 1,
            expired: {
              $and: ['$expireAt', { $lt: ['$expireAt', 'IsoDate()'] }]
              /*
              gives wrong result: tested on: missing expiredAt , expiredAt>now, expiredAt<now
              $not: {
                $or: [{ expireAt: null }, { $gte: ['$expireAt', new Date()] }] //nx: https://stackoverflow.com/questions/53493495/mongodb-or-always-return-false-const
              }*/
            },
            modifiedAt: 1,
            status: 1
          })
          .lookup({
            from: 'article_categories',
            as: 'categories',
            let: { article: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$article', '$$article'] } } }
            ]
          })
          .addFields({
            categories: {
              $cond: [
                { $ne: ['$category', null] },
                { $concatArrays: [[{ category: '$category' }], '$categories'] },
                '$categories'
              ]
            }
          })
          .unwind('$categories')
          .lookup({
            from: 'categories',
            as: 'categories',
            let: { id: '$categories.category' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
              { $limit: 1 }
            ]
          })
          .unwind('$categories')
          .group({
            _id: '$_id',
            categories: { $push: db.implode('$categories.name', ' ') },
            shortId: { $first: '$shortId' },
            author: { $first: '$author' },
            title: { $first: '$title' },
            subtitle: { $first: '$subtitle' },
            summary: { $first: '$summary' },
            stars: { $first: '$stars' },
            location: { $first: '$location' },
            link: { $first: '$link' },
            category: { $first: '$category' },
            content: { $first: '$content' },
            keywords: { $first: '$keywords' },
            expired: { $first: '$expired' },
            modifiedAt: { $first: '$modifiedAt' },
            status: { $first: '$status' }
          })

          .lookup({
            from: 'persons',
            as: 'author',
            let: { id: '$author' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
              { $limit: 1 }
            ]
          })
          .addFields({
            category: { $arrayElemAt: ['$categories', 0] },
            author: { $arrayElemAt: ['$author', 0] },
            link: { $ifNull: ['$link', '$title'] }
          })

          .addFields({
            author: ['$author.shortId', db.implode('$author.name', ' ')],
            link: {
              $concat: [
                {
                  $cond: [
                    '$category',
                    { $concat: [db.replace('$category', ' ', '-'), '/'] },
                    ''
                  ]
                },
                {
                  $cond: [
                    '$link',
                    { $concat: [db.replace('$link', ' ', '-'), '/'] },
                    ''
                  ]
                },
                '$shortId'
              ]
            },
            category: '$remove'
            //shortId: '$remove' //Don't remove shortId because it will be used to access the article (from the index page)
          })

          .out('tmp.articles')

        agg
          .exec()
          .then(
            () => console.log('== articles:end=='),
            err => log('article error:', { pipeline: agg.pipeline(), err: err })
          )
      },
      err => log('error', { pipeline: agg.pipeline(), err: err })
    )
  })
  .done('== DONE ===')
  .fail(err => log('db error:', err))
