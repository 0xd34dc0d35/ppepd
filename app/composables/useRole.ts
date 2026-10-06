/**
 * useRole — navigasi berbasis role
 *
 * Sumber tunggal untuk semua item topbar. Kedua layout (default & data)
 * mengambil visibleNav dari sini — jangan hardcode link di template layout.
 *
 * Dokumentasi lengkap: design/ROUTES.md
 * Spesifikasi role & auth: docs/NAVIGATION.md
 */

export type UserRole = 'publik' | 'pengelola' | 'admin'

export interface NavItem {
  label: string
  to: string
  roles: UserRole[]
}

export const NAV_ITEMS: NavItem[] = [
  // ── Publik (semua role) ──────────────────────────────────────────────────
  { label: 'Beranda',         to: '/',                roles: ['publik', 'pengelola', 'admin'] },
  { label: 'Data',            to: '/data',            roles: ['publik', 'pengelola', 'admin'] },
  { label: 'Publikasi',       to: '/publikasi',       roles: ['publik', 'pengelola', 'admin'] },
  { label: 'Regulasi',        to: '/regulasi',        roles: ['publik', 'pengelola', 'admin'] },
  { label: 'Layanan',         to: '/layanan',         roles: ['publik', 'pengelola', 'admin'] },
  { label: 'Tentang',         to: '/about',           roles: ['publik', 'pengelola', 'admin'] },
  { label: 'Zona Integritas', to: '/zona-integritas', roles: ['publik', 'pengelola', 'admin'] },
  { label: 'Hubungi',         to: '/hubungi',         roles: ['publik', 'pengelola', 'admin'] },

  // ── Pengelola — shortcut portal ekosistem & alat internal ───────────────
  // Portal tetap publik; dashboard memakai guard izin dalam mode lokal.
  { label: 'Danau',           to: '/danau',           roles: ['pengelola', 'admin'] },
  { label: 'Mangrove',        to: '/mangrove',        roles: ['pengelola', 'admin'] },
  { label: 'Mata Air',        to: '/mataair',         roles: ['pengelola', 'admin'] },

  // ── Admin — panel administrasi sistem ───────────────────────────────────
  { label: 'Manajemen',       to: '/admin/system',    roles: ['admin'] },
]

export function useRole() {
  const config = useRuntimeConfig()
  const user = useState<AuthUser | null>('auth:user', () => null)
  const role = computed<UserRole>(() => user.value?.roles?.includes('admin') ? 'admin' : user.value?.roles?.includes('pengelola') ? 'pengelola' : 'publik')

  const visibleNav = computed(() =>
    NAV_ITEMS.filter(item => item.roles.includes(role.value) &&
      (!['/danau', '/mangrove', '/mataair'].includes(item.to) || user.value?.allowed?.includes('dashboard.view') || !config.public.localManagement))
      .map(item => item.to === '/admin/system' && !config.public.localManagement ? { ...item, label: 'Admin', to: '/admin/share' } : item)
  )

  return { role, visibleNav }
}
