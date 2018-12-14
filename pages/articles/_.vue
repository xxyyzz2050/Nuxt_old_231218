<template>
<div>
 <article class="post">
    <div class="post-header">
     <div class="tools"></div>
     <div class="user"></div>
    </div>
    <div class="post-body">
      <h1 class="post-title" dir="auto"><nuxt-link to="">{{data.article.title}}</nuxt-link></h1>
      <h3 class="post-subtitle" dir="auto" v-if="data.article.subtitle">{{data.article.subtitle}}</h3>
      <img class="post-img" v-if="data.article.img" /> <!-- nx: lazy load -->
      <div class="post-content">
        {{data.article.content}}
        <div class="post-more" v-if="data.article.more">see more..</div>
      </div>
    </div>

  </article>
  <nuxt-link :to="{path:`/articles/`}">Home</nuxt-link>
</div>
</template>

<script>
//import article from '../../db/article.js'

//import fs from 'fs'
import eldeeb from '../../eldeeb/'
import article from '../../db/article.js'

export default {
 async asyncData(app){
   let shortId=app.req.originalUrl.match(/\/articles\/(?:.*\/)?([^\/]+)/)
   eldeeb.log(shortId,"shortId");
   if(shortId) shortId=shortId[1]



    return {data:{
      test:"ok",
    article:await article(shortId).catch(err=>{eldeeb.log(err,"error"); app.error({ statusCode: 404, message: 'The article not found' })})//nx: catch error

    }}
  },
  head(){
  return {
  //title: this.data&&this.data.article&&this.data.article.title?this.data.article.title:"",

  }
  },

  //watchQuery:true

}
</script>

<style>

</style>
