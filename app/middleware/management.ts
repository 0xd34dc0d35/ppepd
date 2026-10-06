export default defineNuxtRouteMiddleware(async to => {
  if (!useRuntimeConfig().public.localManagement) throw createError({ statusCode: 404, statusMessage: 'Manajemen lokal tidak diaktifkan' })
  const requestFetch = useRequestFetch()
  const status = await requestFetch<{ initialized: boolean }>('/api/management/status')
  if (!status.initialized && to.path === '/admin/system') return
  const { fetchMe, isLoggedIn, can } = useAuth()
  await fetchMe()
  if (!isLoggedIn.value) return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  if (to.path === '/admin/roles' && !can('roles.manage')) throw createError({ statusCode: 403, statusMessage: 'Anda tidak memiliki akses manajemen role' })
  if (!['users.manage', 'roles.manage', 'audit.view'].some(can)) throw createError({ statusCode: 403, statusMessage: 'Anda tidak memiliki akses manajemen' })
})
