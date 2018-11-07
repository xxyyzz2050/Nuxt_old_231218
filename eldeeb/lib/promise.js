const eldeeb = require('./index.js')
module.exports = class promise extends Promise {
  run(mark, fn) {
    if (typeof mark == 'string') mark = 'promise/' + mark
    else if (mark instanceof Array) mark[0] = 'promise/' + mark[0]
    return eldeeb.run(mark, fn)
  }

  wait(seconds) {
    //delay the excution of fn()
    return this.run('delay', () => {
      return new Promise(resolve => setTimeout(resolve, seconds * 1000))
    })
  }

  when(fn) {
    //wait untin fn finish excuting
  }

  done(fn, stop) {
    next = this.then(fn)
    if (stop) {
      /*stop the chain , from jQuery.Deferred().done()*/
    }
    return next
  }

  fail(fn, stop) {
    /*
       1- .then(null,fn)
       2- catch(e)
       3- if(stop)stop the chain
    */
  }

  limit(seconds, ...fn) {
    //nx: limit(1000).then().then() //or .exec()
    //max time limit for excuting fn()
    return this.run('limit', () => {
      return Promise.race([
        new Promise(
          (resolve, reject) =>
            setTimeout(
              () => reject(new Error('request timeout')),
              seconds * 1000
            ) //nx: custom error
        ),
        ...fn
      ])
    })
  }
}
