// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare_module",
  },

  modules: ["nitro-cloudflare-dev", "@pinia/nuxt"],

  build: {
    transpile: ['vuetify'],
  },

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: '',
    },
  },
})