models = require('./models')
/*db = new models().then(status => {
  console.log('promise status: ', status)
})*/

db = new models(function(status, db) {
  console.log('status: ', status)

  if (status == 'open') {
    //require('fs').writeFile('./__log.txt', this, function() {}) //global??
    require('fs').writeFile(
      './__log.txt',
      models + '\r\n' + models.model,
      function() {}
    ) //undefined??
    //  person = this.model('person')
    //console.log('model: ', person)
  }
})
//console.log(db)
