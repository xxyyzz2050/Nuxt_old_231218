module.exports = [
  {
    person: { type: 'ObjectId', ref: 'persons' },
    rules: [{ type: 'ObjectId', ref: 'rules' }], //permissions rules
    ref: { type: 'ObjectId', ref: 'persons' },
    url: 'string', //url whitch made the user to regester
    credit: 'number', //in dollar
    username: 'string' //or{_id,usernames} to ensure unique usernames throw all objects (groups,categories,...)
  }
]
