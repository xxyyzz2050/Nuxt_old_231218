//https://nuxtjs.org/api/configuration-build/
const pkg = require('./package')

module.exports = {
  mode: 'universal',
  debug: true,

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    titleTemplate: `%s - ${pkg.name}`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: 'red' },

  /*
  ** Global CSS
  */

  css: [],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    //extractCSS: true,
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // return;//temporary disable list
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }

      let vueLoader = config.module.rules.find(
        rule => rule.loader == 'vue-loader'
      )
      //or use {build: veu:{transformAssetUrls:{..}} }
      if (vueLoader)
        //transform attributes (ex:src) into require(..)
        vueLoader.options.transformAssetUrls = {
          //https://vue-loader.vuejs.org/options.html#transformasseturls (transformToRequire renamed to transformAssetUrls: https://vue-loader.vuejs.org/migrating.html#options-deprecation)
          img: ['src', 'data-src'],
          image: 'xlink:href',
          link: 'href', // this will resolve to <link href="[object Object]" />;
          video: ['src', 'poster'],
          source: 'src',
          object: 'src',
          embed: 'src',
          'b-img': 'src',
          'b-img-lazy': ['src', 'blank-src'],
          'b-card': 'img-src',
          'b-card-img': 'img-src',
          'b-carousel-slide': 'img-src',
          'b-embed': 'src'
        }

      //nx: *:src, *:href
      config.node = {
        fs: 'empty' //to solve: "import fs from 'fs'" when import or require 'fs' in any .vue file https://github.com/nuxt-community/dotenv-module/issues/11#issuecomment-376780588
      }
    }

    //  extractCSS: { allChunks: true } //https://github.com/nuxt/nuxt.js/issues/1533#issuecomment-419369363; replaced with: optimization.splitChunks https://webpack.js.org/configuration/optimization/#optimization-splitchunks
  }
}
