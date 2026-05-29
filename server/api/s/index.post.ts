export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url, title = '', customId } = body ?? {}

  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'URL wajib diisi' })
  }

  const { public: { apiBase } } = useRuntimeConfig()
  const authHeader = getHeader(event, 'authorization')

  try {
    const res = await $fetch<{ ok: boolean; data: any }>(`${apiBase}/s`, {
      method: 'POST',
      headers: authHeader ? { authorization: authHeader } : {},
      body: { url: url.trim(), title: title?.trim() || undefined, customId: customId || undefined },
    })
    const d = res.data
    return {
      id:        d.id,
      url:       d.url,
      title:     d.title ?? '',
      shortPath: d.shortPath ?? `/s/${d.id}`,
    }
  } catch (err: any) {
    const status = err?.response?.status ?? err?.status ?? 500
    const message = err?.data?.message ?? err?.message ?? 'Gagal membuat link'
    if (status === 400) throw createError({ statusCode: 400, statusMessage: message })
    if (status === 401 || status === 403) throw createError({ statusCode: status, statusMessage: 'Tidak diizinkan' })
    if (status === 409) throw createError({ statusCode: 409, statusMessage: message })
    throw createError({ statusCode: 500, statusMessage: 'Gagal membuat link' })
  }
})
