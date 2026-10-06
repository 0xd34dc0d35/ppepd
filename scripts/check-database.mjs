import pg from 'pg'
if (process.env.NUXT_MANAGEMENT_STORAGE !== 'postgres' || !process.env.NUXT_MANAGEMENT_DATABASE_URL) throw new Error('Env dev belum diarahkan ke PostgreSQL')
const client = new pg.Client({ connectionString: process.env.NUXT_MANAGEMENT_DATABASE_URL, connectionTimeoutMillis: 8000 })
try {
  await client.connect()
  const connection = (await client.query('SELECT current_database() AS database, current_user AS role, version() AS version, inet_server_port() AS container_port')).rows[0]
  const target = new URL(process.env.NUXT_MANAGEMENT_DATABASE_URL)
  console.log({ ...connection, tunnel: `${target.hostname}:${target.port}`, remote: 'prodanau:127.0.0.1:5434' })
} catch (error) {
  console.error(`Koneksi PostgreSQL gagal (${error.code ?? 'unavailable'}). Pastikan npm run db:tunnel sedang berjalan.`)
  process.exitCode = 1
} finally { await client.end() }
