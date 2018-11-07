var promise = require('../lib/index.js').promise()

console.log('pending')

promise.wait(5).then(() => console.log('ok'))
