import { randomUUID } from 'node:crypto'
import { MANAGEMENT_PERMISSIONS, type Permission } from '#shared/management'
import { audit, authUser, endSession, passwordHash, passwordMatches, permissionsFor, publicUser, requireLocalManagement, requirePermission, saveManagement, sessionUser, startSession, validatePassword, validateUser, withManagementStore } from '../../utils/management'

// Bounded in-memory login throttling for this single-process development backend.
const attempts = new Map<string, { count: number; until: number }>()

export default defineEventHandler(async event => {
  requireLocalManagement(event)
  const path = getRouterParam(event, 'path') ?? ''
  const method = event.method
  // Read request body before loading the store; all store mutations after this await are synchronous.
  const body = ['POST', 'PATCH', 'PUT'].includes(method) ? await readBody(event) : {}
  return withManagementStore(event, store => {

  if (path === 'status' && method === 'GET') return { initialized: store.users.length > 0, storage: useRuntimeConfig(event).managementStorage }
  if (path === 'setup' && method === 'POST') {
    if (store.users.length) throw createError({ statusCode: 409, statusMessage: 'Admin pertama sudah dibuat' })
    const ip = getRequestIP(event) ?? ''
    const host = getRequestURL(event).hostname
    // Nuxt's development worker bridge does not preserve the socket address.
    // The documented dev command binds to 127.0.0.1; allow its loopback host only.
    const devLoopback = import.meta.dev && !ip && ['127.0.0.1', 'localhost', '[::1]'].includes(host)
    if (!devLoopback && !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(ip)) throw createError({ statusCode: 403, statusMessage: 'Pengaturan pertama hanya tersedia dari komputer server' })
    const fields = validateUser({ ...body, role: 'admin', active: true }, store)
    const now = new Date().toISOString()
    const user = { ...fields, id: randomUUID(), password_hash: passwordHash(validatePassword(body.password)), created_at: now, updated_at: now, last_login: now }
    store.users.push(user)
    startSession(event, store, user)
    audit(store, user.username, 'setup', user.username)
    saveManagement(store)
    return { ok: true, user: authUser(store, user) }
  }
  if (path === 'auth/login' && method === 'POST') {
    const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const key = getRequestIP(event) ?? 'unknown'
    const current = attempts.get(key)
    if (current && current.until > Date.now() && current.count >= 10) throw createError({ statusCode: 429, statusMessage: 'Terlalu banyak percobaan. Coba kembali dalam 15 menit.' })
    if (username.length > 50 || password.length > 128) throw createError({ statusCode: 400, statusMessage: 'Input login tidak valid' })
    const user = store.users.find(u => u.username === username)
    const matches = passwordMatches(password, user?.password_hash)
    if (!user?.active || !matches) {
      for (const [k, value] of attempts) if (value.until <= Date.now()) attempts.delete(k)
      if (attempts.size > 10000) attempts.clear()
      attempts.set(key, { count: current && current.until > Date.now() ? current.count + 1 : 1, until: current && current.until > Date.now() ? current.until : Date.now() + 15 * 60 * 1000 })
      audit(store, 'pengunjung', 'login.failed', username.slice(0, 50))
      saveManagement(store)
      throw createError({ statusCode: 401, statusMessage: 'Username atau password tidak sesuai' })
    }
    attempts.delete(key)
    endSession(event, store)
    startSession(event, store, user)
    user.last_login = new Date().toISOString()
    audit(store, user.username, 'login', user.username)
    saveManagement(store)
    return { ok: true, user: authUser(store, user) }
  }
  if (path === 'auth/me' && method === 'GET') {
    const user = requirePermission(event, store)
    return { success: true, user: authUser(store, user) }
  }
  if (path === 'auth/profile' && method === 'PATCH') {
    const user = requirePermission(event, store)
    const allowed = ['display_name', 'institution', 'organisation_name']
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some(key => !allowed.includes(key))) {
      throw createError({ statusCode: 400, statusMessage: 'Hanya nama, instansi, dan organisasi yang boleh diperbarui. Email tidak dapat diubah.' })
    }
    if (typeof body.display_name !== 'string' || !body.display_name.trim() || body.display_name.trim().length > 100) {
      throw createError({ statusCode: 400, statusMessage: 'Nama harus 1–100 karakter' })
    }
    const changes = { display_name: body.display_name.trim(), institution: user.institution ?? '', organisation_name: user.organisation_name ?? '' }
    for (const field of ['institution', 'organisation_name'] as const) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== 'string' || body[field].trim().length > 150) throw createError({ statusCode: 400, statusMessage: 'Instansi dan organisasi maksimal 150 karakter' })
        changes[field] = body[field].trim()
      }
    }
    Object.assign(user, changes, { updated_at: new Date().toISOString() })
    audit(store, user.username, 'profile.update', user.username)
    saveManagement(store)
    return { ok: true, user: authUser(store, user) }
  }
  if (path === 'auth/logout' && method === 'POST') {
    const user = sessionUser(event, store)
    endSession(event, store)
    if (user) audit(store, user.username, 'logout', user.username)
    saveManagement(store)
    return { ok: true }
  }
  if (path === 'auth/password' && method === 'POST') {
    const user = requirePermission(event, store)
    if (typeof body.currentPassword !== 'string' || body.currentPassword.length > 128 || !passwordMatches(body.currentPassword, user.password_hash)) throw createError({ statusCode: 400, statusMessage: 'Password saat ini tidak sesuai' })
    user.password_hash = passwordHash(validatePassword(body.password))
    user.updated_at = new Date().toISOString()
    store.sessions = store.sessions.filter(s => s.user_id !== user.id)
    startSession(event, store, user)
    audit(store, user.username, 'password.change', user.username)
    saveManagement(store)
    return { ok: true }
  }
  if (path === 'app' && method === 'GET') {
    const user = requirePermission(event, store, 'profile.view')
    const allowed = permissionsFor(store, user)
    return { data: [
      { id: 1, name: 'Portal PPEPD', meta: { url: '/' } },
      { id: 2, name: 'Keamanan akun', meta: { url: '/account/security' } },
      ...(allowed.some(p => ['users.manage', 'audit.view'].includes(p)) ? [{ id: 3, name: 'Manajemen akun', meta: { url: '/admin/system', color: '#86efac' } }] : []),
      ...(allowed.includes('roles.manage') ? [{ id: 7, name: 'Roles & hak akses', meta: { url: '/admin/roles', color: '#93c5fd' } }] : []),
      { id: 8, name: 'Dokumentasi', meta: { url: '/dokumentasi', color: '#fde68a' } },
      ...(allowed.includes('dashboard.view') ? [{ id: 4, name: 'Manajemen Data Danau', meta: { url: '/danau/manajemen', description: 'Subaplikasi pengelolaan data danau' } }, { id: 6, name: 'Manajemen Data Mata Air', meta: { url: '/mataair/manajemen', description: 'Subaplikasi pengelolaan data mata air' } }] : []),
    ] }
  }
  if (path === 'roles' && method === 'GET') {
    requirePermission(event, store, 'roles.manage')
    return { data: store.roles }
  }
  if (path === 'overview' && method === 'GET') {
    const user = requirePermission(event, store)
    const permissions = permissionsFor(store, user)
    if (!permissions.some(p => ['users.manage', 'roles.manage', 'audit.view'].includes(p))) throw createError({ statusCode: 403, statusMessage: 'Anda tidak memiliki hak akses' })
    return { users: store.users.length, active: store.users.filter(u => u.active).length, sessions: store.sessions.filter(s => s.expires > Date.now()).length, roles: store.roles, permissions: MANAGEMENT_PERMISSIONS }
  }
  if (path === 'users' && method === 'GET') {
    requirePermission(event, store, 'users.manage')
    return { data: store.users.map(publicUser) }
  }
  if (path === 'users' && method === 'POST') {
    const actor = requirePermission(event, store, 'users.manage')
    const fields = validateUser(body, store)
    if (fields.role === 'admin' && actor.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Hanya administrator dapat membuat akun admin' })
    const now = new Date().toISOString()
    const user = { ...fields, id: randomUUID(), password_hash: passwordHash(validatePassword(body.password)), created_at: now, updated_at: now, last_login: null }
    store.users.push(user)
    audit(store, actor.username, 'user.create', user.username)
    saveManagement(store)
    return { data: publicUser(user) }
  }
  const userMatch = path.match(/^users\/([^/]+)(?:\/(password|sessions))?$/)
  if (userMatch && (method === 'PATCH' || method === 'POST')) {
    const actor = requirePermission(event, store, 'users.manage')
    const user = store.users.find(u => u.id === userMatch[1])
    if (!user) throw createError({ statusCode: 404, statusMessage: 'Akun tidak ditemukan' })
    if (user.role === 'admin' && actor.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Hanya administrator dapat mengubah akun admin' })
    let action: string
    if (!userMatch[2] && method === 'PATCH') {
      const fields = validateUser(body, store, user.id)
      if (fields.role === 'admin' && actor.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Hanya administrator dapat memberikan role admin' })
      if (actor.id === user.id && (!fields.active || fields.role !== user.role)) throw createError({ statusCode: 400, statusMessage: 'Anda tidak dapat menonaktifkan atau mengubah role akun sendiri' })
      if (user.active && user.role === 'admin' && (!fields.active || fields.role !== 'admin') && store.users.filter(u => u.active && u.role === 'admin').length <= 1) throw createError({ statusCode: 400, statusMessage: 'Minimal satu administrator aktif harus tersedia' })
      if (fields.role !== user.role || !fields.active) store.sessions = store.sessions.filter(s => s.user_id !== user.id)
      Object.assign(user, fields)
      action = 'user.update'
    } else if (userMatch[2] === 'password' && method === 'POST') {
      user.password_hash = passwordHash(validatePassword(body.password))
      store.sessions = store.sessions.filter(s => s.user_id !== user.id)
      action = 'password.reset'
    } else if (userMatch[2] === 'sessions' && method === 'POST') {
      store.sessions = store.sessions.filter(s => s.user_id !== user.id)
      action = 'sessions.revoke'
    } else throw createError({ statusCode: 405, statusMessage: 'Metode tidak diizinkan' })
    user.updated_at = new Date().toISOString()
    audit(store, actor.username, action, user.username)
    saveManagement(store)
    return { data: publicUser(user) }
  }
  const roleMatch = path.match(/^roles\/(pengelola|publik)$/)
  if (roleMatch && method === 'PATCH') {
    const actor = requirePermission(event, store, 'roles.manage')
    // Changing role policy can grant users.manage; only an administrator can delegate permissions.
    if (actor.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Hanya administrator dapat mengubah hak akses role' })
    const permissions = body.permissions
    if (!Array.isArray(permissions) || !permissions.every(p => MANAGEMENT_PERMISSIONS.some(item => item.id === p))) throw createError({ statusCode: 400, statusMessage: 'Hak akses tidak valid' })
    const role = store.roles.find(r => r.id === roleMatch[1])!
    role.permissions = [...new Set(permissions)] as Permission[]
    store.sessions = store.sessions.filter(s => store.users.find(u => u.id === s.user_id)?.role !== role.id)
    audit(store, actor.username, 'role.update', role.id)
    saveManagement(store)
    return { data: role }
  }
  if (path === 'audit' && method === 'GET') {
    requirePermission(event, store, 'audit.view')
    return { data: store.audit.slice(-200).reverse() }
  }
  throw createError({ statusCode: 404, statusMessage: 'Endpoint tidak ditemukan' })
  })
})
