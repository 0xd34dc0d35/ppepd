export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Hanya intercept /s/{id} — lewati /s/not-found dan path lain
  const match = path.match(/^\/s\/([^/]+)$/)
  if (!match || match[1] === 'not-found') return

  const id = match[1]
  const { public: { apiBase } } = useRuntimeConfig()

  let exists = false
  try {
    const res = await $fetch<{ ok: boolean; data: any }>(`${apiBase}/s/${id}`)
    exists = res?.ok === true && res?.data?.is_active !== false
  } catch {
    exists = false
  }

  if (!exists) return sendRedirect(event, '/s/not-found', 302)

  // Catat hit secara async (fire-and-forget) agar tidak memblok response
  $fetch(`${apiBase}/s/${id}/hit`, { method: 'POST' }).catch(() => {})
})
