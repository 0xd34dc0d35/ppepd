import { readRedirects } from '../../utils/redirects'

export default defineEventHandler(() => {
  const data = readRedirects()
  return Object.entries(data)
    .map(([id, entry]) => ({ id, ...entry }))
    .sort((a, b) => b.created.localeCompare(a.created))
})
