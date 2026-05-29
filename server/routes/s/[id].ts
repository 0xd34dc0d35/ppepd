export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return sendRedirect(event, '/', 302)

  const { public: { apiBase } } = useRuntimeConfig()

  try {
    const res = await $fetch<{ ok: boolean; data: any }>(`${apiBase}/s/${id}`)
    if (!res?.data?.url) return sendRedirect(event, `/s/not-found`, 302)
    return sendRedirect(event, res.data.url, 302)
  } catch {
    return sendRedirect(event, `/s/not-found`, 302)
  }
})
