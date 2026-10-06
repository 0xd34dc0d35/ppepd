import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, realpathSync, rmdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, relative, isAbsolute, basename } from 'node:path'
import { randomBytes } from 'node:crypto'
import pg from 'pg'

const postgres = process.argv.includes('--postgres')
const prefix = `test_${randomBytes(8).toString('hex')}_`
const db = postgres ? new pg.Client({ connectionString: process.env.NUXT_MANAGEMENT_DATABASE_URL, connectionTimeoutMillis: 8000 }) : null
if (db) await db.connect()

const directory = mkdtempSync(join(tmpdir(), 'ppepd-management-test-'))
const buildDirectory = resolve('.nuxt', basename(directory))
const base = 'http://127.0.0.1:3101'
// Refuse to run against an existing server (which could contain user data).
try { await fetch(`${base}/api/management/status`, { signal: AbortSignal.timeout(500) }); throw new Error('Port 3101 sudah digunakan') }
catch (err) { if (err.message === 'Port 3101 sudah digunakan') { rmdirSync(directory); throw err } }
const server = spawn(process.execPath, [resolve('node_modules/nuxt/bin/nuxt.mjs'), 'dev', '--host', '127.0.0.1', '--port', '3101'], {
  cwd: process.cwd(), env: { ...process.env, NUXT_IGNORE_LOCK: '1', PPEPD_TEST_BUILD_DIR: buildDirectory, NUXT_MANAGEMENT_DATA_DIR: directory, NUXT_PUBLIC_LOCAL_MANAGEMENT: 'true', NUXT_MANAGEMENT_STORAGE: postgres ? 'postgres' : 'file', NUXT_MANAGEMENT_SCHEMA: 'ppepd_management', NUXT_MANAGEMENT_TABLE_PREFIX: prefix }, stdio: ['ignore', 'pipe', 'pipe'],
})
let output = ''
server.stdout.on('data', data => { output = (output + data).slice(-5000) })
server.stderr.on('data', data => { output = (output + data).slice(-5000) })
const password = `Test-only-${randomBytes(16).toString('hex')}`
let checks = 0
async function request(path, { method = 'GET', body, cookie, origin, status = 200 } = {}) {
  const response = await fetch(`${base}/api/management/${path}`, {
    method, headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}), ...(origin ? { Origin: origin } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15000),
  })
  const data = await response.json()
  assert.equal(response.status, status, `${method} ${path}: ${JSON.stringify(data)}`)
  checks++
  return { data, cookie: response.headers.get('set-cookie')?.split(';')[0], cookieHeader: response.headers.get('set-cookie') }
}
try {
  let ready = false
  for (let i = 0; i < 80; i++) {
    if (server.exitCode !== null) throw new Error(output)
    try { const response = await fetch(`${base}/api/management/status`, { signal: AbortSignal.timeout(1000) }); if (response.ok) { ready = true; break } } catch {}
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  assert.ok(ready, output)
  assert.equal((await request('status')).data.initialized, false)
  await request('users', { status: 401 })
  const adminFields = { username: 'test-admin', display_name: 'Test Admin', email: '', role: 'admin', active: true }
  const admin = await request('setup', { method: 'POST', body: { ...adminFields, password } })
  assert.match(admin.cookieHeader, /HttpOnly/i)
  assert.match(admin.cookieHeader, /SameSite=Strict/i)
  const register = await fetch(`${base}/register`, { redirect: 'manual' })
  assert.equal(register.status, 302)
  assert.equal(register.headers.get('location'), '/login')
  assert.equal(admin.data.token, undefined)
  const adminId = admin.data.user.id
  await request('setup', { method: 'POST', body: { ...adminFields, password }, status: 409 })
  await request('auth/me', { cookie: admin.cookie })
  await request('lake-profiles', { status: 401 })
  const lakeFields = { name: 'Danau uji', province: 'Bali', district: 'Bangli', village: '', latitude: -8.2, longitude: 115.2, area: 1600, depth: 88, volume: 0, status: 'aktif', notes: 'Pengujian terisolasi' }
  for (const invalid of [{ area: -1 }, { depth: -1 }, { volume: -1 }, { latitude: 91 }, { longitude: '' }, { name: '' }]) await request('lake-profiles', { method: 'POST', cookie: admin.cookie, body: { ...lakeFields, ...invalid }, status: 400 })
  await request('lake-profiles', { method: 'POST', cookie: admin.cookie, origin: 'https://untrusted.example', body: lakeFields, status: 403 })
  const lake = (await request('lake-profiles', { method: 'POST', cookie: admin.cookie, body: lakeFields, status: 201 })).data.data
  const lakeList = (await request('lake-profiles?search=Danau', { cookie: admin.cookie })).data
  assert.equal(lakeList.total, 1)
  assert.equal(lakeList.data[0].volume, 0)
  await request('lake-profiles', { method: 'PATCH', cookie: admin.cookie, body: { ...lake, notes: 'Danau diperbarui' } })
  await request('lake-profiles', { method: 'PATCH', cookie: admin.cookie, body: { ...lake, updated_at: 'stale' }, status: 409 })
  assert.equal((await request('spring-profiles', { cookie: admin.cookie })).data.total, 0)
  await request('spring-profiles', { status: 401 })
  const springFields = { name: 'Profil uji', province: 'Bali', district: 'Bangli', village: 'Desa uji', latitude: -8.4, longitude: 115.3, discharge: 0, status: 'aktif', notes: 'Data pengujian terisolasi' }
  await request('spring-profiles', { method: 'POST', cookie: admin.cookie, body: { ...springFields, latitude: 100 }, status: 400 })
  await request('spring-profiles', { method: 'POST', cookie: admin.cookie, origin: 'https://untrusted.example', body: springFields, status: 403 })
  const spring = (await request('spring-profiles', { method: 'POST', cookie: admin.cookie, body: springFields, status: 201 })).data.data
  const springs = (await request('spring-profiles?search=Bangli', { cookie: admin.cookie })).data
  assert.equal(springs.total, 1)
  assert.equal(springs.data[0].discharge, 0)
  await request('spring-profiles', { method: 'PATCH', cookie: admin.cookie, body: { ...spring, notes: 'Diperbarui' } })
  await request('spring-profiles', { method: 'PATCH', cookie: admin.cookie, body: { ...spring, updated_at: 'stale' }, status: 409 })
  const adminPage = await fetch(`${base}/admin/system`, { headers: { Cookie: admin.cookie }, redirect: 'manual' })
  assert.equal(adminPage.status, 200)
  assert.match(await adminPage.text(), /Akun pengguna/)
  await request('users', { method: 'POST', cookie: admin.cookie, origin: 'https://untrusted.example', body: {}, status: 403 })
  await request(`users/${adminId}`, { method: 'PATCH', cookie: admin.cookie, body: { ...adminFields, active: false }, status: 400 })
  const fields = { username: 'test-user', display_name: 'Test User', email: 'profile-test@example.test', role: 'publik', active: true }
  await request('users', { method: 'POST', cookie: admin.cookie, body: { ...fields, password: 'short' }, status: 400 })
  const created = await request('users', { method: 'POST', cookie: admin.cookie, body: { ...fields, password } })
  const id = created.data.data.id
  assert.equal(created.data.data.password_hash, undefined)
  await request('users', { method: 'POST', cookie: admin.cookie, body: { ...fields, password }, status: 409 })
  const login = await request('auth/login', { method: 'POST', body: { username: fields.username, password } })
  await request('lake-profiles', { cookie: login.cookie, status: 403 })
  await request('lake-profiles', { method: 'POST', cookie: login.cookie, body: lakeFields, status: 403 })
  await request('spring-profiles', { cookie: login.cookie, status: 403 })
  await request('spring-profiles', { method: 'POST', cookie: login.cookie, body: springFields, status: 403 })
  await request('users', { cookie: login.cookie, status: 403 })
  await request('app', { cookie: login.cookie })
  const profile = await fetch(`${base}/my-profiles`, { headers: { Cookie: login.cookie }, redirect: 'manual' })
  assert.equal(profile.status, 200)
  assert.match(await profile.text(), /Test User/)
  const profileChanges = { display_name: 'Updated Test User', institution: 'Instansi Uji', organisation_name: 'Organisasi Uji' }
  await request('auth/profile', { method: 'PATCH', body: profileChanges, status: 401 })
  const updatedProfile = await request('auth/profile', { method: 'PATCH', cookie: login.cookie, body: profileChanges })
  assert.equal(updatedProfile.data.user.email, fields.email)
  assert.equal(updatedProfile.data.user.institution, profileChanges.institution)
  assert.equal(updatedProfile.data.user.display_name, profileChanges.display_name)
  await request('auth/profile', { method: 'PATCH', cookie: login.cookie, body: { ...profileChanges, email: 'changed@example.test' }, status: 400 })
  await request('auth/profile', { method: 'PATCH', cookie: login.cookie, body: { ...profileChanges, role: 'admin' }, status: 400 })
  await request('auth/profile', { method: 'PATCH', cookie: login.cookie, body: { ...profileChanges, username: 'another-user' }, status: 400 })
  await request('auth/profile', { method: 'PATCH', cookie: login.cookie, body: { ...profileChanges, display_name: ' ' }, status: 400 })
  await request('auth/profile', { method: 'PATCH', cookie: login.cookie, body: { ...profileChanges, institution: 'x'.repeat(151) }, status: 400 })
  const unchangedIdentity = await request('auth/me', { cookie: login.cookie })
  assert.equal(unchangedIdentity.data.user.email, fields.email)
  assert.deepEqual(unchangedIdentity.data.user.roles, ['publik'])
  await request('roles', { cookie: login.cookie, status: 403 })
  const roleList = await request('roles', { cookie: admin.cookie })
  assert.equal(roleList.data.data.length, 3)
  const publicApps = await request('app', { cookie: login.cookie })
  assert.ok(publicApps.data.data.some(app => app.meta.url === '/dokumentasi'))
  assert.ok(!publicApps.data.data.some(app => app.meta.url === '/admin/roles'))
  const deniedRoles = await fetch(`${base}/admin/roles`, { headers: { Cookie: login.cookie }, redirect: 'manual' })
  assert.equal(deniedRoles.status, 403)
  const rolesPage = await fetch(`${base}/admin/roles`, { headers: { Cookie: admin.cookie } })
  assert.equal(rolesPage.status, 200)
  assert.match(await rolesPage.text(), /Roles &amp; hak akses/)
  const documentation = await fetch(`${base}/dokumentasi`, { headers: { Cookie: login.cookie } })
  assert.equal(documentation.status, 200)
  assert.match(await documentation.text(), /Dokumentasi pengguna/)
  const restricted = await fetch(`${base}/danau/dashboard`, { headers: { Cookie: login.cookie }, redirect: 'manual' })
  assert.equal(restricted.status, 403)
  await request(`users/${id}`, { method: 'PATCH', cookie: admin.cookie, body: { ...fields, role: 'pengelola' } })
  await request('auth/me', { cookie: login.cookie, status: 401 })
  const manager = await request('auth/login', { method: 'POST', body: { username: fields.username, password } })
  assert.ok(manager.data.user.allowed.includes('dashboard.view'))
  assert.equal((await request('lake-profiles', { cookie: manager.cookie })).data.canWrite, false)
  await request('lake-profiles', { method: 'POST', cookie: manager.cookie, body: lakeFields, status: 403 })
  assert.equal((await request('spring-profiles', { cookie: manager.cookie })).data.canWrite, false)
  await request('spring-profiles', { method: 'POST', cookie: manager.cookie, body: springFields, status: 403 })
  await request('roles/pengelola', { method: 'PATCH', cookie: manager.cookie, body: { permissions: ['users.manage'] }, status: 403 })
  await request('roles/pengelola', { method: 'PATCH', cookie: admin.cookie, body: { permissions: ['invalid'] }, status: 400 })
  await request('roles/pengelola', { method: 'PATCH', cookie: admin.cookie, body: { permissions: ['profile.view', 'users.manage', 'roles.manage'] } })
  await request('auth/me', { cookie: manager.cookie, status: 401 })
  const delegated = await request('auth/login', { method: 'POST', body: { username: fields.username, password } })
  await request('users', { cookie: delegated.cookie })
  await request('roles', { cookie: delegated.cookie })
  await request(`users/${adminId}/password`, { method: 'POST', cookie: delegated.cookie, body: { password }, status: 403 })
  await request('roles/publik', { method: 'PATCH', cookie: delegated.cookie, body: { permissions: ['users.manage'] }, status: 403 })
  const newPassword = `${password}-new`
  await request('auth/password', { method: 'POST', cookie: delegated.cookie, body: { currentPassword: password, password: 'short' }, status: 400 })
  await request('auth/password', { method: 'POST', cookie: delegated.cookie, body: { currentPassword: 'incorrect', password: newPassword }, status: 400 })
  const changed = await request('auth/password', { method: 'POST', cookie: delegated.cookie, body: { currentPassword: password, password: newPassword } })
  await request('auth/me', { cookie: delegated.cookie, status: 401 })
  await request('auth/me', { cookie: changed.cookie })
  await request(`users/${id}/sessions`, { method: 'POST', cookie: admin.cookie, body: {} })
  await request('auth/me', { cookie: changed.cookie, status: 401 })
  const again = await request('auth/login', { method: 'POST', body: { username: fields.username, password: newPassword } })
  await request(`users/${id}`, { method: 'PATCH', cookie: admin.cookie, body: { ...fields, role: 'pengelola', active: false } })
  await request('auth/me', { cookie: again.cookie, status: 401 })
  await request('auth/login', { method: 'POST', body: { username: fields.username, password: newPassword }, status: 401 })
  await request(`users/${id}`, { method: 'PATCH', cookie: admin.cookie, body: { ...fields, role: 'pengelola' } })
  await request(`users/${id}/password`, { method: 'POST', cookie: admin.cookie, body: { password } })
  const finalLogin = await request('auth/login', { method: 'POST', body: { username: fields.username, password } })
  await request('auth/logout', { method: 'POST', cookie: finalLogin.cookie, body: {} })
  await request('auth/me', { cookie: finalLogin.cookie, status: 401 })
  const logs = await request('audit', { cookie: admin.cookie })
  assert.ok(logs.data.data.some(entry => entry.action === 'password.reset'))
  assert.ok(logs.data.data.every(entry => !JSON.stringify(entry).includes(password)))
  const persisted = db ? {
    users: (await db.query(`SELECT password_hash FROM ppepd_management."${prefix}users"`)).rows,
    sessions: (await db.query(`SELECT hash,user_id,expires FROM ppepd_management."${prefix}sessions"`)).rows,
  } : JSON.parse(readFileSync(join(directory, 'store.json'), 'utf8'))
  assert.ok(persisted.users.every(user => user.password_hash && !user.password_hash.includes(password)))
  assert.ok(persisted.sessions.every(session => !JSON.stringify(session).includes(admin.cookie.split('=')[1])))
  const persistedSprings = db ? (await db.query(`SELECT document FROM ppepd_management."${prefix}spring_profiles"`)).rows.map(row => row.document) : persisted.springs
  assert.equal(persistedSprings.length, 1)
  assert.equal(persistedSprings[0].notes, 'Diperbarui')
  const persistedLakes = db ? (await db.query(`SELECT document FROM ppepd_management."${prefix}lake_profiles"`)).rows.map(row => row.document) : persisted.lakes
  assert.equal(persistedLakes.length, 1)
  assert.equal(persistedLakes[0].notes, 'Danau diperbarui')
  for (let i = 0; i < 10; i++) await request('auth/login', { method: 'POST', body: { username: 'absent', password }, status: 401 })
  await request('auth/login', { method: 'POST', body: { username: 'absent', password }, status: 429 })
  console.log(`PASS (${postgres ? 'PostgreSQL' : 'file'}): ${checks} API checks + SSR session, route permissions, hashes, and audit checks`)
} catch (err) {
  console.error(output)
  throw err
} finally {
  if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' })
  else server.kill('SIGTERM')
  if (db) {
    // Only drop this run's uniquely named test tables; never touch live management tables.
    assert.match(prefix, /^test_[a-f0-9]{16}_$/)
    for (const name of ['sessions', 'users', 'roles', 'audit', 'metadata', 'spring_profiles', 'lake_profiles']) await db.query(`DROP TABLE IF EXISTS ppepd_management."${prefix}${name}"`)
    await db.end()
  }
  // Resolve and verify this exact uniquely-created fixture directory stays under OS temp before recursive cleanup.
  const target = realpathSync(directory)
  const withinTemp = relative(realpathSync(tmpdir()), target)
  assert.ok(withinTemp && !withinTemp.startsWith('..') && !isAbsolute(withinTemp) && withinTemp.startsWith('ppepd-management-test-'))
  try { rmSync(target, { recursive: true, force: true, maxRetries: 3 }) } catch {}
  const buildRelative = relative(resolve('.nuxt'), buildDirectory)
  assert.ok(buildRelative && !buildRelative.startsWith('..') && !isAbsolute(buildRelative) && buildRelative.startsWith('ppepd-management-test-'))
  try { rmSync(buildDirectory, { recursive: true, force: true, maxRetries: 3 }) } catch {}
}
