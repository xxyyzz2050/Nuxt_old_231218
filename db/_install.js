/*
nx: use insertMany()
nx: call articles_update.js
use import '@babel/polyfill' when a file contains async/await to avoid 'regeneratorRuntime is not defined' when transpile this file with babel (must be @first line)
*/
import '@babel/polyfill'
import update from './articles_update.js'
import dbx from './index.js'
import fs from 'fs'
import convert from './_convert.js'

convert
  .then(() => dbx.connect())
  .then(async db => {
    console.log('========= connected ============')
    //console.log('db:', db)
    let dir = './__db/step4',
      models = [],
      files = fs.readdirSync(dir)

    for (let f = 0; f < files.length; f++) {
      let file = files[f]
      if (file.slice(-5) != '.json') continue
      let coll = file.slice(0, -5),
        data = require(`${dir}/${file}`),
        obj = require(`./schema/${coll}.js`), //contains schema & indexes
        { model } = db.model(coll, obj[0]) //true: add insertObj()
      models[coll] = model //to avoid re compile the model again (mongoose error)
      //test validation
      console.log(`validate coll: ${coll} =========`)
      for (let i = 0; i < data.length; i++) {
        let doc = new model(data[i]),
          invalid = doc.validateSync()
        if (invalid)
          throw {
            //or Promise.reject()
            msg: 'validation error',
            error: invalid,
            doc: doc
          }
        //if any collection has validation error, don't insert any data ar create any index
        else console.log(`validate ${coll}-${i}: ok`)
      }
    }
    console.log('========= validation Done ============')

    //process.exit()
    for (let f = 0; f < files.length; f++) {
      let file = files[f]
      if (file.slice(-5) != '.json') continue
      let coll = file.slice(0, -5),
        data = require(`${dir}/${file}`),
        obj = require(`./schema/${coll}.js`),
        model = models[coll]
      //create indexes
      for (let i = 1; i < obj.length; i++) {
        await db.index(model, obj[i]).then(
          index => console.log(`${coll} index-${i} created`, index),
          err => {
            throw {
              msg: `${coll} index-${i} error:`,
              error: err
            }
          }
        )
      }

      //insert data
      for (let i = 0; i < data.length; i++) {
        await model.create(data[i]).then(
          doc => console.log(`${coll} data-${i}: OK`),
          err => {
            throw {
              msg: `insert: ${coll} data-${i}`,
              error: err
            }
          }
        )
      }
    }

    return { db, models } //must wait untin creating indexes & writing data finished
  })
  .then(({ db, models }) => {
    //create tmp collections
    update(db, models['articles'])
    console.log('========= DONE ============')
  })
  .fail(err => console.log('error:', err))

/*db.done(db => {
  content = require(`./articles.js`)
  var { model, schema } = db.model('articles', content[0])
  //console.log('schema=', schema)
  db.createIndex(model, content[1]).then(
    x => console.log('index:', x),
    err => console.log('index err', err)
  )
})*/
