export default defineNuxtPlugin(() => {
  const { public: { apiBase } } = useRuntimeConfig()
  const router = useRouter()

  const SKIP = /^\/(login|register|admin|_nuxt)\b/
  const endpoint = `${apiBase}/analytics/track`

  const send = (path: string) => {
    if (SKIP.test(path)) return
    const payload = JSON.stringify({
      path,
      referrer: document.referrer || undefined,
    })
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([payload], { type: 'application/json' }))
    } else {
      fetch(endpoint, { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
    }
  }

  router.afterEach((to) => {
    send(to.fullPath)
  })
})
