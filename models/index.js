//nx: in production mode convert theese files to .json (no comments)
const eldeeb = require('../eldeeb/'),
  options = require('../eldeeb.config.js').db

module.exports = eldeeb.db('mongoDB', options)
//.fail(err => console.log(err), true) //nx: save errors ->gives error

//usgae  require('index').then(db=>{/*queries goes here*/})
