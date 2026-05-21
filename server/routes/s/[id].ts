import { readRedirects, writeRedirects } from '../../utils/redirects'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return sendRedirect(event, '/', 302)

  const data = readRedirects()
  const entry = data[id]

  if (!entry) return sendRedirect(event, `/link-tidak-ditemukan?id=${id}`, 302)

  data[id].hits = (entry.hits ?? 0) + 1
  writeRedirects(data)

  return sendRedirect(event, entry.url, 302)
})
