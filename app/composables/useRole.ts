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
  { label: 'Regulasi',        to: '/regulasi',        roles: ['publik', 'pengelola', 'admin'] },
  { label: 'Layanan',         to: '/layanan',         roles: ['publik', 'pengelola', 'admin'] },
  { label: 'Tentang',         to: '/about',           roles: ['publik', 'pengelola', 'admin'] },
  { label: 'Zona Integritas', to: '/zona-integritas', roles: ['publik', 'pengelola', 'admin'] },
  { label: 'Hubungi',         to: '/hubungi',         roles: ['publik', 'pengelola', 'admin'] },

  // ── Pengelola — shortcut portal ekosistem & alat internal ───────────────
  // Halaman ini bisa diakses publik via URL, tapi hanya muncul di topbar
  // untuk pengelola sebagai shortcut cepat ke dashboard/peta.
  { label: 'Danau',           to: '/danau',           roles: ['pengelola', 'admin'] },
  { label: 'Mangrove',        to: '/mangrove',        roles: ['pengelola', 'admin'] },
  { label: 'Mata Air',        to: '/mataair',         roles: ['pengelola', 'admin'] },

  // ── Admin — panel administrasi sistem ───────────────────────────────────
  { label: 'Admin',           to: '/admin/share',     roles: ['admin'] },
]

export function useRole() {
  // Role disimpan di global useState agar reaktif di SSR.
  // Default: 'publik' (tanpa autentikasi).
  // TODO: ganti initializer dengan session dari auth provider ketika diimplementasi.
  // Contoh: () => useAuth().session.value?.role ?? 'publik'
  const role = useState<UserRole>('userRole', () => 'publik')

  const visibleNav = computed(() =>
    NAV_ITEMS.filter(item => item.roles.includes(role.value))
  )

  function setRole(r: UserRole) {
    role.value = r
  }

  return { role, visibleNav, setRole }
}
