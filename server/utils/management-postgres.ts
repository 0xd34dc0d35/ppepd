import pg from 'pg'
import { existsSync, readFileSync } from 'node:fs'
import type { H3Event } from 'h3'
import type { ManagementStore } from './management'
import { DEFAULT_ROLES } from '#shared/management'

const pools = new Map<string, pg.Pool>()
const initialized = new Map<string, Promise<void>>()
type Tables = { key: string; roles: string; users: string; sessions: string; audit: string; metadata: string; index: string; springs: string; lakes: string }
function tableNames(value: string, prefix: string): Tables {
  if (!/^[a-z][a-z0-9_]{0,62}$/.test(value)) throw new Error('Invalid management schema')
  if (!/^[a-z0-9_]{0,35}$/.test(prefix)) throw new Error('Invalid table prefix')
  const qualified = (name: string) => `"${value}"."${prefix}${name}"`
  return { key: `${value}:${prefix}`, roles: qualified('roles'), users: qualified('users'), sessions: qualified('sessions'), audit: qualified('audit'), metadata: qualified('metadata'), index: `"${prefix}sessions_user_idx"`, springs: qualified('spring_profiles'), lakes: qualified('lake_profiles') }
}
function getPool(url: string) {
  let pool = pools.get(url)
  if (!pool) {
    pool = new pg.Pool({ connectionString: url, max: 5, connectionTimeoutMillis: 8000, idleTimeoutMillis: 30000, application_name: 'ppepd-management', statement_timeout: 15000 })
    pool.on('error', () => console.error('[management] PostgreSQL connection unavailable'))
    pools.set(url, pool)
  }
  return pool
}
async function initialize(pool: pg.Pool, schema: Tables, key: string) {
  let task = initialized.get(key)
  if (!task) {
    task = (async () => {
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`ppepd-schema:${schema.key}`])
        await client.query(`CREATE TABLE IF NOT EXISTS ${schema.roles} (id text PRIMARY KEY, document jsonb NOT NULL);
          CREATE TABLE IF NOT EXISTS ${schema.users} (id uuid PRIMARY KEY, username text UNIQUE NOT NULL, role text NOT NULL REFERENCES ${schema.roles}(id), password_hash text NOT NULL, document jsonb NOT NULL);
          CREATE TABLE IF NOT EXISTS ${schema.sessions} (hash text PRIMARY KEY, user_id uuid NOT NULL REFERENCES ${schema.users}(id) ON DELETE CASCADE, expires bigint NOT NULL);
          CREATE INDEX IF NOT EXISTS ${schema.index} ON ${schema.sessions}(user_id);
          CREATE TABLE IF NOT EXISTS ${schema.audit} (id uuid PRIMARY KEY, at timestamptz NOT NULL, document jsonb NOT NULL);
          CREATE TABLE IF NOT EXISTS ${schema.metadata} (key text PRIMARY KEY, value text NOT NULL);
          CREATE TABLE IF NOT EXISTS ${schema.springs} (id uuid PRIMARY KEY, document jsonb NOT NULL);
          CREATE TABLE IF NOT EXISTS ${schema.lakes} (id uuid PRIMARY KEY, document jsonb NOT NULL);`)
        await client.query('COMMIT')
      } catch (error) { await client.query('ROLLBACK'); throw error }
      finally { client.release() }
    })()
    initialized.set(key, task)
    task.catch(() => initialized.delete(key))
  }
  await task
}
async function load(client: pg.PoolClient, schema: Tables): Promise<ManagementStore> {
  const { rows: [data] } = await client.query(`SELECT
    (SELECT COALESCE(jsonb_agg(document ORDER BY id), '[]') FROM ${schema.roles}) AS roles,
    (SELECT COALESCE(jsonb_agg(document || jsonb_build_object('password_hash',password_hash) ORDER BY document->>'created_at'), '[]') FROM ${schema.users}) AS users,
    (SELECT COALESCE(jsonb_agg(jsonb_build_object('hash',hash,'user_id',user_id,'expires',expires)), '[]') FROM ${schema.sessions} WHERE expires > $1) AS sessions,
    (SELECT COALESCE(jsonb_agg(document ORDER BY at,id), '[]') FROM ${schema.audit}) AS audit`, [Date.now()])
  const springs = await client.query(`SELECT document FROM ${schema.springs} ORDER BY document->>'name', id`)
  const lakes = await client.query(`SELECT document FROM ${schema.lakes} ORDER BY document->>'name', id`)
  return { ...data, lakes: lakes.rows.map(row => row.document), springs: springs.rows.map(row => row.document), roles: data.roles.length ? data.roles : structuredClone(DEFAULT_ROLES) }
}
async function persist(client: pg.PoolClient, schema: Tables, store: ManagementStore) {
  await client.query(`INSERT INTO ${schema.springs}(id,document) SELECT id,document FROM jsonb_to_recordset($1::jsonb) AS r(id uuid,document jsonb) ON CONFLICT(id) DO UPDATE SET document=EXCLUDED.document`, [JSON.stringify((store.springs ?? []).map(document => ({ id: document.id, document })))])
  await client.query(`INSERT INTO ${schema.lakes}(id,document) SELECT id,document FROM jsonb_to_recordset($1::jsonb) AS r(id uuid,document jsonb) ON CONFLICT(id) DO UPDATE SET document=EXCLUDED.document`, [JSON.stringify((store.lakes ?? []).map(document => ({ id: document.id, document })))])
  await client.query(`INSERT INTO ${schema.roles}(id,document) SELECT id,document FROM jsonb_to_recordset($1::jsonb) AS r(id text,document jsonb) ON CONFLICT(id) DO UPDATE SET document=EXCLUDED.document`, [JSON.stringify(store.roles.map(role => ({ id: role.id, document: role })))])
  const users = store.users.map(user => {
    const { password_hash, ...document } = user
    return { id: user.id, username: user.username, role: user.role, password_hash, document }
  })
  await client.query(`INSERT INTO ${schema.users}(id,username,role,password_hash,document) SELECT id,username,role,password_hash,document FROM jsonb_to_recordset($1::jsonb) AS u(id uuid,username text,role text,password_hash text,document jsonb) ON CONFLICT(id) DO UPDATE SET username=EXCLUDED.username, role=EXCLUDED.role, password_hash=EXCLUDED.password_hash, document=EXCLUDED.document`, [JSON.stringify(users)])
  await client.query(`DELETE FROM ${schema.sessions} WHERE NOT (hash = ANY($1::text[])) OR expires <= $2`, [store.sessions.map(s => s.hash), Date.now()])
  await client.query(`INSERT INTO ${schema.sessions}(hash,user_id,expires) SELECT hash,user_id,expires FROM jsonb_to_recordset($1::jsonb) AS s(hash text,user_id uuid,expires bigint) ON CONFLICT(hash) DO NOTHING`, [JSON.stringify(store.sessions)])
  await client.query(`INSERT INTO ${schema.audit}(id,at,document) SELECT id,at,document FROM jsonb_to_recordset($1::jsonb) AS a(id uuid,at timestamptz,document jsonb) ON CONFLICT(id) DO NOTHING`, [JSON.stringify(store.audit.map(entry => ({ id: entry.id, at: entry.at, document: entry })))])
  await client.query(`DELETE FROM ${schema.audit} WHERE NOT (id = ANY($1::uuid[]))`, [store.audit.map(entry => entry.id)])
}

export async function withPostgresManagement<T>(event: H3Event, action: (store: ManagementStore) => Promise<T>, isDirty: (store: ManagementStore) => boolean, legacyPath: string): Promise<T> {
  const config = useRuntimeConfig(event)
  const schema = tableNames(config.managementSchema, config.managementTablePrefix)
  const pool = getPool(config.managementDatabaseUrl)
  let client: pg.PoolClient | undefined
  try {
    await initialize(pool, schema, `${config.managementDatabaseUrl}:${schema.key}`)
    client = await pool.connect()
    await client.query('BEGIN')
    // Serializes account changes across workers and makes first-admin creation atomic.
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`ppepd-store:${schema.key}`])
    let store = await load(client, schema)
    const migration = await client.query(`SELECT value FROM ${schema.metadata} WHERE key='legacy_import'`)
    if (!migration.rowCount) {
      if (!store.users.length && existsSync(legacyPath)) {
        const legacy = JSON.parse(readFileSync(legacyPath, 'utf8')) as ManagementStore
        if (!Array.isArray(legacy.users) || !Array.isArray(legacy.roles) || !Array.isArray(legacy.sessions) || !Array.isArray(legacy.audit)) throw new Error('Invalid legacy store')
        store = legacy
        // Keep account credentials and audit history; force a new login after migration.
        store.sessions = []
      }
      await persist(client, schema, store)
      await client.query(`INSERT INTO ${schema.metadata}(key,value) VALUES ('legacy_import',$1)`, [new Date().toISOString()])
    }
    let result: T | undefined
    let failure: unknown
    try { result = await action(store) } catch (error) { failure = error }
    // Persist explicitly saved login-failure audit entries before returning the original 401.
    if (isDirty(store)) await persist(client, schema, store)
    await client.query('COMMIT')
    if (failure) throw failure
    return result as T
  } catch (error: any) {
    if (client) await client.query('ROLLBACK').catch(() => {})
    if (error?.statusCode) throw error
    console.error('[management] Database transaction failed:', error?.code ?? 'unavailable')
    throw createError({ statusCode: 503, statusMessage: 'Database manajemen tidak dapat diakses. Periksa koneksi SSH tunnel.' })
  } finally { client?.release() }
}
