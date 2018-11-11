const insert = false

var eldeeb = require('../lib/index.js')
//to see logs put options.debug=true (don't use eldeeb.op.log=true)
var options = require('./options').db,
  wrongOptions = {
    uri: 'mongodb://wrong-uri'
  }

eldeeb.db(
  'mongoDB',
  options,
  db => {
    db.on('all', ev => console.log('event2:', ev)) //db is connected & open, it will trigger only on other events, to listen to ALL events use events parameter

    var { model: userModel, schema: userSchema } = db.model(
      'users',
      '../../models'
    )

    /*
    console.log('model:', userModel)
    console.log('schema:', userSchema)
    */
    userModel
      .findOne()
      .then(
        data => console.log('data:', data),
        err => console.error('error:', err)
      )
  },
  err => console.log('err: ', err),
  ev => console.log('event:', ev)
)
