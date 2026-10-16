import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { resolve } from 'node:path'
import { test } from 'node:test'

// Test the compiled endpoint with an isolated public upstream, never user data.
test('catalog endpoint handles availability and never forwards browser credentials', async () => {
  let mode = 'valid'
  let upstreamCookie
  let upstreamAuthorization
  const layer = {
    id: 'fixture-2025', title: 'Mangrove 2025', year: 2025, is_active: true,
    data_url: 'https://ppepd.kemenlh.go.id/storage/ppepd/caches/fixture.pmtiles',
    metadata: { vector_layers: [{ id: 'sql_statement' }], min_zoom: 0, max_zoom: 18 },
    style: { field: 'KTTJ', categories: [] },
  }
  const upstream = createServer((request, response) => {
    upstreamCookie = request.headers.cookie
    upstreamAuthorization = request.headers.authorization
    assert.equal(request.url, '/public/geoportal/layers')
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(mode === 'valid' ? { ok: true, data: [layer] } : mode === 'empty' ? { ok: true, data: [] } : mode === 'malformed' ? { ok: true, data: null } : { ok: false }))
  })
  upstream.listen(0, '127.0.0.1')
  await once(upstream, 'listening')
  // Reserve an unused local port, then release it for Nitro.
  const reservation = createServer()
  reservation.listen(0, '127.0.0.1')
  await once(reservation, 'listening')
  const port = reservation.address().port
  await new Promise(resolve => reservation.close(resolve))
  const child = spawn(process.execPath, [resolve('.output/server/index.mjs')], {
    env: { ...process.env, NITRO_HOST: '127.0.0.1', NITRO_PORT: String(port), NUXT_PUBLIC_API_BASE: `http://127.0.0.1:${upstream.address().port}` },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  child.stdout.on('data', chunk => { output = (output + chunk).slice(-2000) })
  child.stderr.on('data', chunk => { output = (output + chunk).slice(-2000) })
  const request = () => fetch(`http://127.0.0.1:${port}/api/mangrove/catalog`, { headers: { cookie: 'test-only=private', authorization: 'Bearer test-only' } })
  try {
    let response
    for (let i = 0; i < 60; i++) {
      if (child.exitCode !== null) throw new Error(output)
      try { response = await request(); break } catch { await new Promise(resolve => setTimeout(resolve, 100)) }
    }
    assert.ok(response, output)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.equal((await response.json()).layers[0].year, 2025)
    assert.equal(upstreamCookie, undefined)
    assert.equal(upstreamAuthorization, undefined)
    mode = 'empty'
    assert.deepEqual((await (await request()).json()).layers, [])
    for (mode of ['malformed', 'failed']) {
      const failed = await request()
      assert.equal(failed.status, 502)
      assert.equal((await failed.json()).data, undefined)
    }
  } finally {
    child.kill()
    await new Promise(resolve => upstream.close(resolve))
  }
})
