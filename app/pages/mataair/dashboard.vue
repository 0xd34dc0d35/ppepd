<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({ layout: 'map', middleware: 'dashboard' })

const route = useRoute()
const { visibleNav } = useRole()

const drawerOpen = ref(false)
const openDrawer = () => { drawerOpen.value = true }
const closeDrawer = () => { drawerOpen.value = false }
watch(() => route.path, closeDrawer)

useSeoMeta({
  title: 'Dashboard Ekosistem Mata Air | PPEPD',
  description: 'Dashboard situasi ekosistem mata air Indonesia – Direktorat PPEPD KLH/BPLH.',
})

// ── Row 1: KPI ──────────────────────────────────────────────
const kpis = [
  { label: 'Mata Air Tercatat',   value: '4.200', unit: 'titik',      trend: '+87',   up: true,  num: 4200, dec: 0, sfx: ''  },
  { label: 'Mata Air Prioritas',  value: '20',    unit: 'nasional',   trend: null,    up: null,  num: 20,   dec: 0, sfx: ''  },
  { label: 'Indeks Debit Rerata', value: '38,6',  unit: 'l/dt',       trend: '-2,1',  up: false, num: 38.6, dec: 1, sfx: ''  },
  { label: 'Kawasan Terlindungi', value: '44%',   unit: 'dari total', trend: '+1,3%', up: true,  num: 44,   dec: 0, sfx: '%' },
]

const kpiDisplay = ref(kpis.map(() => '0'))

function fmtNum(n: number, dec: number, sfx: string) {
  return (dec > 0 ? n.toFixed(dec).replace('.', ',') : Math.round(n).toString()) + sfx
}

function startCountUp() {
  const dur = 750
  const t0 = performance.now()
  const tick = (now: number) => {
    const p = Math.min((now - t0) / dur, 1)
    const ease = 1 - (1 - p) ** 3
    kpis.forEach((kpi, i) => { kpiDisplay.value[i] = fmtNum(kpi.num * ease, kpi.dec, kpi.sfx) })
    if (p < 1) requestAnimationFrame(tick)
    else kpis.forEach((kpi, i) => { kpiDisplay.value[i] = kpi.value })
  }
  requestAnimationFrame(tick)
}

// ── Row 2, Col 1: Status ─────────────────────────────────────
const statusData = [
  { label: 'Kondisi Baik',    count: 1764, color: '#005952', pct: 42 },
  { label: 'Perlu Perhatian', count: 2100, color: '#F97910', pct: 50 },
  { label: 'Kondisi Kritis',  count: 336,  color: '#C03A2B', pct: 8  },
]

const ancaman = [
  { label: 'Alih fungsi lahan resapan',     lokasi: 'Jawa Tengah, D.I.Y.',      level: 'kritis'  },
  { label: 'Ekstraksi berlebihan',          lokasi: 'Umbulan, Ciater',           level: 'kritis'  },
  { label: 'Pencemaran limbah domestik',    lokasi: 'Klaten, Sleman',            level: 'waspada' },
  { label: 'Sedimentasi zona tangkapan',    lokasi: 'Pasuruan, Malang',          level: 'waspada' },
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
  map.addSource('mataair-big', {
    type: 'raster',
    tiles: ['https://geoservices.big.go.id/rbi/rest/services/BASEMAP/Rupabumi_Indonesia/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&layers=show:262&size=256,256&imageSR=3857&format=png32&transparent=true&f=image'],
    tileSize: 256,
    attribution: '&copy; KLH/BPLH 2026',
  })
  map.addLayer({ id: 'mataair-big', type: 'raster', source: 'mataair-big' })
}

// ── Row 2, Col 3: Gallery ────────────────────────────────────
const daftarMataAir = [
  { id: 'umbulan',   nama: 'Mata Air Umbulan',    provinsi: 'Jawa Timur',      idi: 74, hue: 195 },
  { id: 'ponggok',   nama: 'Umbul Ponggok',        provinsi: 'Jawa Tengah',     idi: 82, hue: 205 },
  { id: 'ciater',    nama: 'Mata Air Ciater',      provinsi: 'Jawa Barat',      idi: 67, hue: 185 },
  { id: 'sigedang',  nama: 'Umbul Sigedang',       provinsi: 'Jawa Tengah',     idi: 79, hue: 210 },
  { id: 'banyubiru', nama: 'Mata Air Banyu Biru',  provinsi: 'Jawa Timur',      idi: 58, hue: 200 },
  { id: 'cikaret',   nama: 'Mata Air Cikaret',     provinsi: 'Jawa Barat',      idi: 41, hue: 190 },
]

function thumbStyle(hue: number) {
  return { background: `linear-gradient(135deg, hsl(${hue},50%,28%) 0%, hsl(${hue + 15},55%,18%) 100%)` }
}
function idiColor(v: number) { return v >= 65 ? '#005952' : v >= 45 ? '#AE5104' : '#C03A2B' }
function idiLabel(v: number) { return v >= 65 ? 'Baik' : v >= 45 ? 'Sedang' : 'Kritis' }

// ── Row 3, Col 1: Tutupan Lahan ──────────────────────────────
const tutupanData = [
  { label: 'Hutan',      pct: 38, color: '#005952' },
  { label: 'Pertanian',  pct: 32, color: '#F97910' },
  { label: 'Perairan',   pct: 12, color: '#147DEF' },
  { label: 'Pemukiman',  pct: 13, color: '#8B7D6B' },
  { label: 'Lainnya',    pct:  5, color: '#B0A898' },
]

const tutupanSegments = computed(() => {
  let offset = 0
  return tutupanData.map(d => {
    const seg = { ...d, offset }
    offset += d.pct
    return seg
  })
})

// ── Row 3, Col 2: Tren Debit ─────────────────────────────────
const debitYears  = ['2019', '2020', '2021', '2022', '2023', '2024', '2025']
const debitSeries = [
  { nama: 'Umbulan',   vals: [52, 51, 49, 48, 46, 45, 44], color: '#005952' },
  { nama: 'Ponggok',   vals: [38, 40, 41, 42, 40, 39, 38], color: '#147DEF' },
  { nama: 'Cikaret',   vals: [22, 21, 19, 17, 15, 14, 13], color: '#C03A2B' },
]

const debitMin = computed(() => Math.min(...debitSeries.flatMap(s => s.vals)) - 5)
const debitMax = computed(() => Math.max(...debitSeries.flatMap(s => s.vals)) + 5)

function debitPath(vals: number[], w = 280, h = 60) {
  const mn = debitMin.value, mx = debitMax.value, r = mx - mn || 1
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
        <NuxtLink to="/mataair/profil-mataair" class="btn btn-primary btn-sm">
          <span class="hidden sm:inline">Profil Mata Air</span>
          <span class="sm:hidden">Peta</span>
          <svg class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
        </NuxtLink>
      </template>
    </KlhSiteHeader>

    <!-- MAIN CONTENT: 3 rows -->
    <div id="konten-utama" class="flex-1 min-h-0 flex flex-col gap-2 px-6 py-3" style="z-index:1; position:relative">
    <h1 class="sr-only">Dashboard Ekosistem Mata Air</h1>

      <!-- ═══ ROW 1: KPI STRIP ══════════════════════════════════════ -->
      <div class="grid grid-cols-4 gap-2 shrink-0">
        <div
          v-for="(kpi, index) in kpis" :key="kpi.label"
          class="bg-klh-green-500/10 backdrop-blur-sm border border-klh-green-400/20 rounded-xl px-4 py-2.5 flex flex-col gap-0.5 shadow-klh-1"
        >
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

        <!-- Col 1: Status Ekosistem + Ancaman -->
        <div class="flex flex-col gap-2 min-h-0">

          <!-- Status -->
          <div class="flex-1 min-h-0 bg-klh-green-500/10 backdrop-blur-sm border border-klh-green-400/20 rounded-xl p-3 shadow-klh-1 flex flex-col">
            <div class="flex items-center justify-between shrink-0 mb-2">
              <p class="text-[11px] font-bold uppercase tracking-widest text-ink-500">Status Ekosistem</p>
              <span class="text-[11px] text-ink-400">4.200 titik</span>
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
              <div class="shrink-0 flex items-center gap-3 mt-2 pt-2 border-t border-klh-green-400/15">
                <div v-for="i in 3" :key="i" class="flex items-center gap-1">
                  <div class="w-1.5 h-1.5 rounded-full skel"></div>
                  <div class="h-2 w-16 rounded skel"></div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex-1 min-h-0 flex gap-3">
                <div class="flex flex-col items-center justify-center shrink-0 w-20">
                  <span class="text-4xl font-bold text-klh-green-600 leading-none">42%</span>
                  <span class="text-[11px] text-ink-500 text-center leading-tight mt-1">kondisi<br>baik</span>
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
                    <span class="text-[11px] text-ink-400 w-7 text-right shrink-0">{{ s.count }}</span>
                  </div>
                </div>
              </div>
              <div class="shrink-0 flex items-center gap-3 mt-2 pt-2 border-t border-klh-green-400/15">
                <div v-for="s in statusData" :key="s.label" class="flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full" :style="{ background: s.color }"></span>
                  <span class="text-[11px] text-ink-500">{{ s.label }}</span>
                </div>
              </div>
            </template>
          </div>

          <!-- Ancaman -->
          <div class="flex-1 min-h-0 bg-klh-green-500/10 backdrop-blur-sm border border-klh-green-400/20 rounded-xl p-3 shadow-klh-1 flex flex-col">
            <p class="text-[11px] font-bold uppercase tracking-widest text-ink-500 shrink-0 mb-2">Ancaman Prioritas</p>
            <template v-if="isLoading">
              <ul class="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
                <li v-for="i in 4" :key="i" class="flex items-start gap-2 py-1.5 border-b border-klh-green-400/15 last:border-0">
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
                  class="flex items-start gap-2 py-1.5 border-b border-klh-green-400/15 last:border-0">
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
        <div class="min-h-0 bg-klh-green-500/10 backdrop-blur-sm border border-klh-green-400/20 rounded-xl shadow-klh-1 overflow-hidden relative">
          <ClientOnly>
            <MapLibre @ready="onMapReady" class="w-full h-full" />
          </ClientOnly>
          <!-- Map loading overlay -->
          <Transition name="fade">
            <div v-if="!mapLoaded" class="absolute inset-0 skel" style="z-index:2"></div>
          </Transition>
          <!-- Map label -->
          <div class="absolute top-2.5 left-3 pointer-events-none" style="z-index:1">
            <span class="text-[11px] font-bold uppercase tracking-widest text-white/80 drop-shadow bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-md">Sebaran Mata Air</span>
          </div>
          <!-- Fullscreen button -->
          <NuxtLink
            to="/mataair/profil-mataair"
            class="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/35 transition-colors text-white/80 hover:text-white"
            title="Buka peta penuh"
            style="z-index:1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Col 3: Gallery -->
        <div class="min-h-0 bg-klh-green-500/10 backdrop-blur-sm border border-klh-green-400/20 rounded-xl p-3 shadow-klh-1 flex flex-col">
          <p class="text-[11px] font-bold uppercase tracking-widest text-ink-500 shrink-0 mb-2">Mata Air Prioritas Nasional</p>
          <template v-if="isLoading">
            <div class="flex-1 min-h-0 grid grid-cols-2 gap-2 overflow-hidden">
              <div v-for="i in 6" :key="i" class="rounded-lg skel"></div>
            </div>
          </template>
          <template v-else>
            <div class="flex-1 min-h-0 grid grid-cols-2 gap-2 overflow-hidden">
              <div
                v-for="d in daftarMataAir" :key="d.id"
                class="relative rounded-lg overflow-hidden flex flex-col justify-end cursor-pointer group"
                :style="thumbStyle(d.hue)"
              >
                <!-- Overlay gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <!-- IDI badge -->
                <span class="absolute top-1.5 right-1.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                  :style="{ background: idiColor(d.idi), color: '#fff' }">{{ d.idi }}</span>
                <!-- Spring icon -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white/20 group-hover:text-white/30 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 2C8.5 2 6 5 6 8c0 4 6 12 6 12s6-8 6-12c0-3-2.5-6-6-6z"/>
                    <circle cx="12" cy="8" r="2" stroke-width="1.2"/>
                  </svg>
                </div>
                <!-- Labels -->
                <div class="relative z-10 px-2 pb-1.5">
                  <p class="text-white text-[11px] font-semibold leading-tight truncate">{{ d.nama }}</p>
                  <p class="text-white/55 text-[11px] truncate">{{ d.provinsi }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- ═══ ROW 3: Tutupan Lahan | Tren Debit ═══════════════════ -->
      <div class="flex-1 min-h-0 grid grid-cols-2 gap-2">

        <!-- Col 1: Grafik Tutupan Lahan -->
        <div class="min-h-0 bg-klh-green-500/10 backdrop-blur-sm border border-klh-green-400/20 rounded-xl p-3 shadow-klh-1 flex flex-col">
          <div class="flex items-center justify-between shrink-0 mb-2">
            <p class="text-[11px] font-bold uppercase tracking-widest text-ink-500">Tutupan Lahan DTA</p>
            <span class="text-[11px] text-ink-400">Komposisi rata-rata 2025</span>
          </div>

          <template v-if="isLoading">
            <div class="shrink-0 h-5 rounded-full skel mb-2.5"></div>
            <div class="flex-1 min-h-0 flex flex-col justify-between">
              <div v-for="i in 5" :key="i" class="flex items-center gap-2.5">
                <div class="h-2.5 w-20 rounded skel shrink-0"></div>
                <div class="flex-1 h-3 rounded-full skel"></div>
                <div class="h-2.5 w-8 rounded skel shrink-0"></div>
              </div>
            </div>
            <div class="h-2 w-48 rounded skel mt-2 shrink-0"></div>
          </template>
          <template v-else>
            <!-- Stacked bar -->
            <div class="shrink-0 h-5 rounded-full overflow-hidden flex mb-2.5">
              <div v-for="s in tutupanSegments" :key="s.label"
                class="h-full transition-all duration-700"
                :style="{ width: s.pct + '%', background: s.color }">
              </div>
            </div>

            <!-- Horizontal bars -->
            <div class="flex-1 min-h-0 flex flex-col justify-between">
              <div v-for="t in tutupanData" :key="t.label" class="flex items-center gap-2.5">
                <div class="flex items-center gap-1.5 w-20 shrink-0">
                  <span class="w-2 h-2 rounded-sm shrink-0" :style="{ background: t.color }"></span>
                  <span class="text-[11px] text-ink-500 truncate">{{ t.label }}</span>
                </div>
                <div class="flex-1 h-3 rounded-full overflow-hidden bg-ink-900/5">
                  <div class="h-full rounded-full transition-all duration-700"
                    :style="{ width: t.pct + '%', background: t.color + '55' }">
                  </div>
                </div>
                <span class="text-[11px] font-bold text-ink-500 w-8 text-right shrink-0">{{ t.pct }}%</span>
              </div>
            </div>

            <p class="text-[11px] text-ink-400 mt-2 shrink-0">Daerah Tangkapan Air (DTA) 20 Mata Air Prioritas · KLH/BPLH 2026</p>
          </template>
        </div>

        <!-- Col 2: Grafik Tren Debit -->
        <div class="min-h-0 bg-klh-green-500/10 backdrop-blur-sm border border-klh-green-400/20 rounded-xl p-3 shadow-klh-1 flex flex-col">
          <div class="flex items-center justify-between shrink-0 mb-1">
            <p class="text-[11px] font-bold uppercase tracking-widest text-ink-500">Tren Debit Mata Air (l/dt)</p>
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
                <div v-for="s in debitSeries" :key="s.nama" class="flex items-center gap-1">
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
            <!-- SVG multi-line chart -->
            <div class="flex-1 min-h-0 flex flex-col">
              <div class="flex-1 min-h-0 relative">
                <svg class="w-full h-full" viewBox="0 0 280 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="debit-umbulan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#005952" stop-opacity="0.12"/>
                      <stop offset="100%" stop-color="#005952" stop-opacity="0"/>
                    </linearGradient>
                    <linearGradient id="debit-ponggok" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#147DEF" stop-opacity="0.12"/>
                      <stop offset="100%" stop-color="#147DEF" stop-opacity="0"/>
                    </linearGradient>
                    <linearGradient id="debit-cikaret" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#C03A2B" stop-opacity="0.10"/>
                      <stop offset="100%" stop-color="#C03A2B" stop-opacity="0"/>
                    </linearGradient>
                  </defs>

                  <!-- Grid lines -->
                  <line x1="0" y1="15" x2="280" y2="15" stroke="#10201D" stroke-opacity="0.05" stroke-width="1" stroke-dasharray="4 4"/>
                  <line x1="0" y1="30" x2="280" y2="30" stroke="#10201D" stroke-opacity="0.05" stroke-width="1" stroke-dasharray="4 4"/>
                  <line x1="0" y1="45" x2="280" y2="45" stroke="#10201D" stroke-opacity="0.05" stroke-width="1" stroke-dasharray="4 4"/>

                  <!-- Series -->
                  <path v-for="s in debitSeries" :key="s.nama"
                    :d="debitPath(s.vals, 280, 60)"
                    fill="none"
                    :stroke="s.color"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />

                  <!-- End dots -->
                  <circle v-for="s in debitSeries" :key="s.nama + '-dot'"
                    cx="280"
                    :cy="debitPath(s.vals, 280, 60).split(' ').at(-1)!.split(',')[1]"
                    r="2.5"
                    :fill="s.color"
                  />
                </svg>
              </div>

              <!-- X axis labels -->
              <div class="flex justify-between shrink-0 mt-1">
                <span v-for="y in debitYears" :key="y" class="text-[11px] text-ink-400">{{ y }}</span>
              </div>
            </div>

            <p class="text-[11px] text-ink-400 mt-1.5 shrink-0">Debit (liter/detik) · Mata air terpilih · KLH/BPLH 2026</p>
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

/* Shimmer skeleton */
.skel {
  background: linear-gradient(
    90deg,
    rgba(16,32,29,0.06) 0%,
    rgba(16,32,29,0.06) 20%,
    rgba(16,32,29,0.13) 45%,
    rgba(16,32,29,0.06) 70%,
    rgba(16,32,29,0.06) 100%
  );
  background-size: 250% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}
@keyframes shimmer {
  0%   { background-position: 140% 0; }
  100% { background-position: -140% 0; }
}
</style>
