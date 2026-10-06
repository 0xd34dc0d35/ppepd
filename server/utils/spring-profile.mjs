export function validateSpringProfile(body) {
  const text = (key, max, required = false) => {
    const value = typeof body?.[key] === 'string' ? body[key].trim() : ''
    if ((required && !value) || value.length > max) throw new Error(`Kolom ${key} tidak valid`)
    return value
  }
  const number = (key, min, max) => {
    const raw = body?.[key]
    if (raw === '' || raw === null || raw === undefined) return null
    if (!['string', 'number'].includes(typeof raw)) throw new Error(`Kolom ${key} tidak valid`)
    const value = Number(raw)
    if (!Number.isFinite(value) || value < min || value > max) throw new Error(`Kolom ${key} di luar rentang`)
    return value
  }
  const latitude = number('latitude', -90, 90)
  const longitude = number('longitude', -180, 180)
  if ((latitude === null) !== (longitude === null)) throw new Error('Latitude dan longitude harus diisi berpasangan')
  if (!['aktif', 'tidak-aktif'].includes(body?.status)) throw new Error('Status tidak valid')
  return { name: text('name', 150, true), province: text('province', 100, true), district: text('district', 100, true), village: text('village', 100), latitude, longitude, discharge: number('discharge', 0, 1000000000), status: body.status, notes: text('notes', 3000) }
}
