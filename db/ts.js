const eldeeb = require('../eldeeb/'),
  data = new (require('../eldeeb/lib/custom/data'))()

eldeeb.op.log = true
process.env.NODE_ENV = 'development'

let articles = data.cache(
  'articles_index.json',
  () => {
    const mongo = require('./index.js')
    return mongo.connect().done(db => {
      let { model } = db.model(
        'tmp.articles_index',
        require('./schema/tmp.articles_index.js')[0]
      )
      return model.find().limit(5)
      //.then(data => Promise.resolve(data))
      //  .then(data => console.log('data', data))
    })
  },
  3
)

eldeeb.log(articles, 'articles')

/*
//how to return a value from a promise (i.e 'f'= the final result)
var p = new Promise(r => {
  setTimeout(() => r('ok'), 1000)
})
var result = p //.then(x => Promise.resolve(x))
console.log(result)*/
