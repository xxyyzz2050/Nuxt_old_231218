eldeeb = require('../lib/')
promise = eldeeb.promise()
eldeeb.op.log = false

p = eldeeb.promise([promise.wait(1), promise.wait(2)])
p.then(values => console.log('values: ', values))
