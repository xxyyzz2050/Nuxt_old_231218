/*
nx: index by categoy or use article_categories
*/
const mongo = require('./db/index.js'),
  util = require('util'),
  log = function(mark, obj, showHidden) {
    if (!obj) {
      obj = mark
      mark = null
    }
    if (!mark) mark = Math.ceil(Math.random() * 1000)
    return console.log(`# ${mark}:\n`, util.inspect(obj, showHidden, 100, true))
  },
  implode = function(entry, oldString, newString) {
    return {
      $trim: {
        input: {
          $reduce: {
            input: {
              $split: [entry, oldString]
            },
            initialValue: '',
            in: {
              $cond: [
                { $eq: ['$$this', ''] },
                '$$value',
                { $concat: ['$$value', newString, '$$this'] }
              ]
            }
          }
        },
        chars: newString
      }
    }
  }

mongo
  .connect()
  .done(db => {
    const mongoDebugger = require('mongo-aggregation-debugger')({ uri: db.uri })

    let { model } = db.model('articles', require('./db/schema/articles.js')[0]) //or use mongo.model()

    let agg = model
      .aggregate()
      .match({
        status: 'approved',
        $or: [
          // don't use feild:{$or:[]}, use $or:[{exp1},{exp2},..]
          { expireAt: { $lt: new Date() } }, //nx: check timezones
          { expireAt: null } //{ expireAt: { $exists: false } } -> {expireAt: null}==true if expireAt !exists or null
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
      .unwind('$categories') //.lookup() returns an array, so wee need to unwind() it before the next stage

      //convert categories ids to names
      .lookup({
        from: 'categories',
        as: 'categories',
        let: { id: '$categories.category' },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$id'] } } }]
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
      //also get main category name; nx: only if !null
      .lookup({
        from: 'categories',
        as: 'category',
        let: { category: '$category' },
        pipeline: [
          //we don't use 'localField & foreignField' to limit the $lookup query
          { $match: { $expr: { $eq: ['$_id', '$$category'] } } }, //match:{_id,'$category'} and match:{_id:'$$category'} will not work because $lookup cannot directly access to the current fields (use let & $expr)
          { $limit: 1 }
        ]
      })
      .lookup({
        from: 'persons',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
        //nx: limit1, select:_id,name
      })
      .addFields({
        //project replaces the fields, addFields add them to the existing fields
        category: {
          //category=first:lookupResult||first:categories
          $ifNull: [
            { $arrayElemAt: ['$category', 0] }, //lookup result is array
            { $arrayElemAt: ['$categories', 0] }
          ]
        },
        author: ['$author._id', '$author.name'] //nx: [id, 'first last']
      })

      .addFields({
        link: {
          //link=($category|first:$categories|article)/$shortId-(($link|$title).replace(' ','-'))
          $concat: [
            implode({ $ifNull: ['$category', 'article'] }, ' ', '-'),
            '/',
            '$shortId',
            '-',
            implode({ $ifNull: ['$link', '$title'] }, ' ', '-')
          ]
        },
        category: '$remove'
      })

    //  .out('tmp.articles_index')

    mongoDebugger.log(agg, function(err) {
      if (err) {
        log('mongoDebugger error', err)
      }

      console.log('All done!')
    })
  })
  .fail(err => log('db error:', err))
