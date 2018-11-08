var eldeeb = require('../lib/'),
  promise = eldeeb.promise()

/*promise
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
      return 'using return' //not work??
    },
    x => console.log(x),
    err => console.error(err)
  )
  .done(x => console.log(x))
  .catch(e => console.error(e))
*/

promise.all(
  [promise.wait(1).promise, promise.wait(2).promise, true],
  values => console.log('all/then: ', values), //correct
  e => console.log('all/fail: ', e)
)

promise
  .all([promise.wait(1).promise, promise.wait(2).promise, true])
  .done(values => console.log('all/done: ', values)) //nx: values must be array [1,2]
  .fail(e => console.log('all/fail: ', e))

Promise.all([promise.wait(1).promise, promise.wait(2).promise, true]).then(
  values => {
    console.log(values) // correct
  }
)

//nx: wait()=>clearTimeout
