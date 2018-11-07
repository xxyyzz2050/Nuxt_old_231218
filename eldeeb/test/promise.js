var promise = require('../lib/').promise()

console.log('pending')

promise.delay(function() {
  console.log('ok')
}, 1)
