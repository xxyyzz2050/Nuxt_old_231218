const db = require('./_db.js'),
  fs = require('fs')
var content,coll

db.done(db => {
  fs.readdir('.', (err, files) => {
    for (let i = 0; i < files.length; i++) {
      var file = files[i]
      if (file[0] == '_' || file.substr(-3) != '.js') continue
      content = require(`./${file}`)
      if (content[1]) {
        coll=file.substr(0, -3)
        var { model, schema } = db.model(coll, content[0])      
        db.index(model, content[1]).then(index=>console.log(coll,index),err=>console.error(coll,err))
      }
    }
  })
})

db.done(db => {
  content = require(`./articles.js`)
  var { model, schema } = db.model('articles', content[0])
  //console.log('schema=', schema)
  db.createIndex(model, content[1]).then(x=>console.log("index:",x),err=>console.log('index err',err))
})
