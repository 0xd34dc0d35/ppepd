<script setup>
import { loadMangroveMapRuntime } from '~/utils/mangrove-map.client'

const props = defineProps({ layer: { type: Object, default: null }, overlays: { type: Array, default: () => [] }, opacity: { type: Number, default: 0.85 }, visible: { type: Boolean, default: true } })
const emit = defineEmits(['status', 'feature', 'overlay-error'])
const container = ref(null)
const mapHost = ref(null)
const status = ref('loading')
const message = ref('Menyiapkan peta…')
const expanded = ref(false)
const fullscreenError = ref('')
let restoreFocus
let map, runtime, observer, timer
let disposed = false
let styleReady = false
let generation = 0
let mainSource = null
let mainFill = null
const sourceTitles = new Map()

function setStatus(value, detail = '') {
  status.value = value
  message.value = detail
  emit('status', { state: value, message: detail })
}
function armTimeout() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (status.value === 'loading') setStatus('error', 'Pemuatan peta terlalu lama. Periksa koneksi lalu coba lagi.')
  }, 25000)
}
function resetView() {
  if (!map) return
  const extent = props.layer?.extent || [95, -11, 141, 6]
  map.fitBounds([[extent[0], extent[1]], [extent[2], extent[3]]], { padding: 32, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500 })
}
function onFullscreenChange() {
  expanded.value = document.fullscreenElement === mapHost.value
  if (!expanded.value) restoreFocus?.focus()
  nextTick(() => map?.resize())
}
async function toggleFullscreen(event) {
  fullscreenError.value = ''
  restoreFocus = event.currentTarget
  try {
    if (expanded.value) {
      if (document.fullscreenElement === mapHost.value) await document.exitFullscreen()
      else { expanded.value = false; restoreFocus.focus(); nextTick(() => map?.resize()) }
    } else if (mapHost.value.requestFullscreen && document.fullscreenEnabled) {
      await mapHost.value.requestFullscreen()
    } else {
      expanded.value = true
      nextTick(() => map?.resize())
    }
  } catch {
    if (!expanded.value) { expanded.value = true; nextTick(() => map?.resize()) }
    else fullscreenError.value = 'Layar penuh belum dapat ditutup. Tekan Esc untuk keluar.'
  }
}
function onEscape(event) {
  if (event.key === 'Tab' && expanded.value && !document.fullscreenElement) {
    const focusable = [...mapHost.value.querySelectorAll('button, a[href], [tabindex="0"]')].filter(element => element.offsetParent !== null)
    const first = focusable[0], last = focusable.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
  if (event.key === 'Escape' && expanded.value && !document.fullscreenElement) {
    expanded.value = false
    restoreFocus?.focus()
    nextTick(() => map?.resize())
  }
}
function updatePresentation() {
  if (!map || !mainFill || !map.getLayer(mainFill)) return
  map.setPaintProperty(mainFill, 'fill-opacity', props.opacity)
  map.setLayoutProperty(mainFill, 'visibility', props.visible ? 'visible' : 'none')
  if (!props.visible) emit('feature', null)
}
async function syncLayers() {
  if (!map || !styleReady || !runtime || disposed) return
  const run = ++generation
  emit('feature', null)
  clearTimeout(timer)
  mainSource = null
  mainFill = null
  sourceTitles.clear()
  for (const layer of [...map.getStyle().layers].reverse()) if (layer.id.startsWith('sippem-')) map.removeLayer(layer.id)
  for (const id of Object.keys(map.getStyle().sources)) if (id.startsWith('sippem-')) map.removeSource(id)
  const main = props.layer
  if (!main) { setStatus('empty', 'Belum ada edisi mangrove yang tersedia.'); return }
  setStatus('loading', `Memuat ${main.title}…`)
  armTimeout()
  // Context layers go below the thematic layer and keep separate legends.
  await Promise.all([...props.overlays, main].map(async (record, index) => {
    const id = `sippem-${index}`
    const isMain = record.id === main.id
    try {
      const archive = new runtime.PMTiles(record.url)
      const [header, metadata] = await Promise.all([archive.getHeader(), archive.getMetadata()])
      if (disposed || generation !== run) return
      const sourceLayer = metadata.vector_layers?.[0]?.id
      if (!sourceLayer || header.tileType !== 1) throw new Error('Format layer tidak sesuai')
      runtime.protocol.add(archive)
      sourceTitles.set(id, record.title)
      if (isMain) mainSource = id
      map.addSource(id, { type: 'vector', url: `pmtiles://${record.url}`, minzoom: header.minZoom, maxzoom: header.maxZoom,
        attribution: '<a href="https://ppepd.kemenlh.go.id/sippem/peta-mangrove" target="_blank" rel="noopener">Katalog SI-PPEM</a>' })
      if (isMain || record.kind === 'habitat') {
        const entries = record.categories.flatMap(entry => [entry.value, entry.color])
        const fill = record.field && entries.length ? ['match', ['to-string', ['get', record.field]], ...entries, '#A6B2AE'] : record.color
        map.addLayer({ id: `${id}-fill`, type: 'fill', source: id, 'source-layer': sourceLayer,
          paint: { 'fill-color': fill, 'fill-opacity': isMain ? props.opacity : 0.2 } })
        if (isMain) mainFill = `${id}-fill`
      } else {
        map.addLayer({ id: `${id}-line`, type: 'line', source: id, 'source-layer': sourceLayer,
          minzoom: record.kind === 'village' ? 9 : record.kind === 'grid' ? 6 : 0,
          paint: { 'line-color': record.kind === 'grid' ? '#AE5104' : '#51625E', 'line-width': 0.8, 'line-opacity': 0.7 } })
      }
      if (mainFill && map.getLayer(mainFill)) map.moveLayer(mainFill)
      updatePresentation()
    } catch {
      if (disposed || generation !== run) return
      if (isMain) { clearTimeout(timer); setStatus('error', `${record.title} gagal dimuat. Peta dasar bukan data mangrove.`) }
      else emit('overlay-error', `${record.title} gagal dimuat.`)
    }
  }))
}
async function startMap() {
  setStatus('loading', 'Menyiapkan peta…')
  armTimeout()
  try {
    runtime = await loadMangroveMapRuntime()
    if (disposed) return
    map = new runtime.maplibre.Map({
      container: container.value,
      style: { version: 8,
        sources: { osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors' } },
        layers: [{ id: 'osm', type: 'raster', source: 'osm', paint: { 'raster-saturation': -0.65, 'raster-opacity': 0.7 } }] },
      center: [118, -2.5], zoom: 4, minZoom: 2, maxZoom: 18, attributionControl: true,
      locale: { 'NavigationControl.ZoomIn': 'Perbesar', 'NavigationControl.ZoomOut': 'Perkecil', 'NavigationControl.ResetBearing': 'Arah utara', 'FullscreenControl.Enter': 'Layar penuh', 'FullscreenControl.Exit': 'Keluar layar penuh' },
    })
    map.addControl(new runtime.maplibre.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new runtime.maplibre.ScaleControl({ unit: 'metric' }), 'bottom-left')
    observer = new ResizeObserver(() => map?.resize())
    observer.observe(container.value)
    resetView()
    map.on('load', () => { styleReady = true; syncLayers() })
    map.on('idle', () => {
      if (mainSource && map.getSource(mainSource) && status.value === 'loading' && map.isSourceLoaded(mainSource)) { clearTimeout(timer); setStatus('ready') }
    })
    map.on('error', event => {
      if (event.sourceId === mainSource && mainSource) { clearTimeout(timer); setStatus('error', 'Sebagian data mangrove gagal dimuat. Coba muat ulang peta.') }
      else if (sourceTitles.has(event.sourceId)) emit('overlay-error', `${sourceTitles.get(event.sourceId)} gagal dimuat.`)
    })
    map.on('click', event => {
      if (!mainFill || !map.getLayer(mainFill) || !props.visible || status.value !== 'ready') return
      const features = map.queryRenderedFeatures([[event.point.x - 3, event.point.y - 3], [event.point.x + 3, event.point.y + 3]], { layers: [mainFill] })
      emit('feature', features[0]?.properties || null)
    })
  } catch { clearTimeout(timer); setStatus('error', 'Peta tidak dapat dijalankan pada perangkat ini. Coba muat ulang halaman.') }
}
function retry() {
  if (map && styleReady) syncLayers()
  else { observer?.disconnect(); map?.remove(); map = null; styleReady = false; startMap() }
}
watch(() => [props.layer, props.overlays], syncLayers)
watch(() => [props.opacity, props.visible], updatePresentation)
onMounted(() => { document.addEventListener('fullscreenchange', onFullscreenChange); document.addEventListener('keydown', onEscape); startMap() })
onBeforeUnmount(() => { document.removeEventListener('fullscreenchange', onFullscreenChange); document.removeEventListener('keydown', onEscape); disposed = true; generation++; clearTimeout(timer); observer?.disconnect(); map?.remove(); map = null })
</script>

<template>
  <div ref="mapHost" class="mangrove-map relative bg-surface-3" :class="{ 'mangrove-map-expanded': expanded }">
    <div ref="container" class="mangrove-map-canvas" aria-label="Peta interaktif sebaran mangrove Indonesia" />
    <div class="absolute top-3 left-3 right-16 flex flex-wrap gap-2">
      <button class="btn btn-outline bg-surface shadow-klh-1 text-xs px-2" type="button" @click="resetView">Indonesia penuh</button>
      <button class="btn btn-outline bg-surface shadow-klh-1 text-xs px-2" type="button" :aria-pressed="expanded" @click="toggleFullscreen">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path v-if="!expanded" d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><path v-else d="M3 8h5V3m8 0v5h5M8 21v-5H3m13 5v-5h5"/></svg>
        {{ expanded ? 'Keluar layar penuh' : 'Layar penuh' }}
      </button>
    </div>
    <p v-if="fullscreenError" class="absolute top-28 left-3 right-3 rounded-lg bg-warning-bg p-3 text-sm text-warning" role="alert">{{ fullscreenError }}</p>
    <div v-if="status === 'loading'" class="absolute top-16 left-3 right-14 sm:right-auto max-w-sm rounded-lg bg-surface px-3 py-2 text-sm text-ink-700 shadow-klh-1" role="status">{{ message }}</div>
    <div v-if="status === 'error' || status === 'empty'" class="absolute left-3 right-3 top-16 rounded-xl border border-warning-line bg-warning-bg p-4 text-sm text-warning" role="alert">
      <p>{{ message }}</p><button v-if="status === 'error'" class="btn btn-outline mt-2 bg-surface" type="button" @click="retry">Coba lagi</button>
    </div>
    <div v-if="status === 'ready' && (visible || overlays.length)" class="absolute left-3 bottom-12 max-w-[calc(100%-4rem)] rounded-xl border border-line bg-surface p-3 shadow-klh-1">
      <p v-if="visible" class="text-xs font-semibold text-ink-700 mb-2">Kerapatan · edisi {{ layer.year }}</p>
      <ul v-if="visible" class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-700"><li v-for="entry in layer.categories" :key="entry.value" class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm border border-ink-900/20" :style="{ backgroundColor: entry.color }" aria-hidden="true" />{{ entry.label }}</li><li class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm bg-ink-300" aria-hidden="true" />Kelas lain / tidak tercatat</li></ul>
      <ul v-if="overlays.length" class="mt-2 pt-2 border-t border-line text-xs text-ink-700 space-y-1"><li v-for="entry in overlays" :key="entry.id" class="flex items-center gap-2"><span class="w-3 h-3 border border-current shrink-0" :style="{ color: entry.kind === 'grid' ? '#AE5104' : entry.kind === 'habitat' ? entry.color : '#51625E', backgroundColor: entry.kind === 'habitat' ? entry.color + '33' : 'transparent' }" aria-hidden="true" />{{ entry.title }}</li></ul>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.mangrove-map { height: 100%; min-height: 260px; }
.mangrove-map-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.mangrove-map:fullscreen { width: 100%; height: 100%; }
.mangrove-map-expanded { position: fixed; inset: 0; z-index: 1000; width: 100vw; height: 100dvh; }
.mangrove-map :deep(.maplibregl-ctrl button) { width: 44px; height: 44px; }
.mangrove-map :deep(.maplibregl-ctrl-attrib) { max-width: calc(100vw - 2rem); font-size: 12px; }
@media (max-width: 1023px) { .mangrove-map { height: 420px; } .mangrove-map-expanded { height: 100dvh; } }
</style>
