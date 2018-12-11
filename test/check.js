console.log('check.js run') //not called when I run it via NUXT
export default {
  //also using export default gives the same problem
  isArray: function(object) {
    //the code is simplified to be clear
    //return typeof object[Symbol.iterator] == 'function' //exits the code
    return typeof object['Symbol.iterator'] == 'function' //dosen't exit the code, but sure gives a wrong result
  }
}
