import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import type { H3Event } from 'h3'
import { DEFAULT_ROLES, type ManagedRole, type ManagedUser, type AuditEntry, type Permission } from '#shared/management'

export interface StoredUser extends ManagedUser { password_hash: string }
interface Session { hash: string; user_id: string; expires: number }
export interface SpringProfile { id: string; name: string; province: string; district: string; village: string; latitude: number | null; longitude: number | null; discharge: number | null; status: string; notes: string; created_at: string; updated_at: string; updated_by: string }
export interface LakeProfile extends Omit<SpringProfile, 'discharge'> { area: number | null; depth: number | null; volume: number | null }
export interface ManagementStore { users: StoredUser[]; roles: ManagedRole[]; sessions: Session[]; audit: AuditEntry[]; springs?: SpringProfile[]; lakes?: LakeProfile[] }
const COOKIE = 'ppepd_session'
const SESSION_SECONDS = 60 * 60 * 8
const databaseStores = new WeakSet<ManagementStore>()
const dirtyStores = new WeakSet<ManagementStore>()

export async function withManagementStore<T>(event: H3Event, action: (store: ManagementStore) => T | Promise<T>): Promise<T> {
  const config = useRuntimeConfig(event)
  if (config.managementStorage === 'file') return action(readManagement())
  if (config.managementStorage !== 'postgres' || !config.managementDatabaseUrl) {
    throw createError({ statusCode: 503, statusMessage: 'Konfigurasi database manajemen belum tersedia' })
  }
  const { withPostgresManagement } = await import('./management-postgres')
  return withPostgresManagement(event, async store => {
    databaseStores.add(store)
    return action(store)
  }, store => dirtyStores.has(store), storePath())
}

export function requireLocalManagement(event: H3Event) {
  if (!useRuntimeConfig(event).public.localManagement) {
    throw createError({ statusCode: 404, statusMessage: 'Manajemen lokal tidak diaktifkan' })
  }
  setHeader(event, 'Cache-Control', 'no-store')
  if (!['GET', 'HEAD'].includes(event.method)) {
    const origin = getHeader(event, 'origin')
    // All browser writes require same-origin JSON; non-browser clients may omit Origin.
    if (origin && origin !== getRequestURL(event).origin) {
      throw createError({ statusCode: 403, statusMessage: 'Origin tidak diizinkan' })
    }
    if (!getHeader(event, 'content-type')?.startsWith('application/json')) {
      throw createError({ statusCode: 415, statusMessage: 'Gunakan application/json' })
    }
  }
}

export function storePath() { return resolve(process.cwd(), useRuntimeConfig().managementDataDir, 'store.json') }
export function readManagement(): ManagementStore {
  const path = storePath()
  if (!existsSync(path)) return { users: [], roles: structuredClone(DEFAULT_ROLES), sessions: [], audit: [] }
  // A corrupt store must fail closed, never enable bootstrap again.
  const data = JSON.parse(readFileSync(path, 'utf8')) as ManagementStore
  if (!Array.isArray(data.users) || !Array.isArray(data.roles) || !Array.isArray(data.sessions) || !Array.isArray(data.audit)) {
    throw createError({ statusCode: 500, statusMessage: 'Penyimpanan akun tidak valid' })
  }
  return data
}
export function saveManagement(store: ManagementStore) {
  store.sessions = store.sessions.filter(s => s.expires > Date.now())
  store.audit = store.audit.slice(-1000)
  if (databaseStores.has(store)) { dirtyStores.add(store); return }
  const path = storePath()
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(`${path}.tmp`, JSON.stringify(store, null, 2), { mode: 0o600 })
  renameSync(`${path}.tmp`, path)
}
export function passwordHash(password: string) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}
const dummyHash = passwordHash(randomBytes(32).toString('hex'))
export function passwordMatches(password: string, stored = dummyHash) {
  const [salt, hash] = stored.split(':')
  const candidate = scryptSync(password, salt!, 64)
  const expected = Buffer.from(hash!, 'hex')
  return candidate.length === expected.length && timingSafeEqual(candidate, expected)
}
export function validatePassword(value: unknown): string {
  if (typeof value !== 'string' || value.length < 12 || value.length > 128) {
    throw createError({ statusCode: 400, statusMessage: 'Password harus 12–128 karakter' })
  }
  return value
}
export function publicUser(user: StoredUser): ManagedUser {
  const { password_hash, ...safe } = user
  return safe
}
export function permissionsFor(store: ManagementStore, user: StoredUser): Permission[] {
  return store.roles.find(r => r.id === user.role)?.permissions ?? []
}
export function authUser(store: ManagementStore, user: StoredUser) {
  return { ...publicUser(user), roles: [user.role], allowed: permissionsFor(store, user), allowed_menus: [] }
}
const digest = (token: string) => createHash('sha256').update(token).digest('hex')
export function sessionUser(event: H3Event, store: ManagementStore): StoredUser | undefined {
  const token = getCookie(event, COOKIE)
  if (!token) return
  const session = store.sessions.find(s => s.hash === digest(token) && s.expires > Date.now())
  return session && store.users.find(u => u.id === session.user_id && u.active)
}
export function requirePermission(event: H3Event, store: ManagementStore, permission?: Permission) {
  const user = sessionUser(event, store)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Silakan masuk kembali' })
  if (permission && !permissionsFor(store, user).includes(permission)) {
    throw createError({ statusCode: 403, statusMessage: 'Anda tidak memiliki hak akses' })
  }
  return user
}
export function startSession(event: H3Event, store: ManagementStore, user: StoredUser) {
  const token = randomBytes(32).toString('hex')
  store.sessions.push({ hash: digest(token), user_id: user.id, expires: Date.now() + SESSION_SECONDS * 1000 })
  setCookie(event, COOKIE, token, { httpOnly: true, sameSite: 'strict', secure: getRequestURL(event).protocol === 'https:', path: '/', maxAge: SESSION_SECONDS })
}
export function endSession(event: H3Event, store: ManagementStore) {
  const token = getCookie(event, COOKIE)
  if (token) store.sessions = store.sessions.filter(s => s.hash !== digest(token))
  deleteCookie(event, COOKIE, { path: '/' })
}
export function audit(store: ManagementStore, actor: string, action: string, target: string) {
  store.audit.push({ id: randomUUID(), at: new Date().toISOString(), actor, action, target })
}
export function validateUser(body: any, store: ManagementStore, excludeId?: string) {
  const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : ''
  const display_name = typeof body.display_name === 'string' ? body.display_name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!/^[a-z0-9][a-z0-9._-]{2,49}$/.test(username)) throw createError({ statusCode: 400, statusMessage: 'Username harus 3–50 karakter: huruf kecil, angka, titik, garis bawah, atau tanda hubung' })
  if (!display_name || display_name.length > 100) throw createError({ statusCode: 400, statusMessage: 'Nama harus 1–100 karakter' })
  if (email.length > 254 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw createError({ statusCode: 400, statusMessage: 'Email tidak valid' })
  if (store.users.some(u => u.id !== excludeId && u.username === username)) throw createError({ statusCode: 409, statusMessage: 'Username sudah digunakan' })
  if (!store.roles.some(r => r.id === body.role)) throw createError({ statusCode: 400, statusMessage: 'Role tidak valid' })
  if (typeof body.active !== 'boolean') throw createError({ statusCode: 400, statusMessage: 'Status akun tidak valid' })
  return { username, display_name, email, role: body.role as StoredUser['role'], active: body.active }
}
