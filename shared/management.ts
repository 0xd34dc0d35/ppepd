export const MANAGEMENT_PERMISSIONS = [
  { id: 'profile.view', label: 'Profil saya', description: 'Akses daftar aplikasi dan profil pengguna.' },
  { id: 'dashboard.view', label: 'Dashboard ekosistem', description: 'Akses dashboard dan peta internal.' },
  { id: 'users.manage', label: 'Manajemen akun', description: 'Membuat dan memperbarui akun, password, dan sesi.' },
  { id: 'roles.manage', label: 'Manajemen hak akses', description: 'Melihat matriks izin; hanya administrator dapat mengubahnya.' },
  { id: 'audit.view', label: 'Log aktivitas', description: 'Melihat riwayat perubahan dan autentikasi.' },
] as const

export type Permission = typeof MANAGEMENT_PERMISSIONS[number]['id']
export type ManagementRole = 'admin' | 'pengelola' | 'publik'
export interface ManagedRole { id: ManagementRole; name: string; permissions: Permission[] }
export interface ManagedUser {
  institution?: string
  organisation_name?: string
  id: string
  username: string
  display_name: string
  email: string
  role: ManagementRole
  active: boolean
  created_at: string
  updated_at: string
  last_login: string | null
}
export interface AuditEntry {
  id: string; at: string; actor: string; action: string; target: string
}
export const DEFAULT_ROLES: ManagedRole[] = [
  { id: 'admin', name: 'Administrator', permissions: MANAGEMENT_PERMISSIONS.map(p => p.id) },
  { id: 'pengelola', name: 'Pengelola', permissions: ['profile.view', 'dashboard.view'] },
  { id: 'publik', name: 'Pengguna', permissions: ['profile.view'] },
]
