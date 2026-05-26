export interface AuthUser {
  id: string
  uid?: string
  username: string
  email?: string | null
  display_name?: string | null
  roles: string[]
  allowed: string[]
  allowed_menus: string[]
  profile_picture?: string | null
  institution?: string | null
  organisation_name?: string | null
}

export const useAuth = () => {
  const token = useCookie<string | null>('token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/',
  })
  const user = useState<AuthUser | null>('auth:user', () => null)
  const { apiFetch } = useApi()

  const isLoggedIn = computed(() => !!user.value)

  const login = async (username: string, password: string) => {
    const res = await apiFetch<{ ok: boolean; token: string; user: AuthUser }>(
      '/auth/login',
      { method: 'POST', body: { username, password } }
    )
    token.value = res.token
    user.value = res.user
    return res
  }

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' })
    } catch {}
    token.value = null
    user.value = null
  }

  const fetchMe = async () => {
    if (!token.value) return
    try {
      const res = await apiFetch<{ success: boolean; user: AuthUser }>('/auth/me')
      user.value = res.user
    } catch {
      token.value = null
      user.value = null
    }
  }

  return { user, isLoggedIn, token, login, logout, fetchMe }
}
