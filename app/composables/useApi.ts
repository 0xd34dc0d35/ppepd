export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('token')
  const requestFetch = useRequestFetch()

  const apiFetch = <T>(path: string, options: Parameters<typeof $fetch>[1] = {}) => {
    const headers: Record<string, string> = {}
    const local = config.public.localManagement && (path.startsWith('/auth/') || path === '/app')
    if (!local && token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }
    return requestFetch<T>(local ? `/api/management${path}` : `${config.public.apiBase}${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string> ?? {}),
      },
    })
  }

  return { apiFetch }
}
