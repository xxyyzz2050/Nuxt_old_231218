const eldeeb = require('./index.js')
eldeeb.mark = 'promise'
/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

promise.finally() is 'Draft' https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally

 promise.when("any value,will be immediatly resolved",x=>"inline then",err=>{})
         .then(x=>"separated then",err=>{})
         .done(x=>"=then(done,null)")
         .fail(err=>"=then(null,fail,stop=true)")
         .catch(err=>"=then(null,fail,stop=false), if 'stop=true' this will not run")
         .when(new promise(),x=>"another instance")
         .when(new Promise(function(){}),"x"=>"unresolved promise can be settled using .resolve() & .reject()")
         .resolve(x=>"resolved")
         .wait(5,x=>"wait 5 seconds")
         .all([p1,p2,p3],(r1,r2,r3)=>"wait untill all tasks finished",(err`,err2,err3)=>{})
         .stop()
         .done(x=>"will not run")
         .done(x=>"this also stop() and exit the chain",true)
         .fail(err=>"only works if the previous promise rejected",false)
         .done(x=>"the previous fail() will catche the exception and pass a new resolved promise, let's try another resource")
         .fail(err=>"in case of failure don't continue, so we will stop",true)

         Don't use custom methode by this class after Native Promise methods until it have been overridden, because they return promise (not "this")
*/

module.exports = class promise extends Promise {
  constructor(fn, done, failed, stop) {
    super(r => {
      r()
    })
    return this.when(fn, done, failed, stop)
  }
  when(fn, done, failed, stop) {
    //console.log("fn: ",typeof fn,fn)
    //wait until fn finish excuting, fn() has to settle (resolve or reject) the promise
    return eldeeb.run('when', () => {
      if (typeof fn == 'function') {
        //nx: check if returns a thenable object
        this.promise = new Promise((resolve, reject) => {
          //  try {resolve(fn(resolve, reject))} catch (e) {reject(e)} //wrong: this causes resolving the promise immediatly, called to resolve or reject it
          fn(resolve, reject)
        })
      } else if (eldeeb.objectType(fn) == 'promise') {
        this.promise = fn
      } else if (
        eldeeb.objectType(fn) == 'object' &&
        fn.then &&
        typeof obj.then == 'function'
      ) {
        //thenable object
      } else if (fn instanceof this.constructor) {
        /*Don't use instanceof this https://stackoverflow.com/a/53204052/9474643*/
        this.promise = fn.promise
      } else {
        //immediatly resolve it
        this.promise = new Promise(resolve => resolve(fn))
      }

      if (done || failed) return this.then(done, failed, stop)
      return this //don't return promise to enable chaining for other (non-promise) functions such as done() and to customise then
    })
  }

  wait(seconds, done, failed, stop) {
    //pause the script & pass a timeout object to the next .then() (contains: seconds) https://nodejs.org/api/timers.html#timers_class_timeout
    //to canxel it: clearTimeout(timeout)
    if (typeof seconds == 'function') seconds = seconds()
    else if (typeof seconds != 'number') seconds = 0
    //nx: check if seconds is a number
    return this.when(
      /*resolve=>{
        let timeout =setTimeout(resolve, seconds * 1000)
        timeout.seconds = seconds
        return timeout //wrong, this will return before setTimeout finish


        resolve=>setTimeout(resolve,seconds*1000,seconds) //it works, but how to pass timeout instead of seconds
        resolved=>{var timeout=setTimeout(...,timeout)} also failed
      }*/

      resolve => {
        let timeout = setTimeout(function() {
          timeout.seconds = seconds //=(timeout._idleTimeout)/1000
          resolve(timeout) //returns "timeout" will immediatley call the next .then(), and resolve(timeout) will orevent the next .then() from using it untill it finished
        }, seconds * 1000)
      }, //nx: pass timeout insteadof seconds or [{timeout object},seconds] to control the timeout (ex: clearTimeout), note that Promise.resolve() occepts only one parameter ,so the second parameter (4th argument) of setTimeout() will be ignored
      done,
      failed,
      stop
      //nx: this function immediatly returns seconds then wait until setTimeout finished
      //or: ()=>{setTimeout(fn(){}) return seconds}
      //or: return timeout id to control it (clearTimeOut(id))
    )

    /*
   //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    return eldeeb.run('delay', false, () => {
      //don't return a promise, return a function, because when() accepts a function
      return new Promise(resolve => setTimeout(resolve, seconds * 1000))
    })*/
  }

  then(done, fail, stop) {
    //console.log('this.promise: ', this.promise)
    //nx: if(stop)exit the chain i.e don't run the next functions then(),done(),fail()
    // promise.then()  return this ;use the original promise don't create a new one and don't pass the promise to then()

    //nx: if the promise not settled call this.resolve()
    //nx: check if this.promise is array,(returned from this.all()), in this case it must pass array of values
    this.promise.then(done, fail)
    if (stop) return this.stop()
    return this
  }

  done(fn, stop) {
    return this.then(fn, null, stop)
  }

  fail(fn, stop) {
    /*
       1- .then(null,fn)
       2- catch(e)
       3- if(stop)stop the chain
    */
    return this.then(null, fn, typeof stop === 'undefined' ? true : stop)
  }

  /*catch(fn, stop) {
    //catche the current exception then pass a new resolved Promise
    //same as fail() but the default value of stop is false, so it will only catch the error and continue the chain without existing the chain
    return this.then(null, fn, stop)
  }*/

  stop() {
    //exit the current chain, i.e don't pass the promise to the next functions
    return this
  }

  complete() {
    //=finally() but default value of stop=true
  }

  limit(seconds, ...fn) {
    //nx: test this function by loading a big resource via ajax or reading a big file
    //nx: limit(1000).then().then() //or .exec()
    //max time limit for excuting fn()
    return eldeeb.run('limit', () => {
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

  finally(fn, done, fail) {
    //temporary until finally oficially released, now promise.finally still in 'Draft' https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally
    return this.then(fn, fn).then(done, fail)
  }

  //###### static methods: race,all,reject,resolve; use Promice.race() not this.promise.race
  race(promises, done, fail) {
    promises = this.promises(promises)
    if (promises) {
      Promise.race(promises).then(done, fail)
      this.promise = promises
    }
    return this
  }

  all(promises, done, fail) {
    if (promises) {
      Promise.all(promises).then(done, fail)
      this.promise = promises //to pass the correct promises to the next then() in the chain
    } //done() accept array of arguments, one for each promise
    return this
    /*
    nx:
      - if (this) passed, convert it to a promise ex: this.wait(1).promise ->super() must holde the current promise
      - allow separated .then() with all ex: .all([promises],done,fail) working, but .all([promises]).done(value) only pass one value (not array)
    */
  }
  promises(promises) {
    if (!eldeeb.isArray(promises)) return //nx: or any iterable ->see eldeeb.isArray()
    /*for (let i = 0; i < promises.length; i++) {
      if (promises[i] instanceof this.constructor) promises[i] = this.promise // promises[i].promise
      //wrong: this passes a different promise, use it just after creating/modifing the promise ex: promises=[p.wait(1).promise,p.wait(2).promise]
    }*/
    promises = this.promises(promises)
    return promises
  }

  resolve(value, seconds) {
    if (seconds) return this.wait(seconds).resolve(value)
    Promise.resolve(value)
    return this
  }

  reject(error, seconds) {
    if (seconds) return this.wait(seconds).reject(error)
    Promise.reject(value)
    return this
  }
}
//############3 /Static methods
