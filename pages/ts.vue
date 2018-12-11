<template>
  <div>

    <div id="_data">data(): {{data}}</div>

  </div>
</template>

<script>
//import test from '../test/test.js'
const test=require('../test/test.js')
export default  {
  async asyncData (app) {
    return { asyncData: {test:"ok2"} }
  },
  data(){
    //var test=require('../test/test.js')
    //var test=require('../test/test.js').default
    //const test="=test="


    console.log("test:",test);
    return { data: test }
  },
  mounted() {
    console.log("$el:",this.$el.innerHTML ) // I'm text inside the component.
  },
  template:'<div>$template </div>'
}
</script>
