/* global defineNuxtConfig */

export default defineNuxtConfig({
    // Target: https://go.nuxtjs.dev/config-target
    target: 'static',

    // Global page headers: https://go.nuxtjs.dev/config-head
    app: {
      head: {
        title: 'Peñap Proto',
        htmlAttrs: {
          lang: 'es',
        },
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { hid: 'description', name: 'description', content: '' },
          { name: 'format-detection', content: 'telephone=no' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      },
    },

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: ['@nuxtjs/tailwindcss'],

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},
  })
