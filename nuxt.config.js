// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
      '@nuxtjs/tailwindcss',
      '@pinia/nuxt'
  ],
  app: {
    head: {
      title: 'HaulHub - Transport Management Game',
      meta: [
        {
          name: 'description',
          content: 'Transport management trucking company simulation game'
        }
      ],
    }
  },
  css: ['~/assets/css/main.css'],
})
