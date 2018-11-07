models = require('./models')
db = new models(function(status, db) {
  console.log('status: ', status)
})
//console.log(db)
