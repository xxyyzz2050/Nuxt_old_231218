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
  .then(() => dbx.connect({ autoIndex: false }))
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
        { model } = db.model(
          coll,
          obj[0],
          { validateBeforeSave: false },
          obj.slice(1)
        ) //true: add insertObj();     db.set('validateBeforeSave', false) //all data will be validated before sending it to the server
      models[coll] = model //to avoid re compile the model again (mongoose error)
      /*
      for (let i = 1; i < obj.length; i++)
        if (!obj[i] instanceof Array) model.index(obj[i]) //nx: schema.index()
        else model.index(obj[i][0], obj[i][1]) //[{fields},{options}]
        */
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

    for (let coll in models) {
      //or for(files); all models created from files already exists in step4, so we don't have to check if if exists
      //create indexes then insert data
      let model = models[coll]
      await model
        .createIndexes()
        .then(async idx => {
          console.log(`${coll}: indexs created`, idx) //nx: is createIndexes() resolve [indexes]?
          let data = require(`${dir}/${coll}.json`)
          if (!data) return
          await model
            .insertMany(data, { ordered: false })
            .then(data => console.log(`${coll}: data inserted`, data))
            .catch(e => console.error(`insertion error: ${coll}`, err))
        })
        .catch(err => console.error(`error: ${coll}`, err))
    }

    update(db, models['articles']) //must wait untin creating indexes & writing data finished
  })

  .catch(err => console.log('error:', err))

/*db.done(db => {
  content = require(`./articles.js`)
  var { model, schema } = db.model('articles', content[0])
  //console.log('schema=', schema)
  db.createIndex(model, content[1]).then(
    x => console.log('index:', x),
    err => console.log('index err', err)
  )
})*/
