<template>
  <section class="container">
    <div>
      <logo/>
      <h1 class="title">
        almogtama3.com
      </h1>
      <h2 id="test" class="subtitle">
        /user/{{ params.id }}
      </h2>
      <p><b>Context object:<b><br >{{ ctx }}</b></b></p>
      <div>{{ test }}</div>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green">Documentation</a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey">GitHub</a>
      </div>
    </div>
  </section>
</template>



<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data() {
    //runs on client
    return {
      title: 'Almogtama3!',
      test: '==' //document.getElementById("test").innerHTML, -> move to mounted()
    }
  },
  asyncData(context) {
    //runs on server before initiate Vue instance & will be merged to data object
    //if (process.browser) {console.log('The window object:', window)}
    return {
      params: context.params,
      ctx: '$context' //context
    }
  },
  /*fetch ({ store, params }){ //same as asyncData , but will not be merged to data object
   return new promise()
    .then((x)=>{})
},*/
  head() {
    //title & meta
    return {
      title: `User | ${this.title}`
    }
  },
  watchQuery: ['id'], //watch query changes

  //Events
  mounted() {
    //will be excuted after Vue instance created, so it can hold browser vars (i.e window, document)
   }
}</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
