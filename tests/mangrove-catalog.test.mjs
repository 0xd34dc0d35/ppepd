import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizeMangroveCatalog } from '../app/utils/mangrove-catalog.ts'

const layer = (overrides = {}) => ({
  id: 'edition-2025', title: 'Mangrove 2025', year: 2025, is_active: true,
  data_url: 'https://ppepd.kemenlh.go.id/storage/ppepd/caches/2025.pmtiles',
  min_zoom: 0, max_zoom: 22,
  metadata: { min_zoom: 0, max_zoom: 18, vector_layers: [{ id: 'sql_statement' }], recovery: { original_catalog_metadata_available: false } },
  style: { field: 'KTTJ', categories: [{ value: 'MANGROVE LEBAT', label: 'Mangrove Lebat', fill: '#1b5e20' }] },
  ...overrides,
})

test('uses native cache zoom and preserves the exact class value for map styling', () => {
  const [actual] = normalizeMangroveCatalog([layer()])
  assert.equal(actual.maxZoom, 18)
  assert.equal(actual.categories[0].value, 'MANGROVE LEBAT')
  assert.equal(actual.metadataComplete, false)
  assert.equal(actual.provider, null)
})

test('rejects inactive, restricted, inaccessible, unsupported and contradictory editions', () => {
  for (const overrides of [
    { is_active: false }, { is_active: undefined }, { restricted: true }, { can_access: false },
    { title: 'Kelas tutupan tajuk Mangrove Nasional 2024' }, { year: 2024 },
    { metadata: {} }, { data_url: 'https://cdn.example.com/map.pmtiles' },
    { data_url: 'http://kantor/private.pmtiles' }, { data_url: 'https://ppepd.kemenlh.go.id/private/data.pmtiles' },
    { data_url: 'https://user:password@ppepd.kemenlh.go.id/storage/ppepd/a.pmtiles' },
    { data_url: 'https://ppepd.kemenlh.go.id/storage/ppepd/a.pmtiles?token=secret' },
  ]) assert.deepEqual(normalizeMangroveCatalog([layer(overrides)]), [])
})

test('handles an empty catalog and rejects malformed upstream payloads', () => {
  assert.deepEqual(normalizeMangroveCatalog([]), [])
  assert.deepEqual(normalizeMangroveCatalog([null, false, {}, 'invalid']), [])
  assert.throws(() => normalizeMangroveCatalog(null))
})

test('orders editions newest first, removes duplicates and keeps habitat separate', () => {
  const result = normalizeMangroveCatalog([
    layer({ id: 'older', title: 'Mangrove 2021', year: 2021 }), layer(), layer(),
    layer({ id: 'habitat', title: 'Potensi habitat mangrove / KLM', year: null }),
  ])
  assert.deepEqual(result.map(row => row.id), ['edition-2025', 'older', 'habitat'])
  assert.equal(result[2].kind, 'habitat')
})

test('does not treat recovered metadata as complete even when provider is present', () => {
  assert.equal(normalizeMangroveCatalog([layer({ provider: 'Produsen', attribution: 'Sumber' })])[0].metadataComplete, false)
})
