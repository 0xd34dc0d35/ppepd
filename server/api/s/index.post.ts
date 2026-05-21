import { readRedirects, writeRedirects, generateId } from '../../utils/redirects'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url, title = '', customId } = body ?? {}

  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'URL wajib diisi' })
  }

  const data = readRedirects()

  if (customId) {
    if (!/^[a-z0-9-_]{2,32}$/.test(customId)) {
      throw createError({ statusCode: 400, statusMessage: 'ID kustom hanya boleh huruf kecil, angka, tanda hubung, dan garis bawah (2–32 karakter)' })
    }
    if (data[customId]) {
      throw createError({ statusCode: 409, statusMessage: 'ID sudah digunakan' })
    }
  }

  let id = customId || generateId()
  while (!customId && data[id]) id = generateId()

  data[id] = {
    url,
    title: title.trim(),
    created: new Date().toISOString().split('T')[0],
    hits: 0,
  }

  writeRedirects(data)

  return { id, url, title, shortPath: `/s/${id}` }
})
