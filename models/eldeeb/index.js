const eldeeb = require('../../eldeeb/'),
  options = require('../../eldeeb.config.js').db

module.exports = eldeeb.db('mongoDB', options)

//usgae  require('index').then(db=>{/*queries goes here*/})
