
<template>
  <div class="container">
    <h1>{{ data.post.title }}</h1>
    <pre>{{ data.post.body }}</pre>
    <p>
      <nuxt-link to="/">
        Back to the list
      </nuxt-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios'

export default {

  async asyncData(app){
    let data={
       post: await app.$axios.$get(`https://jsonplaceholder.typicode.com/posts/${app.params.id}`)
    }
    return {data:data}
  },
  head() {
    return {
     title: this.data.post.title
    }
  }
}
</script>

<style scoped>
.container {
  width: 70%;
  margin: auto;
  text-align: center;
  padding-top: 100px;
}
ul {
  list-style-type: none;
  padding: 0;
}
ul li {
  border: 1px #ddd solid;
  padding: 20px;
  text-align: left;
}
ul li a {
  color: gray;
}
p {
  font-size: 20px;
}
a {
  color: #41B883;
}
</style>
