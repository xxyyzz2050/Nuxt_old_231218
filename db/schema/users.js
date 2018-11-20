module.exports = [
  {
    person: { type: 'ObjectId', ref: 'persons' },
    roles: [{ type: 'ObjectId', ref: 'roles' }], //permissions roles
    ref: { type: 'ObjectId', ref: 'persons' },
    url: 'string', //url whitch made the user to regester
    credit: 'number', //in dollar
    username: 'string' //or{_id,ref:usernames} to ensure unique usernames throw all objects (groups,categories,...)
  }
]
