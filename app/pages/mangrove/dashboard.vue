<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({ layout: 'map' })

const route = useRoute()
const { visibleNav } = useRole()

const drawerOpen = ref(false)
const openDrawer = () => { drawerOpen.value = true }
const closeDrawer = () => { drawerOpen.value = false }
watch(() => route.path, closeDrawer)

useSeoMeta({
  title: 'Dashboard Ekosistem Mangrove | PPEPD',
  description: 'Dashboard situasi ekosistem mangrove Indonesia – Direktorat PPEPD KLH/BPLH.',
})

// ── Row 1: KPI ──────────────────────────────────────────────
const kpis = [
  { label: 'Luas Mangrove',      value: '3,45 jt', unit: 'hektare',    trend: '+42rb', up: true,  num: 3450000, dec: 0, sfx: '', display: '3,45 jt' },
  { label: 'Kawasan Prioritas',  value: '37',       unit: 'unit',       trend: null,   up: null,  num: 37,      dec: 0, sfx: '', display: '37'      },
  { label: 'Laju Pemulihan',     value: '34%',      unit: 'turun 2025', trend: '+34%', up: true,  num: 34,      dec: 0, sfx: '%', display: '34%'   },
  { label: 'Kerapatan Baik',     value: '58%',      unit: 'dari total', trend: '+2%',  up: true,  num: 58,      dec: 0, sfx: '%', display: '58%'   },
]

const kpiDisplay = ref(kpis.map(k => k.display))

function startCountUp() {
  const simpleKpis = [
    { idx: 1, num: 37,  dec: 0, sfx: '' },
    { idx: 2, num: 34,  dec: 0, sfx: '%' },
    { idx: 3, num: 58,  dec: 0, sfx: '%' },
  ]
  const dur = 750
  const t0 = performance.now()
  const tick = (now: number) => {
    const p = Math.min((now - t0) / dur, 1)
    const ease = 1 - (1 - p) ** 3
    simpleKpis.forEach(({ idx, num, dec, sfx }) => {
      const v = num * ease
      kpiDisplay.value[idx] = (dec > 0 ? v.toFixed(dec).replace('.', ',') : Math.round(v).toString()) + sfx
    })
    if (p < 1) requestAnimationFrame(tick)
    else kpis.forEach((k, i) => { kpiDisplay.value[i] = k.display })
  }
  requestAnimationFrame(tick)
}

// ── Row 2, Col 1: Status ─────────────────────────────────────
const statusData = [
  { label: 'Kerapatan Baik',    count: 2001, color: '#005952', pct: 58 },
  { label: 'Kerapatan Sedang',  count: 1104, color: '#F97910', pct: 32 },
  { label: 'Kerapatan Jarang',  count: 345,  color: '#C03A2B', pct: 10 },
]

const ancaman = [
  { label: 'Konversi ke tambak/permukiman', lokasi: 'Sulawesi, Kalimantan', level: 'kritis'  },
  { label: 'Penebangan illegal',            lokasi: 'Papua, Kaltim',        level: 'kritis'  },
  { label: 'Pencemaran pesisir',            lokasi: 'Teluk Jakarta, Surabaya', level: 'waspada' },
  { label: 'Abrasi pantai',                 lokasi: 'Pantai Utara Jawa',    level: 'waspada' },
]

// ── Loading state ────────────────────────────────────────────
const isLoading = ref(true)
const mapLoaded = ref(false)
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
    startCountUp()
  }, 1400)
})

// ── Row 2, Col 2: Peta ───────────────────────────────────────
const onMapReady = (map: any) => {
  mapLoaded.value = true
  map.addSource('mangrove-big', {
    type: 'raster',
    tiles: ['https://geoservices.big.go.id/rbi/rest/services/BASEMAP/Rupabumi_Indonesia/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&layers=show:262&size=256,256&imageSR=3857&format=png32&transparent=true&f=image'],
    tileSize: 256,
    attribution: '&copy; KLH/BPLH 2026',
  })
  map.addLayer({ id: 'mangrove-big', type: 'raster', source: 'mangrove-big' })
}

// ── Row 2, Col 3: Gallery ────────────────────────────────────
const daftarKawasan = [
  { id: 'teluk-jakarta',  nama: 'Teluk Jakarta',       provinsi: 'DKI Jakarta',       iki: 62, hue: 145 },
  { id: 'kutai',          nama: 'Kutai Timur',         provinsi: 'Kalimantan Timur',   iki: 78, hue: 155 },
  { id: 'teluk-bintuni',  nama: 'Teluk Bintuni',       provinsi: 'Papua Barat',        iki: 85, hue: 150 },
  { id: 'segara-anakan',  nama: 'Segara Anakan',       provinsi: 'Jawa Tengah',        iki: 44, hue: 160 },
  { id: 'berbak',         nama: 'Berbak Sembilang',    provinsi: 'Sumatera Selatan',   iki: 71, hue: 140 },
  { id: 'raja-ampat',     nama: 'Raja Ampat',          provinsi: 'Papua Barat Daya',   iki: 91, hue: 165 },
]

function thumbStyle(hue: number) {
  return { background: `linear-gradient(135deg, hsl(${hue},50%,24%) 0%, hsl(${hue + 15},55%,16%) 100%)` }
}
function ikiColor(v: number) { return v >= 65 ? '#005952' : v >= 45 ? '#AE5104' : '#C03A2B' }

// ── Row 3, Col 1: Sebaran Luas per Pulau ─────────────────────
const sebaranData = [
  { label: 'Kalimantan', pct: 32, color: '#005952' },
  { label: 'Papua',      pct: 28, color: '#2E7D5F' },
  { label: 'Sumatera',   pct: 21, color: '#147DEF' },
  { label: 'Sulawesi',   pct: 11, color: '#F97910' },
  { label: 'Jawa+Bali',  pct:  5, color: '#8B7D6B' },
  { label: 'Lainnya',    pct:  3, color: '#B0A898' },
]

const sebaranSegments = computed(() => {
  let offset = 0
  return sebaranData.map(d => {
    const seg = { ...d, offset }
    offset += d.pct
    return seg
  })
})

// ── Row 3, Col 2: Tren Luas Mangrove ─────────────────────────
const trenYears  = ['2019', '2020', '2021', '2022', '2023', '2024', '2025']
const trenSeries = [
  { nama: 'Kalimantan', vals: [1080, 1095, 1102, 1110, 1118, 1124, 1132], color: '#005952' },
  { nama: 'Papua',      vals: [920,  928,  935,  940,  944,  948,  952],  color: '#147DEF' },
  { nama: 'Sumatera',   vals: [710,  705,  700,  698,  702,  706,  708],  color: '#F97910' },
]

const trenMin = computed(() => Math.min(...trenSeries.flatMap(s => s.vals)) - 20)
const trenMax = computed(() => Math.max(...trenSeries.flatMap(s => s.vals)) + 20)

function trenPath(vals: number[], w = 280, h = 60) {
  const mn = trenMin.value, mx = trenMax.value, r = mx - mn || 1
  const step = w / (vals.length - 1)
  return vals.map((v, i) =>
    `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(1)},${(h - ((v - mn) / r) * h).toFixed(1)}`
  ).join(' ')
}
</script>

<template>
  <div class="w-full h-full flex flex-col bg-surface-bg overflow-hidden">

    <KlhSiteHeader class="shrink-0">
      <template #actions>
        <NuxtLink to="/mangrove" class="btn btn-outline btn-sm" aria-label="Kembali ke Mangrove">
          <svg class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          <span class="hidden sm:inline">Mangrove</span>
        </NuxtLink>
      </template>
    </KlhSiteHeader>

    <!-- MAIN CONTENT: 3 rows -->
    <div id="konten-utama" class="flex-1 min-h-0 flex flex-col gap-2 px-6 py-3" style="z-index:1; position:relative">
    <h1 class="sr-only">Dashboard Ekosistem Mangrove</h1>

      <!-- ═══ ROW 1: KPI STRIP ══════════════════════════════════════ -->
      <div class="grid grid-cols-4 gap-2 shrink-0">
        <div v-for="(kpi, index) in kpis" :key="kpi.label"
          class="bg-surface border border-line rounded-xl px-4 py-2.5 flex flex-col gap-0.5 shadow-klh-1">
          <template v-if="isLoading">
            <div class="h-2.5 w-20 rounded skel"></div>
            <div class="flex items-end gap-2 mt-1">
              <div class="h-7 w-16 rounded skel"></div>
              <div class="h-3 w-10 rounded skel mb-0.5"></div>
              <div class="ml-auto h-3 w-8 rounded skel mb-0.5"></div>
            </div>
          </template>
          <template v-else>
            <span class="text-[11px] font-bold uppercase tracking-widest text-ink-500">{{ kpi.label }}</span>
            <div class="flex items-end gap-1.5">
              <span class="text-ink-900 text-xl font-bold leading-none tracking-tight tabular-nums">{{ kpiDisplay[index] }}</span>
              <span class="text-ink-400 text-[11px] mb-0.5">{{ kpi.unit }}</span>
              <span v-if="kpi.trend" class="ml-auto text-[11px] font-bold mb-0.5"
                :class="kpi.up === true ? 'text-klh-green-600' : kpi.up === false ? 'text-danger' : 'text-ink-400'"
              >{{ kpi.trend }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- ═══ ROW 2: Status | Peta | Gallery ═══════════════════════ -->
      <div class="flex-[1.4] min-h-0 grid gap-2" style="grid-template-columns: 1fr 2fr 1fr">

        <!-- Col 1: Status + Ancaman -->
        <div class="flex flex-col gap-2 min-h-0">
          <div class="flex-1 min-h-0 bg-surface border border-line rounded-xl p-3 shadow-klh-1 flex flex-col">
            <div class="flex items-center justify-between shrink-0 mb-2">
              <p class="text-[11px] font-bold uppercase tracking-widest text-ink-500">Kerapatan Mangrove</p>
              <span class="text-[11px] text-ink-400">3,45 jt ha</span>
            </div>
            <template v-if="isLoading">
              <div class="flex-1 min-h-0 flex gap-3">
                <div class="flex flex-col items-center justify-center shrink-0 w-20 gap-1.5">
                  <div class="h-9 w-12 rounded skel"></div>
                  <div class="h-2.5 w-14 rounded skel"></div>
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-2">
                  <div v-for="i in 3" :key="i" class="flex items-center gap-2">
                    <div class="h-2.5 w-20 rounded skel shrink-0"></div>
                    <div class="flex-1 h-3 rounded-full skel"></div>
                    <div class="h-2.5 w-7 rounded skel shrink-0"></div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex-1 min-h-0 flex gap-3">
                <div class="flex flex-col items-center justify-center shrink-0 w-20">
                  <span class="text-4xl font-bold text-klh-green-600 leading-none">58%</span>
                  <span class="text-[11px] text-ink-500 text-center leading-tight mt-1">kerapatan<br>baik</span>
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-2">
                  <div v-for="s in statusData" :key="s.label" class="flex items-center gap-2">
                    <span class="text-[11px] text-ink-500 w-20 shrink-0 truncate">{{ s.label }}</span>
                    <div class="flex-1 h-3 rounded-full overflow-hidden bg-ink-900/5">
                      <div class="h-full rounded-full flex items-center justify-end pr-1.5"
                        :style="{ width: s.pct + '%', background: s.color + '33' }">
                        <span class="text-[11px] font-bold" :style="{ color: s.color }">{{ s.pct }}%</span>
                      </div>
                    </div>
                    <span class="text-[11px] text-ink-400 w-9 text-right shrink-0">{{ s.count.toLocaleString('id') }}</span>
                  </div>
                </div>
              </div>
              <div class="shrink-0 flex items-center gap-3 mt-2 pt-2 border-t border-line">
                <div v-for="s in statusData" :key="s.label" class="flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full" :style="{ background: s.color }"></span>
                  <span class="text-[11px] text-ink-500">{{ s.label }}</span>
                </div>
              </div>
            </template>
          </div>

          <div class="flex-1 min-h-0 bg-surface border border-line rounded-xl p-3 shadow-klh-1 flex flex-col">
            <p class="text-[11px] font-bold uppercase tracking-widest text-ink-500 shrink-0 mb-2">Ancaman Prioritas</p>
            <template v-if="isLoading">
              <ul class="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
                <li v-for="i in 4" :key="i" class="flex items-start gap-2 py-1.5 border-b border-line last:border-0">
                  <div class="w-1.5 h-1.5 rounded-full mt-1 shrink-0 skel"></div>
                  <div class="flex-1 min-w-0 flex flex-col gap-1">
                    <div class="h-2.5 w-full rounded skel"></div>
                    <div class="h-2 w-3/5 rounded skel"></div>
                  </div>
                  <div class="h-4 w-12 rounded skel shrink-0"></div>
                </li>
              </ul>
            </template>
            <template v-else>
              <ul class="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
                <li v-for="a in ancaman" :key="a.label"
                  class="flex items-start gap-2 py-1.5 border-b border-line last:border-0">
                  <span class="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                    :style="{ background: a.level === 'kritis' ? '#C03A2B' : '#F97910' }"></span>
                  <div class="flex-1 min-w-0">
                    <p class="text-ink-700 text-[11px] font-medium leading-tight">{{ a.label }}</p>
                    <p class="text-ink-500 text-[11px] truncate">{{ a.lokasi }}</p>
                  </div>
                  <span class="text-[11px] font-bold uppercase shrink-0 px-1.5 py-0.5 rounded"
                    :style="a.level === 'kritis' ? { background: '#FBE3E0', color: '#C03A2B' } : { background: '#F9E4D2', color: '#AE5104' }"
                  >{{ a.level }}</span>
                </li>
              </ul>
            </template>
          </div>
        </div>

        <!-- Col 2: Peta -->
        <div class="min-h-0 bg-surface border border-line rounded-xl shadow-klh-1 overflow-hidden relative">
          <ClientOnly>
            <MapLibre @ready="onMapReady" class="w-full h-full" />
          </ClientOnly>
          <Transition name="fade">
            <div v-if="!mapLoaded" class="absolute inset-0 skel" style="z-index:2"></div>
          </Transition>
          <div class="absolute top-2.5 left-3 pointer-events-none" style="z-index:1">
            <span class="text-[11px] font-bold uppercase tracking-widest text-white/80 drop-shadow bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-md">Sebaran Mangrove</span>
          </div>
        </div>

        <!-- Col 3: Gallery -->
        <div class="min-h-0 bg-surface border border-line rounded-xl p-3 shadow-klh-1 flex flex-col">
          <p class="text-[11px] font-bold uppercase tracking-widest text-ink-500 shrink-0 mb-2">Kawasan Mangrove Utama</p>
          <template v-if="isLoading">
            <div class="flex-1 min-h-0 grid grid-cols-2 gap-2 overflow-hidden">
              <div v-for="i in 6" :key="i" class="rounded-lg skel"></div>
            </div>
          </template>
          <template v-else>
            <div class="flex-1 min-h-0 grid grid-cols-2 gap-2 overflow-hidden">
              <div v-for="d in daftarKawasan" :key="d.id"
                class="relative rounded-lg overflow-hidden flex flex-col justify-end cursor-pointer group"
                :style="thumbStyle(d.hue)">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <span class="absolute top-1.5 right-1.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                  :style="{ background: ikiColor(d.iki), color: '#fff' }">{{ d.iki }}</span>
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white/20 group-hover:text-white/30 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 2c0 0-4 3-4 7 0 2 1.5 4 4 5 2.5-1 4-3 4-5 0-4-4-7-4-7z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 14v8M9 19h6"/>
                  </svg>
                </div>
                <div class="relative z-10 px-2 pb-1.5">
                  <p class="text-white text-[11px] font-semibold leading-tight truncate">{{ d.nama }}</p>
                  <p class="text-white/55 text-[11px] truncate">{{ d.provinsi }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- ═══ ROW 3: Sebaran Pulau | Tren Luas ═══════════════════ -->
      <div class="flex-1 min-h-0 grid grid-cols-2 gap-2">

        <!-- Col 1: Sebaran per Pulau -->
        <div class="min-h-0 bg-surface border border-line rounded-xl p-3 shadow-klh-1 flex flex-col">
          <div class="flex items-center justify-between shrink-0 mb-2">
            <p class="text-[11px] font-bold uppercase tracking-widest text-ink-500">Sebaran per Pulau</p>
            <span class="text-[11px] text-ink-400">% luas mangrove 2025</span>
          </div>
          <template v-if="isLoading">
            <div class="shrink-0 h-5 rounded-full skel mb-2.5"></div>
            <div class="flex-1 min-h-0 flex flex-col justify-between">
              <div v-for="i in 6" :key="i" class="flex items-center gap-2.5">
                <div class="h-2.5 w-20 rounded skel shrink-0"></div>
                <div class="flex-1 h-3 rounded-full skel"></div>
                <div class="h-2.5 w-8 rounded skel shrink-0"></div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="shrink-0 h-5 rounded-full overflow-hidden flex mb-2.5">
              <div v-for="s in sebaranSegments" :key="s.label"
                class="h-full" :style="{ width: s.pct + '%', background: s.color }"></div>
            </div>
            <div class="flex-1 min-h-0 flex flex-col justify-between">
              <div v-for="t in sebaranData" :key="t.label" class="flex items-center gap-2.5">
                <div class="flex items-center gap-1.5 w-20 shrink-0">
                  <span class="w-2 h-2 rounded-sm shrink-0" :style="{ background: t.color }"></span>
                  <span class="text-[11px] text-ink-500 truncate">{{ t.label }}</span>
                </div>
                <div class="flex-1 h-3 rounded-full overflow-hidden bg-ink-900/5">
                  <div class="h-full rounded-full" :style="{ width: t.pct + '%', background: t.color + '55' }"></div>
                </div>
                <span class="text-[11px] font-bold text-ink-500 w-8 text-right shrink-0">{{ t.pct }}%</span>
              </div>
            </div>
            <p class="text-[11px] text-ink-400 mt-2 shrink-0">Distribusi luas mangrove nasional · KLH/BPLH 2026</p>
          </template>
        </div>

        <!-- Col 2: Tren Luas Mangrove -->
        <div class="min-h-0 bg-surface border border-line rounded-xl p-3 shadow-klh-1 flex flex-col">
          <div class="flex items-center justify-between shrink-0 mb-1">
            <p class="text-[11px] font-bold uppercase tracking-widest text-ink-500">Tren Luas Mangrove (ribu ha)</p>
            <template v-if="isLoading">
              <div class="flex items-center gap-3">
                <div v-for="i in 3" :key="i" class="flex items-center gap-1">
                  <div class="w-4 h-0.5 rounded-full skel"></div>
                  <div class="h-2 w-8 rounded skel"></div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center gap-3">
                <div v-for="s in trenSeries" :key="s.nama" class="flex items-center gap-1">
                  <span class="w-4 h-0.5 rounded-full" :style="{ background: s.color }"></span>
                  <span class="text-[11px] text-ink-500">{{ s.nama }}</span>
                </div>
              </div>
            </template>
          </div>
          <template v-if="isLoading">
            <div class="flex-1 min-h-0 flex flex-col">
              <div class="flex-1 min-h-0 rounded skel"></div>
              <div class="flex justify-between shrink-0 mt-1">
                <div v-for="i in 7" :key="i" class="h-2 w-5 rounded skel"></div>
              </div>
            </div>
            <div class="h-2 w-56 rounded skel mt-1.5 shrink-0"></div>
          </template>
          <template v-else>
            <div class="flex-1 min-h-0 flex flex-col">
              <div class="flex-1 min-h-0 relative">
                <svg class="w-full h-full" viewBox="0 0 280 60" preserveAspectRatio="none">
                  <line x1="0" y1="15" x2="280" y2="15" stroke="#10201D" stroke-opacity="0.05" stroke-width="1" stroke-dasharray="4 4"/>
                  <line x1="0" y1="30" x2="280" y2="30" stroke="#10201D" stroke-opacity="0.05" stroke-width="1" stroke-dasharray="4 4"/>
                  <line x1="0" y1="45" x2="280" y2="45" stroke="#10201D" stroke-opacity="0.05" stroke-width="1" stroke-dasharray="4 4"/>
                  <path v-for="s in trenSeries" :key="s.nama"
                    :d="trenPath(s.vals, 280, 60)"
                    fill="none" :stroke="s.color" stroke-width="1.8"
                    stroke-linejoin="round" stroke-linecap="round"/>
                  <circle v-for="s in trenSeries" :key="s.nama + '-dot'"
                    cx="280"
                    :cy="trenPath(s.vals, 280, 60).split(' ').at(-1)!.split(',')[1]"
                    r="2.5" :fill="s.color"/>
                </svg>
              </div>
              <div class="flex justify-between shrink-0 mt-1">
                <span v-for="y in trenYears" :key="y" class="text-[11px] text-ink-400">{{ y }}</span>
              </div>
            </div>
            <p class="text-[11px] text-ink-400 mt-1.5 shrink-0">Luas mangrove (ribu ha) per pulau besar · KLH/BPLH 2026</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.router-link-active { @apply text-klh-green-600; }
.fade-backdrop-enter-active, .fade-backdrop-leave-active { transition: opacity 0.25s ease; }
.fade-backdrop-enter-from, .fade-backdrop-leave-to { opacity: 0; }
.slide-drawer-enter-active, .slide-drawer-leave-active { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }
.slide-drawer-enter-from, .slide-drawer-leave-to { transform: translateX(100%); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.skel {
  background: linear-gradient(90deg,
    rgba(16,32,29,0.06) 0%, rgba(16,32,29,0.06) 20%,
    rgba(16,32,29,0.13) 45%, rgba(16,32,29,0.06) 70%,
    rgba(16,32,29,0.06) 100%);
  background-size: 250% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}
@keyframes shimmer {
  0%   { background-position: 140% 0; }
  100% { background-position: -140% 0; }
}
</style>
