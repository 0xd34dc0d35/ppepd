// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css', 'maplibre-gl/dist/maplibre-gl.css'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  devtools: { enabled: false },
  compatibilityDate: '2024-04-03',
})