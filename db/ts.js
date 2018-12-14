import '@babel/polyfill'
import dbx from './index.js'

console.clear()
console.log(Math.floor(Math.random() * 1000))
new Promise(r => r())
  .then(() => dbx.connect({ autoIndex: false }))
  .then(db => {
    console.log('== connected ==')
    let dir = './__db/step4',
      coll = 'xx',
      obj = require(`./schema/${coll}.js`)
    let { model, schema } = db.model(
      coll,
      obj[0],
      { validateBeforeSave: false },
      obj.slice(1)
    )

    console.log('schema:', schema)
    console.log('obj.slice(1):', obj.slice(1))
    model.createIndexes().then(idx => {
      console.log(`${coll}: indexs created`, idx) //nx: is createIndexes() resolve [indexes]?
      let data = `${dir}/${coll}.json`
      if (!fs.existsSync(data)) return
      data = require(data)
      if (!data) throw new Error('no data')
      model
        .insertMany(data, { ordered: false })
        .then(x => console.log('Done:', x))
        .catch(err => console.error('err:', err))
    })
  })
  .then(x => console.log('Done2:', x))
  .catch(err => console.error('err2:', err))
