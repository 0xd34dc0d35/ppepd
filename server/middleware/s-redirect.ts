import { readRedirects, writeRedirects } from '../utils/redirects'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Only intercept /s/{id} — skip /s/not-found, API calls, and non-/s/ paths
  const match = path.match(/^\/s\/([^/]+)$/)
  if (!match || match[1] === 'not-found') return

  const id = match[1]
  const data = readRedirects()
  const entry = data[id]

  if (!entry) return sendRedirect(event, '/s/not-found', 302)

  // Increment hit counter, then pass through to Vue page for countdown
  data[id].hits = (entry.hits ?? 0) + 1
  writeRedirects(data)
  // Return nothing = pass through to Nuxt SSR → app/pages/s/[id].vue
})
