eldeeb = require('../lib/')
promise = eldeeb.promise()
eldeeb.op.log = false

eldeeb
  .promise([promise.wait(1), promise.wait(2), 1], v => {
    console.log('v1', v)
    return 'OK'
  }) //in;ine .then() dosent work
  .then(v => console.log('v2', v))
