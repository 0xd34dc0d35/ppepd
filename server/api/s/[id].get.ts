import { readRedirects } from '../../utils/redirects'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID diperlukan' })

  const data = readRedirects()
  const entry = data[id]
  if (!entry) throw createError({ statusCode: 404, statusMessage: 'Link tidak ditemukan' })

  return { id, ...entry }
})
