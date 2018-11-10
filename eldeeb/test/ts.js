eldeeb = require('../lib/')
promise = eldeeb.promise()
eldeeb.op.log = true

/*promise.then(1).then(x => {
  console.log('x: ', x) //wrong:
})*/

/*done = () => 2
p = new Promise(r => r(1))
p.then(done).then(x => console.log(':', x))
*/

//promise.then(x => 1).then(x => console.log('x:', x))

promise.then(1).then(x => console.log('x:', x))
