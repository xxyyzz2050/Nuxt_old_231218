<template>
  <section class="container">
    <div>data:{{data}}</div>
    <ul>
        <li v-for="(post, index) in data.posts" :key="index">
          <nuxt-link :to="{ name: 'id', params: { id: post.id } }">
            ({{post.id}}) {{ post.title }}
          </nuxt-link>
        </li>
      </ul>

  </section>
</template>

<script>


export default {

    async asyncData(app){
    let data={
       test:"OK",
      ip:await app.$axios.$get('http://icanhazip.com/').then(null,x=>"ip error"),
      wrong:await app.$axios.$get('http://invalid').then(null,x=>'Location not found'),
      userAgent: (app&&app.headers ? app.headers['user-agent'] : (typeof navigator !== 'undefined' ? navigator.userAgent : 'No user agent (generated)')),
      posts:await app.$axios.$get('https://jsonplaceholder.typicode.com/posts').then(x=>x.slice(1,5),err=>[]),



    }

  //  console.log("data:",data)
    return {data:data}
  },
  head(){
  return {
    title: this.data.test,
       meta: [
         {
           hid: "description",
           name: "description",
           content: "About page description"
         }
       ]
  }
  },

}
</script>

<style>


.links {
  padding-top: 15px;
}
</style>
