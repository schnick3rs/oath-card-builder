import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    title: 'Oath Card Builder',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'robots', name: 'robots', content: 'index,follow' },
      { hid: 'theme-color', name: 'theme-color', content: '#f69943' },
      { hid: 'description', name: 'description', content: 'Design and print your own Denizen, Relics, Sites and Edifices for Oath from Leder Games.' },
      // OpenGraph
      { hid: 'og:title', name: 'og:title', content: 'Design and print your own Denizen, Relics, Sites and Edifices for Oath from Leder Games.' },
      { hid: 'og:image', name: 'og:image', content: 'https://oath-card-builder.herokuapp.com/img/seo/index.png' },
      { hid: 'og:description', name: 'og:description', content: 'Design and print your own Denizen, Relics, Sites and Edifices for Oath from Leder Games.' },
      // Twitter
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:title', name: 'twitter:title', content: '' },
      { hid: 'twitter:description', name: 'twitter:description', content: 'Design and print your own Denizen, Relics, Sites and Edifices for Oath from Leder Games.' },
      { hid: 'twitter:image', name: 'twitter:image', content: 'https://oath-card-builder.herokuapp.com/img/seo/index.png' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/print.scss',
  ],

  publicRuntimeConfig: {
    gtag: process.env.gtag || true
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vuex-persist', ssr: false },
    '~/plugins/oath-symbol-component.js',
    '~/plugins/gtag.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/google-analytics',
  ],

  googleAnalytics: {
    id: 'UA-204035528-1',
  },


  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      //dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    /*
    ** You can extend webpack config here
    */
        extend(config, ctx) {
          // Include the compiler version of Vue so that wp-content works
          config.resolve.alias["vue$"] = "vue/dist/vue.esm.js"
        }
  },

  serverMiddleware: [
    '~/api/express', // handles /api/** calls
  ],
}
