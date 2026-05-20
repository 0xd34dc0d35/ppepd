<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: 'map' })

useSeoMeta({
  title: 'Dashboard Ekosistem Mangrove | PPEPD',
  description: 'Dashboard situasi ekosistem mangrove Indonesia – Direktorat PPEPD KLH/BPLH.',
})

// ── Row 1: KPI ──────────────────────────────────────────────
const kpis = [
  { label: 'Luas Mangrove',      value: '3,36 jt', unit: 'hektare',    trend: '+42rb', up: true,  num: 3360000, dec: 0, sfx: '', display: '3,36 jt' },
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
  { label: 'Kerapatan Baik',    count: 1948, color: '#1E5C4B', pct: 58 },
  { label: 'Kerapatan Sedang',  count: 1075, color: '#D97B3A', pct: 32 },
  { label: 'Kerapatan Jarang',  count: 337,  color: '#C0392B', pct: 10 },
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
function ikiColor(v: number) { return v >= 65 ? '#1E5C4B' : v >= 45 ? '#D97B3A' : '#C0392B' }

// ── Row 3, Col 1: Sebaran Luas per Pulau ─────────────────────
const sebaranData = [
  { label: 'Kalimantan', pct: 32, color: '#1E5C4B' },
  { label: 'Papua',      pct: 28, color: '#2E7D5F' },
  { label: 'Sumatera',   pct: 21, color: '#5BACD6' },
  { label: 'Sulawesi',   pct: 11, color: '#D97B3A' },
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
  { nama: 'Kalimantan', vals: [1080, 1095, 1102, 1110, 1118, 1124, 1132], color: '#1E5C4B' },
  { nama: 'Papua',      vals: [920,  928,  935,  940,  944,  948,  952],  color: '#5BACD6' },
  { nama: 'Sumatera',   vals: [710,  705,  700,  698,  702,  706,  708],  color: '#D97B3A' },
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
  <div class="w-full h-full flex flex-col bg-brand-cream overflow-hidden">

    <!-- Ambient blobs -->
    <div class="fixed inset-0 pointer-events-none" style="z-index:0">
      <div class="absolute top-[-10%] left-[-5%] w-[45%] h-[60%] rounded-full bg-brand-green/5 blur-[100px]"></div>
      <div class="absolute bottom-[-10%] right-[-5%] w-[40%] h-[55%] rounded-full bg-emerald-400/5 blur-[100px]"></div>
    </div>

    <!-- NAVBAR -->
    <nav class="relative shrink-0 flex items-center justify-between px-6 backdrop-blur-xl bg-white/90 border-b border-brand-green/10 shadow-sm" style="z-index:10; height:50px">
      <NuxtLink to="/" class="text-xl font-black tracking-tighter gradient-text leading-none">PPEPD</NuxtLink>
      <div class="flex gap-8 text-xs font-bold tracking-wide uppercase text-brand-charcoal/50">
        <NuxtLink to="/" class="hover:text-brand-green transition-colors">Beranda</NuxtLink>
        <NuxtLink to="/data" class="hover:text-brand-green transition-colors">Data</NuxtLink>
        <NuxtLink to="/layanan" class="hover:text-brand-green transition-colors">Layanan</NuxtLink>
        <NuxtLink to="/about" class="hover:text-brand-green transition-colors">Tentang</NuxtLink>
        <NuxtLink to="/hubungi" class="hover:text-brand-green transition-colors">Hubungi</NuxtLink>
      </div>
      <NuxtLink to="/mangrove" class="flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs font-bold bg-brand-green text-white hover:bg-brand-green-dark transition-colors shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 18-6-6 6-6"/></svg>
        Mangrove
      </NuxtLink>
    </nav>

    <!-- MAIN CONTENT: 3 rows -->
    <div class="flex-1 min-h-0 flex flex-col gap-2 px-6 py-3" style="z-index:1; position:relative">

      <!-- ═══ ROW 1: KPI STRIP ══════════════════════════════════════ -->
      <div class="grid grid-cols-4 gap-2 shrink-0">
        <div v-for="(kpi, index) in kpis" :key="kpi.label"
          class="bg-white/80 backdrop-blur-sm border border-brand-green/10 rounded-xl px-4 py-2.5 flex flex-col gap-0.5 shadow-sm">
          <template v-if="isLoading">
            <div class="h-2.5 w-20 rounded skel"></div>
            <div class="flex items-end gap-2 mt-1">
              <div class="h-7 w-16 rounded skel"></div>
              <div class="h-3 w-10 rounded skel mb-0.5"></div>
              <div class="ml-auto h-3 w-8 rounded skel mb-0.5"></div>
            </div>
          </template>
          <template v-else>
            <span class="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40">{{ kpi.label }}</span>
            <div class="flex items-end gap-1.5">
              <span class="text-brand-charcoal text-xl font-black leading-none tracking-tight tabular-nums">{{ kpiDisplay[index] }}</span>
              <span class="text-brand-charcoal/30 text-[11px] mb-0.5">{{ kpi.unit }}</span>
              <span v-if="kpi.trend" class="ml-auto text-[11px] font-bold mb-0.5"
                :class="kpi.up === true ? 'text-brand-green' : kpi.up === false ? 'text-red-600' : 'text-brand-charcoal/30'"
              >{{ kpi.trend }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- ═══ ROW 2: Status | Peta | Gallery ═══════════════════════ -->
      <div class="flex-[1.4] min-h-0 grid gap-2" style="grid-template-columns: 1fr 2fr 1fr">

        <!-- Col 1: Status + Ancaman -->
        <div class="flex flex-col gap-2 min-h-0">
          <div class="flex-1 min-h-0 bg-white/80 backdrop-blur-sm border border-brand-green/10 rounded-xl p-3 shadow-sm flex flex-col">
            <div class="flex items-center justify-between shrink-0 mb-2">
              <p class="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40">Kerapatan Mangrove</p>
              <span class="text-[10px] text-brand-charcoal/30">3,36 jt ha</span>
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
                  <span class="text-4xl font-black text-brand-green leading-none">58%</span>
                  <span class="text-[9px] text-brand-charcoal/40 text-center leading-tight mt-1">kerapatan<br>baik</span>
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-2">
                  <div v-for="s in statusData" :key="s.label" class="flex items-center gap-2">
                    <span class="text-[10px] text-brand-charcoal/55 w-20 shrink-0 truncate">{{ s.label }}</span>
                    <div class="flex-1 h-3 rounded-full overflow-hidden bg-brand-charcoal/5">
                      <div class="h-full rounded-full flex items-center justify-end pr-1.5"
                        :style="{ width: s.pct + '%', background: s.color + '33' }">
                        <span class="text-[8px] font-bold" :style="{ color: s.color }">{{ s.pct }}%</span>
                      </div>
                    </div>
                    <span class="text-[10px] text-brand-charcoal/30 w-9 text-right shrink-0">{{ s.count.toLocaleString('id') }}</span>
                  </div>
                </div>
              </div>
              <div class="shrink-0 flex items-center gap-3 mt-2 pt-2 border-t border-brand-green/8">
                <div v-for="s in statusData" :key="s.label" class="flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full" :style="{ background: s.color }"></span>
                  <span class="text-[9px] text-brand-charcoal/35">{{ s.label }}</span>
                </div>
              </div>
            </template>
          </div>

          <div class="flex-1 min-h-0 bg-white/80 backdrop-blur-sm border border-brand-green/10 rounded-xl p-3 shadow-sm flex flex-col">
            <p class="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40 shrink-0 mb-2">Ancaman Prioritas</p>
            <template v-if="isLoading">
              <ul class="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
                <li v-for="i in 4" :key="i" class="flex items-start gap-2 py-1.5 border-b border-brand-green/8 last:border-0">
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
                  class="flex items-start gap-2 py-1.5 border-b border-brand-green/8 last:border-0">
                  <span class="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                    :style="{ background: a.level === 'kritis' ? '#C0392B' : '#D97B3A' }"></span>
                  <div class="flex-1 min-w-0">
                    <p class="text-brand-charcoal/80 text-[11px] font-medium leading-tight">{{ a.label }}</p>
                    <p class="text-brand-charcoal/35 text-[10px] truncate">{{ a.lokasi }}</p>
                  </div>
                  <span class="text-[9px] font-bold uppercase shrink-0 px-1.5 py-0.5 rounded"
                    :style="a.level === 'kritis' ? { background:'#C0392B18', color:'#C0392B' } : { background:'#D97B3A18', color:'#D97B3A' }"
                  >{{ a.level }}</span>
                </li>
              </ul>
            </template>
          </div>
        </div>

        <!-- Col 2: Peta -->
        <div class="min-h-0 bg-white/80 backdrop-blur-sm border border-brand-green/10 rounded-xl shadow-sm overflow-hidden relative">
          <ClientOnly>
            <MapLibre @ready="onMapReady" class="w-full h-full" />
          </ClientOnly>
          <Transition name="fade">
            <div v-if="!mapLoaded" class="absolute inset-0 skel" style="z-index:2"></div>
          </Transition>
          <div class="absolute top-2.5 left-3 pointer-events-none" style="z-index:1">
            <span class="text-[10px] font-bold uppercase tracking-widest text-white/80 drop-shadow bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-md">Sebaran Mangrove</span>
          </div>
        </div>

        <!-- Col 3: Gallery -->
        <div class="min-h-0 bg-white/80 backdrop-blur-sm border border-brand-green/10 rounded-xl p-3 shadow-sm flex flex-col">
          <p class="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40 shrink-0 mb-2">Kawasan Mangrove Utama</p>
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
                <span class="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  :style="{ background: ikiColor(d.iki) + 'cc', color: '#fff' }">{{ d.iki }}</span>
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white/20 group-hover:text-white/30 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 2c0 0-4 3-4 7 0 2 1.5 4 4 5 2.5-1 4-3 4-5 0-4-4-7-4-7z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 14v8M9 19h6"/>
                  </svg>
                </div>
                <div class="relative z-10 px-2 pb-1.5">
                  <p class="text-white text-[10px] font-semibold leading-tight truncate">{{ d.nama }}</p>
                  <p class="text-white/55 text-[9px] truncate">{{ d.provinsi }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- ═══ ROW 3: Sebaran Pulau | Tren Luas ═══════════════════ -->
      <div class="flex-1 min-h-0 grid grid-cols-2 gap-2">

        <!-- Col 1: Sebaran per Pulau -->
        <div class="min-h-0 bg-white/80 backdrop-blur-sm border border-brand-green/10 rounded-xl p-3 shadow-sm flex flex-col">
          <div class="flex items-center justify-between shrink-0 mb-2">
            <p class="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40">Sebaran per Pulau</p>
            <span class="text-[10px] text-brand-charcoal/25">% luas mangrove 2025</span>
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
                  <span class="text-[10px] text-brand-charcoal/60 truncate">{{ t.label }}</span>
                </div>
                <div class="flex-1 h-3 rounded-full overflow-hidden bg-brand-charcoal/5">
                  <div class="h-full rounded-full" :style="{ width: t.pct + '%', background: t.color + '55' }"></div>
                </div>
                <span class="text-[10px] font-bold text-brand-charcoal/50 w-8 text-right shrink-0">{{ t.pct }}%</span>
              </div>
            </div>
            <p class="text-[9px] text-brand-charcoal/25 mt-2 shrink-0">Distribusi luas mangrove nasional · KLH/BPLH 2026</p>
          </template>
        </div>

        <!-- Col 2: Tren Luas Mangrove -->
        <div class="min-h-0 bg-white/80 backdrop-blur-sm border border-brand-green/10 rounded-xl p-3 shadow-sm flex flex-col">
          <div class="flex items-center justify-between shrink-0 mb-1">
            <p class="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40">Tren Luas Mangrove (ribu ha)</p>
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
                  <span class="text-[9px] text-brand-charcoal/45">{{ s.nama }}</span>
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
                  <line x1="0" y1="15" x2="280" y2="15" stroke="#1A2A24" stroke-opacity="0.05" stroke-width="1" stroke-dasharray="4 4"/>
                  <line x1="0" y1="30" x2="280" y2="30" stroke="#1A2A24" stroke-opacity="0.05" stroke-width="1" stroke-dasharray="4 4"/>
                  <line x1="0" y1="45" x2="280" y2="45" stroke="#1A2A24" stroke-opacity="0.05" stroke-width="1" stroke-dasharray="4 4"/>
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
                <span v-for="y in trenYears" :key="y" class="text-[9px] text-brand-charcoal/25">{{ y }}</span>
              </div>
            </div>
            <p class="text-[9px] text-brand-charcoal/25 mt-1.5 shrink-0">Luas mangrove (ribu ha) per pulau besar · KLH/BPLH 2026</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-brand-green to-brand-green-dark;
}
.router-link-active { @apply text-brand-green; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.skel {
  background: linear-gradient(90deg,
    rgba(26,42,36,0.06) 0%, rgba(26,42,36,0.06) 20%,
    rgba(26,42,36,0.13) 45%, rgba(26,42,36,0.06) 70%,
    rgba(26,42,36,0.06) 100%);
  background-size: 250% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}
@keyframes shimmer {
  0%   { background-position: 140% 0; }
  100% { background-position: -140% 0; }
}
</style>
