import { normalizeMangroveCatalog } from '../../../app/utils/mangrove-catalog'

export default defineEventHandler(async (event) => {
  const { public: { apiBase } } = useRuntimeConfig(event)
  const source = `${String(apiBase).replace(/\/+$/, '')}/public/geoportal/layers`
  try {
    // Deliberately anonymous: never forward account cookies/tokens to the catalog.
    const response = await $fetch<{ ok: boolean; data: unknown }>(source, { timeout: 12000, retry: 0 })
    if (response.ok !== true) throw new Error('Catalog unavailable')
    const layers = normalizeMangroveCatalog(response.data)
    setHeader(event, 'Cache-Control', 'no-store')
    return { layers, source, fetchedAt: new Date().toISOString() }
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Katalog SI-PPEM belum dapat dimuat. Silakan coba lagi.' })
  }
})
