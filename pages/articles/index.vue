<template>
  <div>
    <div id="data" style="display:block"> {{data}} </div>
    <ul>
        <li v-for="(post, index) in data.articles" :key="index">
          <nuxt-link :to="{path:`/articles/${post.link}`}" > <!--use params with name(not path) to="{name:id,params: { id: post._id } }"-->
          {{ post.title }}
          </nuxt-link>
        </li>
      </ul>


  </div>
</template>
<script>

/*
const vue=require('vue'),vuex=require('vuex') //or req(..).default??
vue.use(vuex)
//console.log(Vuex);
const store = new vuex.Store({
  state:{test:"OK"}
})
*/
import articles from '../../db/articles_index.js'
export default {
  async asyncData (app) {

  return { data: {articles: await articles.catch(err=>console.log("error:",err)) }}
  },
  template:'<div>$template </div>'
}
</script>
