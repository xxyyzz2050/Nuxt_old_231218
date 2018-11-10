var eldeeb = require('../lib/'),
  promise = eldeeb.promise()

  eldeeb.op.log=false

promise.wait(1).then(x=>console.log("wait-1: ",x.seconds)).wait(1.5).then(x=>console.log("wait-1: ",x.seconds))


promise
  .then(() => console.log('start...'))
  .wait(2, timeout => console.log('wait(): ', timeout.seconds)) //excuted after .when() ??
  .wait(5, timeout => {
    console.log('clearing timeout..')
    clearTimeout(timeout) //wrong:because it waits until setTimeout finsih
  })

  .when(true, x => console.log('when(true): ', x)) //inline then()
  .then() //empty then ignored
  .when(function(resolve) {
    resolve('OK')
  })
  .race() //useng Native Promise method whitch not overredded
  .then(x => console.log('when(function): ', x)) //separated then
  .done(x => console.log('done: ', x))
  .when(
    function() {
      return 'using return' //not work -> promise must be resolved or rejected
    },
    x => console.log(x),
    err => console.error(err)
  )
  .done(x => console.log(x))
  .catch(e => console.error(e))

/*
//######## promise.all()
//inline .then() & using .promise ->correct
promise.all(
  [
    promise.wait(1).promise,
    promise.wait(2).promise,
    true,
    function() {
      return 123
    },
    456
  ],
  values => console.log('all/inline +.promise: ', values), //correct
  e => console.log('all/fail: ', e)
)

//inline .then() & without .promise ->wrong (passes thame value for each promise, because both are instance of promise)
promise.all(
  [promise.wait(1), promise.wait(2), true],
  values => console.log('all/inline -.promise: ', values), //correct
  e => console.log('all/fail: ', e)
)

//separated then() + .promise -> pass only one promise to done()
promise
  .all([promise.wait(1).promise, promise.wait(2).promise, true])
  .done(values => console.log('all/separated + .promise: ', values)) //nx: values must be array [1,2]
  .fail(e => console.log('all/fail: ', e))
*/
//nx: wait()=>clearTimeout
