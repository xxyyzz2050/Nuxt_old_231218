/*
nx: use insertMany()
*/

const convert = require('./_convert.js'),
  dbx = require('./index.js'),
  fs = require('fs')
convert
  .done(() => {
    dbx
      .connect()
      .done(db => {
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
            db.index(model, obj[i]).then(
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
            model.create(data[i]).then(
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

        console.log('========= DONE ============')
      })
      .fail(err => console.log('error#1:', err))
  })

  .fail(err => console.log('error#2:', err))

/*db.done(db => {
  content = require(`./articles.js`)
  var { model, schema } = db.model('articles', content[0])
  //console.log('schema=', schema)
  db.createIndex(model, content[1]).then(
    x => console.log('index:', x),
    err => console.log('index err', err)
  )
})*/
