import { randomUUID } from 'node:crypto'
import { audit, requireLocalManagement, requirePermission, saveManagement, withManagementStore } from '../../utils/management'
import { validateSpringProfile } from '../../utils/spring-profile.mjs'

export default defineEventHandler(async event => {
  requireLocalManagement(event)
  const body = ['POST', 'PATCH'].includes(event.method) ? await readBody(event) : null
  return withManagementStore(event, store => {
    const user = requirePermission(event, store, 'dashboard.view')
    const records = store.springs ?? []
    if (event.method === 'GET') {
      const query = getQuery(event)
      const search = String(query.search ?? '').trim().toLowerCase().slice(0, 200)
      const requestedPage = Number(query.page ?? 1)
      const found = records.filter(item => [item.name, item.province, item.district, item.village].join(' ').toLowerCase().includes(search)).sort((a, b) => a.name.localeCompare(b.name, 'id') || a.id.localeCompare(b.id))
      const page = Math.min(Math.max(1, Math.floor(Number.isFinite(requestedPage) ? requestedPage : 1)), Math.max(1, Math.ceil(found.length / 15)))
      return { data: found.slice((page - 1) * 15, page * 15), total: found.length, page, pageSize: 15, canWrite: user.role === 'admin' }
    }
    if (!['POST', 'PATCH'].includes(event.method)) throw createError({ statusCode: 405, statusMessage: 'Metode tidak didukung' })
    if (user.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Hanya administrator dapat mengubah profil mata air' })
    let fields
    try { fields = validateSpringProfile(body) } catch (err) { throw createError({ statusCode: 400, statusMessage: (err as Error).message }) }
    const now = new Date().toISOString()
    if (event.method === 'POST') {
      const record = { ...fields, id: randomUUID(), created_at: now, updated_at: now, updated_by: user.username }
      store.springs = [...records, record]
      audit(store, user.username, 'spring-profile.create', record.id)
      saveManagement(store)
      setResponseStatus(event, 201)
      return { data: record }
    }
    const record = records.find(item => item.id === body?.id)
    if (!record) throw createError({ statusCode: 404, statusMessage: 'Profil tidak ditemukan' })
    if (body.updated_at !== record.updated_at) throw createError({ statusCode: 409, statusMessage: 'Profil telah diubah pengguna lain. Tutup formulir dan muat ulang daftar.' })
    Object.assign(record, fields, { updated_at: now, updated_by: user.username })
    store.springs = records
    audit(store, user.username, 'spring-profile.update', record.id)
    saveManagement(store)
    return { data: record }
  })
})
