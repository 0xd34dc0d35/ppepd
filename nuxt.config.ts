// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: { host: '127.0.0.1', port: 3003 },
  ...(process.env.PPEPD_TEST_BUILD_DIR ? { buildDir: process.env.PPEPD_TEST_BUILD_DIR } : {}),
  runtimeConfig: {
    managementDataDir: '.data/management',
    managementStorage: 'file',
    managementDatabaseUrl: '',
    managementSchema: 'ppepd_management',
    managementTablePrefix: '',
    public: {
      localManagement: process.env.NODE_ENV !== 'production',
      siteUrl: 'https://ppepd.kemenlh.go.id',
      apiBase: 'https://ppepd.kemenlh.go.id/proxies/api/api'
    }
  },
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css', 'maplibre-gl/dist/maplibre-gl.css'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  devtools: { enabled: false },
  compatibilityDate: '2024-04-03',
})
