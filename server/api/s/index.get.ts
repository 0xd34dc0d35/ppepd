export default defineEventHandler(async (event) => {
  const { public: { apiBase } } = useRuntimeConfig()
  const authHeader = getHeader(event, 'authorization')

  try {
    const res = await $fetch<{ ok: boolean; data: any[]; total: number }>(`${apiBase}/s`, {
      headers: authHeader ? { authorization: authHeader } : {},
    })
    return (res.data ?? []).map(d => ({
      id:      d.id,
      url:     d.url,
      title:   d.title ?? '',
      hits:    d.hits ?? 0,
      created: d.created_at?.split('T')[0] ?? '',
    }))
  } catch (err: any) {
    const status = err?.response?.status ?? err?.status ?? 500
    if (status === 401 || status === 403) throw createError({ statusCode: status, statusMessage: 'Tidak diizinkan' })
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil daftar link' })
  }
})
