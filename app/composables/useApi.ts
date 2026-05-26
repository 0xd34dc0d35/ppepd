export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('token')

  const apiFetch = <T>(path: string, options: Parameters<typeof $fetch>[1] = {}) => {
    const headers: Record<string, string> = {}
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }
    return $fetch<T>(`${config.public.apiBase}${path}`, {
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
