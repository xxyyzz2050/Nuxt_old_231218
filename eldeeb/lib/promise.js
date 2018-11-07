const eldeeb = require('./index.js')
module.exports = class promise {
  run(mark, fn) {
    if (typeof mark == 'string') mark = 'promise/' + mark
    else if (mark instanceof Array) mark[0] = 'promise/' + mark[0]
    return eldeeb.run(mark, fn)
  }

  limit(fn, seconds, ...args) {
    //max time limit for excuting fn()
    this.run('limit', ()=>{
      return Promise.race([
        fn(...args),
        new Promise(
          (resolve, reject) =>
            setTimeout(
              () => reject(new Error('request timeout')),
              seconds * 1000
            ) //nx: custom error
        )
      ])
    })
  }

  delay(fn, seconds, ...args) {
    //delay the excution of fn()
    this.run('delay',()=>{
      return seconds => {
        if (typeof fn == 'function')
          new Promise(resolve => setTimeout(fn(...args), seconds * 1000))
        else if (typeof fn == 'string')
          new Promise(resolve => setTimeout(fn, seconds * 1000))
      }
    }
    })

}
