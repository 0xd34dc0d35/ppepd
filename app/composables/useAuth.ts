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
  const local = useRuntimeConfig().public.localManagement
  const token = useCookie<string | null>('token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/',
  })
  const user = useState<AuthUser | null>('auth:user', () => null)
  const { apiFetch } = useApi()

  const isLoggedIn = computed(() => !!user.value)
  const initialized = useState('auth:initialized', () => false)
  const can = (permission: string) => user.value?.allowed?.includes(permission) ?? false

  const login = async (username: string, password: string) => {
    const res = await apiFetch<{ ok: boolean; token: string; user: AuthUser }>(
      '/auth/login',
      { method: 'POST', body: { username, password } }
    )
    if (!local) token.value = res.token
    user.value = res.user
    initialized.value = true
    return res
  }

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST', body: {} })
    } catch (err) {
      // Local cookies are HttpOnly: retain the account state if revocation fails.
      if (local) throw err
    }
    token.value = null
    user.value = null
    initialized.value = true
  }

  const fetchMe = async () => {
    if (!local && !token.value) { user.value = null; initialized.value = true; return }
    try {
      const res = await apiFetch<{ success: boolean; user: AuthUser }>('/auth/me')
      user.value = res.user
      initialized.value = true
    } catch (err: any) {
      if ([401, 403].includes(err?.statusCode ?? err?.status ?? err?.response?.status)) {
        token.value = null
        user.value = null
        initialized.value = true
      } else throw err
    }
  }

  return { user, isLoggedIn, token, login, logout, fetchMe, initialized, can }
}
