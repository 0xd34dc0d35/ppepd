export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, token, fetchMe } = useAuth()

  if (!isLoggedIn.value && token.value) {
    await fetchMe()
  }

  if (!isLoggedIn.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
