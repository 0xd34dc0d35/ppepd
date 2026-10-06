export default defineNuxtRouteMiddleware(async to => {
  if (!useRuntimeConfig().public.localManagement) return
  const { fetchMe, isLoggedIn, can } = useAuth()
  await fetchMe()
  if (!isLoggedIn.value) return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  if (!can('dashboard.view')) throw createError({ statusCode: 403, statusMessage: 'Anda tidak memiliki akses dashboard' })
})
