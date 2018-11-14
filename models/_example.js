db = require('./index.js')
db.done(db => {
  const { model: userModel, schema: userSchema } = db.model(
    'users',
    require('./users.js') //or .json
  )

  userModel.findById('5be92fb487e94116ac606ffe').then(
    data => {
      console.log('find/$id', data)
      console.log('find/$id/toObject', data.toObject())
      console.log(
        'find/$id/toObject->getters:true',
        data.toObject({ getters: true })
      )
    },
    err => console.error('find/$id', err)
  )
})
