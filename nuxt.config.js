import colors from 'vuetify/es5/util/colors';

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - EmployeeManagement',
    title: 'EmployeeManagement',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "~/plugins/vue-moment.js",
    { src: '~/plugins/localStorage.js' }
  ],

  pwa: {
    workbox: {
      importScripts: ['/firebase-auth-sw.js'],
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      dev: process.env.NODE_ENV === 'development'
    }
  },

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: process.env.NUXT_ENV_API_KEY,
          authDomain: process.env.NUXT_ENV_AUTH_DOMAIN,
          databaseURL: process.env.NUXT_ENV_DATABASE_URL,
          projectId: process.env.NUXT_ENV_PROJECT_ID,
          storageBucket: process.env.NUXT_ENV_STORAGE_BUCKET,
          messagingSenderId: process.env.NUXT_ENV_MESSAGE_SENDER_ID,
          appId: process.env.NUXT_ENV_APP_ID,
          measurementId: process.env.NUXT_ENV_MEASUREMENT_ID
        },
        services: {
          auth: true, // Just as example. Can be any other service.
          firestore: true
        }
      }
    ]
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    // baseURL: process.env.BASE_URL
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
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
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },
  
  // dotenv
  env: {
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    ATTENDANCE_URL: process.env.ATTENDANCE_URL,
    ATTENDANCE_URL_CONFIRM: process.env.ATTENDANCE_URL_CONFIRM,
    ATTENDANCE_URL_REJECT: process.env.ATTENDANCE_URL_REJECT
  }
}
