import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Nuxt',
    title: 'Supernuxt',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/styles/main'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/components.js',
    '@/plugins/vuelidate.js',
    { src: '@/plugins/notification.js', mode: 'client' },
    '@/plugins/firebase.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // '@nuxtjs/firebase'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],
  // firebase: {
  //   config: {
  //     apiKey: "AIzaSyCmhjoOzSjBAlrEwwaxrKo3ThZyH457cfM",
  //     authDomain: "nuxt-app-a951d.firebaseapp.com",
  //     databaseURL: "https://nuxt-app-a951d-default-rtdb.firebaseio.com",
  //     projectId: "nuxt-app-a951d",
  //     storageBucket: "nuxt-app-a951d.appspot.com",
  //     messagingSenderId: "930454941618",
  //     appId: "1:930454941618:web:ffc7f25085f87808fffeab"
  //   },
  //   services: {
  //     auth: true,
  //     firestore: true
  //   }
  // },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/styles/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        // light: {
        //   background: '#FFFFFF',
        //   surface: '#FFFFFF',
        //   primary: '#6200EE',
        //   'primary-darken-1': '#3700B3',
        //   secondary: '#03DAC6',
        //   'secondary-darken-1': '#018786',
        //   error: '#B00020',
        //   info: '#2196F3',
        //   success: '#4CAF50',
        //   warning: '#FB8C00',
        // }
      }
    }
  },

  loading: {
    color: '#1976d2 '
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['ky']
  }
}
