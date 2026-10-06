export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, fetchMe } = useAuth()
  await fetchMe()

  if (!isLoggedIn.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
  if (useRuntimeConfig().public.localManagement && to.path === '/my-profiles' && !useAuth().can('profile.view')) {
    throw createError({ statusCode: 403, statusMessage: 'Anda tidak memiliki akses profil' })
  }
})
