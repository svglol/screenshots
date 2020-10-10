import glob from 'glob'

const generatedRoutes = () => {
  const files = glob.sync('./assets/images/**/')
  const routes = []
  files.forEach((item, i) => {
    let route = item.replace('./assets/images', '')
    route = route.replace(/ /g, '_')
    routes.push(route)
  })
  return routes
}

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',
  router: {
    base: '/screenshots/'
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Matt Trotman - iRacing Gallery',
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
  css: ['~/assets/css/main.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/fontawesome',
    '@nuxtjs/google-fonts'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    'nuxt-fontawesome',
    'bootstrap-vue/nuxt',
    'vue-scrollto/nuxt'
  ],

  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false // Or `bvCSS: false`
  },

  googleFonts: {
    families: {
      Oswald: true
    },
    display: 'swap'
  },

  fontawesome: {
    icons: {
      solid: true,
      brands: true
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },

  generate: {
    fallback: true,
    routes: generatedRoutes
  }
}
