export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID diperlukan' })

  const { public: { apiBase } } = useRuntimeConfig()

  try {
    const res = await $fetch<{ ok: boolean; data: any }>(`${apiBase}/s/${id}`)
    const d = res.data
    return {
      id:      d.id,
      url:     d.url,
      title:   d.title ?? '',
      hits:    d.hits ?? 0,
      created: d.created_at?.split('T')[0] ?? '',
    }
  } catch (err: any) {
    const status = err?.response?.status ?? err?.status ?? 500
    if (status === 404) throw createError({ statusCode: 404, statusMessage: 'Link tidak ditemukan' })
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil data link' })
  }
})
