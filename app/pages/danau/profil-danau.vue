<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'map' })

useSeoMeta({
  title: 'Profil Danau | PPEPD',
  description: 'Peta interaktif profil danau-danau di Indonesia – Direktorat PPEPD KLH/BPLH.',
})

const showTOU = ref(true)
const showSidebar = ref(false)
const activePanel = ref<'layer' | 'basisdata' | 'pelaporan' | null>(null)

function togglePanel(panel: 'layer' | 'basisdata' | 'pelaporan') {
  activePanel.value = activePanel.value === panel ? null : panel
}

const activeBasemap = ref('osm')
const basemaps = [
  { id: 'osm',       label: 'OpenStreetMap', color: '#6b9fd4' },
  { id: 'satellite', label: 'Satelit',       color: '#7a8a6a' },
  { id: 'terrain',   label: 'Terrain',       color: '#c8a96e' },
  { id: 'dark',      label: 'Dark',          color: '#4a4a5a' },
]

const layers = ref([
  { id: 'danau-big', label: 'Batas Danau (BIG)',     color: '#4a90d9', active: true  },
  { id: 'prioritas', label: 'Danau Prioritas',        color: '#3a9e5f', active: false },
  { id: 'dta',       label: 'Daerah Tangkapan Air',   color: '#e0a030', active: false },
  { id: 'stasiun',   label: 'Stasiun Pemantauan',     color: '#d94a4a', active: false },
])
const searchQuery = ref('')
const activeDanau = ref<string | null>(null)

const daftarDanau = [
  { id: 'toba',       nama: 'Danau Toba',     provinsi: 'Sumatera Utara',  luas: '1.130 km²', elevasi: '905 m dpl', hue: 195 },
  { id: 'poso',       nama: 'Danau Poso',     provinsi: 'Sulawesi Tengah', luas: '323 km²',   elevasi: '657 m dpl', hue: 175 },
  { id: 'towuti',     nama: 'Danau Towuti',   provinsi: 'Sulawesi Selatan',luas: '561 km²',   elevasi: '293 m dpl', hue: 210 },
  { id: 'sentani',    nama: 'Danau Sentani',  provinsi: 'Papua',           luas: '96 km²',    elevasi: '75 m dpl',  hue: 200 },
  { id: 'singkarak',  nama: 'Danau Singkarak',provinsi: 'Sumatera Barat',  luas: '107 km²',   elevasi: '362 m dpl', hue: 185 },
  { id: 'kerinci',    nama: 'Danau Kerinci',  provinsi: 'Jambi',           luas: '47 km²',    elevasi: '783 m dpl', hue: 160 },
  { id: 'limboto',    nama: 'Danau Limboto',  provinsi: 'Gorontalo',       luas: '30 km²',    elevasi: '2 m dpl',   hue: 220 },
  { id: 'tempe',      nama: 'Danau Tempe',    provinsi: 'Sulawesi Selatan',luas: '350 km²',   elevasi: '10 m dpl',  hue: 170 },
  { id: 'maninjau',   nama: 'Danau Maninjau', provinsi: 'Sumatera Barat',  luas: '100 km²',   elevasi: '461 m dpl', hue: 190 },
  { id: 'rawa-pening',nama: 'Rawa Pening',    provinsi: 'Jawa Tengah',     luas: '16 km²',    elevasi: '463 m dpl', hue: 155 },
]

function imgGradient(hue: number) {
  return { background: `linear-gradient(150deg, hsl(${hue},55%,32%) 0%, hsl(${hue + 18},60%,18%) 100%)` }
}
function thumbGradient(hue: number) {
  return { background: `linear-gradient(135deg, hsl(${hue},55%,38%) 0%, hsl(${hue + 18},60%,22%) 100%)` }
}

const acceptTOU = () => { showTOU.value = false }

const onMapReady = (map: any) => {
  map.addSource('danau-big', {
    type: 'raster',
    tiles: [
      'https://geoservices.big.go.id/rbi/rest/services/BASEMAP/Rupabumi_Indonesia/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&layers=show:262&size=256,256&imageSR=3857&format=png32&transparent=true&f=image',
    ],
    tileSize: 256,
    attribution: '&copy; <a href="https://big.go.id" target="_blank">BIG – Rupabumi Indonesia</a>',
  })
  map.addLayer({
    id: 'danau-big',
    type: 'raster',
    source: 'danau-big',
  })
}
</script>

<template>
  <!-- Map layer — zIndex 0 -->
  <div class="absolute inset-0" style="z-index: 0">
    <ClientOnly>
      <MapLibre @ready="onMapReady" />
    </ClientOnly>
  </div>

  <!-- Overlay Transparent Appbar — zIndex 2, height 42px -->
  <header
    class="absolute top-0 left-0 right-0 flex items-center gap-3 px-3 backdrop-blur-md bg-white/20 border-b border-white/30"
    style="z-index: 2; height: 42px"
  >
    <!-- Prepend: back + title -->
    <div class="flex items-center gap-2 shrink-0">
      <button
        class="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-black/10 transition-colors text-black"
        aria-label="Kembali"
        @click="$router.back()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        class="flex items-center gap-1.5 px-2 py-0.5 text-sm font-bold rounded-md transition-all duration-200 whitespace-nowrap select-none"
        :class="showSidebar ? 'bg-brand-green text-white shadow-sm' : 'text-black hover:bg-black/10'"
        @click="showSidebar = !showSidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 transition-transform duration-200" :class="showSidebar ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        Profil Danau
      </button>
    </div>

    <!-- Center: search field -->
    <div class="flex-1 flex items-center min-w-0">
      <div class="relative w-full max-w-sm mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/50 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Temukan danau"
          class="w-full h-7 pl-7 pr-3 text-xs text-black placeholder-black/40 bg-white/40 backdrop-blur-sm border border-white/50 rounded-lg outline-none focus:bg-white/60 focus:border-white/80 transition-all"
        />
      </div>
    </div>

    <!-- Append: Layer + Basisdata + Pelaporan buttons -->
    <div class="flex items-center gap-1 shrink-0">
      <!-- Layer icon button -->
      <button
        class="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
        :class="activePanel === 'layer' ? 'bg-brand-green text-white shadow-sm' : 'text-black hover:bg-black/10'"
        title="Layer Peta"
        aria-label="Layer Peta"
        @click="togglePanel('layer')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2 12l10 5 10-5" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2 17l10 5 10-5" />
        </svg>
      </button>
      <button
        class="flex items-center gap-1.5 px-3 h-7 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
        :class="activePanel === 'basisdata' ? 'bg-brand-green text-white shadow-sm' : 'text-black hover:bg-black/10'"
        @click="togglePanel('basisdata')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        Basisdata
      </button>
      <button
        class="flex items-center gap-1.5 px-3 h-7 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
        :class="activePanel === 'pelaporan' ? 'bg-brand-green text-white shadow-sm' : 'text-black hover:bg-black/10'"
        @click="togglePanel('pelaporan')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
        </svg>
        Pelaporan
      </button>
    </div>
  </header>

  <!-- Left Sidebar Drawer — zIndex 1 -->
  <Transition name="slide-left">
    <div
      v-if="showSidebar"
      class="absolute left-0 bottom-0 bg-white shadow-2xl flex flex-col overflow-hidden"
      style="z-index: 1; top: 42px; width: clamp(260px, 35vw, 520px)"
    >
      <!-- Sidebar header -->
      <div class="flex items-center justify-between px-4 py-3 bg-brand-green shrink-0">
        <h3 class="text-sm font-bold text-white">Daftar Profil Danau</h3>
        <span class="text-xs text-white/70">{{ daftarDanau.length }} danau</span>
      </div>

      <!-- Search inside sidebar -->
      <div class="px-3 py-2.5 border-b border-gray-100 shrink-0">
        <div class="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari danau..."
            class="w-full h-8 pl-8 pr-3 text-xs text-gray-700 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-brand-green transition-all"
          />
        </div>
      </div>

      <!-- Lake list -->
      <div class="flex-1 overflow-y-auto">
        <ul class="divide-y divide-gray-100">
          <li
            v-for="danau in daftarDanau.filter(d => d.nama.toLowerCase().includes(searchQuery.toLowerCase()) || d.provinsi.toLowerCase().includes(searchQuery.toLowerCase()))"
            :key="danau.id"
          >
            <!-- Row trigger -->
            <button
              class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors group"
              :class="activeDanau === danau.id ? 'bg-brand-green/10' : 'hover:bg-gray-50'"
              @click="activeDanau = activeDanau === danau.id ? null : danau.id"
            >
              <!-- Thumbnail -->
              <div
                class="flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden flex items-center justify-center"
                :style="thumbGradient(danau.hue)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 15c1.5-2 3-3 4.5-3s3 2 4.5 2 3-1 4.5-3" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 19c1.5-2 3-3 4.5-3s3 2 4.5 2 3-1 4.5-3" />
                </svg>
              </div>

              <!-- Text -->
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold truncate" :class="activeDanau === danau.id ? 'text-brand-green' : 'text-gray-800'">
                  {{ danau.nama }}
                </p>
                <p class="text-xs text-gray-400 truncate mt-0.5">{{ danau.provinsi }}</p>
              </div>

              <!-- Chevron -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
                :class="activeDanau === danau.id ? 'rotate-90 text-brand-green' : 'text-gray-300 group-hover:text-gray-400'"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Expanded detail -->
            <Transition name="expand">
              <div v-if="activeDanau === danau.id" class="overflow-hidden">

                <!-- Hero image — 16:9, full sidebar width -->
                <div class="relative w-full overflow-hidden" style="aspect-ratio: 16/9">
                  <div class="absolute inset-0 flex flex-col items-center justify-center gap-2" :style="imgGradient(danau.hue)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 12c1.5-2.5 3-4 4.5-4s3 2.5 4.5 2.5S15 8 16.5 8 19.5 9.5 21 12" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 17c1.5-2.5 3-4 4.5-4s3 2.5 4.5 2.5S15 13 16.5 13 19.5 14.5 21 17" />
                    </svg>
                    <span class="text-white/40 text-xs">Foto belum tersedia</span>
                  </div>
                  <!-- Bottom gradient overlay with lake name -->
                  <div class="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/50 to-transparent flex items-end px-3 pb-2">
                    <span class="text-white text-xs font-semibold drop-shadow">{{ danau.nama }}</span>
                  </div>
                </div>

                <!-- Stats + action buttons -->
                <div class="px-4 py-3 bg-brand-green/5">
                  <!-- Stats grid -->
                  <div class="grid grid-cols-2 gap-2">
                    <div class="bg-white rounded-lg p-2.5 border border-brand-green/10">
                      <p class="text-xs text-gray-400 mb-0.5">Luas</p>
                      <p class="text-xs font-semibold text-brand-charcoal">{{ danau.luas }}</p>
                    </div>
                    <div class="bg-white rounded-lg p-2.5 border border-brand-green/10">
                      <p class="text-xs text-gray-400 mb-0.5">Elevasi</p>
                      <p class="text-xs font-semibold text-brand-charcoal">{{ danau.elevasi }}</p>
                    </div>
                  </div>

                  <!-- Action icon buttons -->
                  <div class="flex items-center gap-2 mt-3">
                    <!-- Zoom / Fokus Peta -->
                    <button
                      title="Fokus pada Peta"
                      class="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg bg-white border border-gray-100 hover:border-brand-green/40 hover:bg-brand-green/5 transition-colors text-gray-500 hover:text-brand-green"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 8v6M8 11h6" />
                      </svg>
                      <span class="text-xs">Peta</span>
                    </button>

                    <!-- Catatan / Notes -->
                    <button
                      title="Catatan"
                      class="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg bg-white border border-gray-100 hover:border-brand-green/40 hover:bg-brand-green/5 transition-colors text-gray-500 hover:text-brand-green"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span class="text-xs">Catatan</span>
                    </button>

                    <!-- Dokumen -->
                    <button
                      title="Dokumen"
                      class="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg bg-white border border-gray-100 hover:border-brand-green/40 hover:bg-brand-green/5 transition-colors text-gray-500 hover:text-brand-green"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span class="text-xs">Dokumen</span>
                    </button>

                    <!-- Referensi / Buku -->
                    <button
                      title="Referensi & Literatur"
                      class="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg bg-white border border-gray-100 hover:border-brand-green/40 hover:bg-brand-green/5 transition-colors text-gray-500 hover:text-brand-green"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span class="text-xs">Referensi</span>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </li>
        </ul>

        <!-- Empty state -->
        <div
          v-if="daftarDanau.filter(d => d.nama.toLowerCase().includes(searchQuery.toLowerCase()) || d.provinsi.toLowerCase().includes(searchQuery.toLowerCase())).length === 0"
          class="flex flex-col items-center justify-center py-12 text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <p class="text-xs">Danau tidak ditemukan</p>
        </div>
      </div>

      <!-- Sidebar footer -->
      <div class="px-4 py-2.5 border-t border-gray-100 bg-gray-50 shrink-0">
        <p class="text-xs text-gray-400 text-center">Sumber: Direktorat PPEPD KLH/BPLH</p>
      </div>
    </div>
  </Transition>

  <!-- Dialog TOU — zIndex 2 -->
  <Transition name="fade">
    <div
      v-if="showTOU"
      class="absolute inset-0 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
      style="z-index: 2"
    >
      <Transition name="zoom">
        <div v-if="showTOU" class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <h2 class="text-base font-bold text-brand-charcoal mb-1">Ketentuan Penggunaan</h2>
          <p class="text-xs text-gray-400 mb-4">Harap baca sebelum menggunakan halaman ini</p>
          <div class="text-sm text-gray-600 space-y-2 max-h-56 overflow-y-auto pr-1 leading-relaxed">
            <p>Dengan mengakses halaman <strong>Profil Danau</strong>, Anda menyetujui ketentuan berikut:</p>
            <ol class="list-decimal pl-4 space-y-2">
              <li>Data dan peta yang ditampilkan bersifat informatif dan hanya untuk keperluan referensi.</li>
              <li>Pengguna dilarang menggunakan data untuk kepentingan komersial tanpa izin tertulis dari Direktorat PPEPD.</li>
              <li>Seluruh data bersumber dari Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat (PPEPD) KLH/BPLH dan dapat berubah sewaktu-waktu.</li>
              <li>Kami tidak bertanggung jawab atas kerugian yang timbul akibat penggunaan atau penafsiran data yang tidak tepat.</li>
              <li>Penggunaan peta ini tunduk pada regulasi yang berlaku di wilayah Republik Indonesia.</li>
            </ol>
          </div>
          <div class="mt-5 flex gap-3 justify-end">
            <button class="px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors" @click="showTOU = false">
              Lewati
            </button>
            <button class="px-5 py-2 bg-brand-green text-white text-sm font-semibold rounded-xl hover:bg-brand-green-dark transition-colors" @click="acceptTOU">
              Saya Setuju
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Right Sidebar Drawer — zIndex 1 -->
  <Transition name="slide-right">
    <div
      v-if="activePanel !== null"
      class="absolute right-0 bottom-0 bg-white shadow-2xl flex flex-col overflow-hidden"
      style="z-index: 1; top: 42px; width: clamp(240px, 28vw, 320px)"
    >
      <!-- Header: Layer -->
      <div v-if="activePanel === 'layer'" class="flex items-center justify-between px-4 py-3 bg-brand-green shrink-0">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2 12l10 5 10-5" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2 17l10 5 10-5" />
          </svg>
          <h3 class="text-sm font-bold text-white">Layer Peta</h3>
        </div>
        <button class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors text-white/70 hover:text-white" @click="activePanel = null">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Header: Basisdata -->
      <div v-else-if="activePanel === 'basisdata'" class="flex items-center justify-between px-4 py-3 bg-brand-green shrink-0">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <h3 class="text-sm font-bold text-white">Basisdata Profil Danau</h3>
        </div>
        <button class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors text-white/70 hover:text-white" @click="activePanel = null">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Header: Pelaporan -->
      <div v-else class="flex items-center justify-between px-4 py-3 bg-brand-green shrink-0">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
          </svg>
          <h3 class="text-sm font-bold text-white">Pelaporan</h3>
        </div>
        <button class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors text-white/70 hover:text-white" @click="activePanel = null">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body: Layer -->
      <div v-if="activePanel === 'layer'" class="flex-1 overflow-y-auto">
        <!-- Group: Basemap -->
        <div class="px-4 pt-4 pb-2">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Basemap</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="bm in basemaps"
              :key="bm.id"
              class="relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all"
              :class="activeBasemap === bm.id ? 'border-brand-green bg-brand-green/5' : 'border-gray-100 hover:border-gray-200 bg-white'"
              @click="activeBasemap = bm.id"
            >
              <span class="w-full h-12 rounded-lg block" :style="{ background: bm.color }"></span>
              <span class="text-xs font-medium truncate w-full text-center" :class="activeBasemap === bm.id ? 'text-brand-green' : 'text-gray-600'">{{ bm.label }}</span>
              <span v-if="activeBasemap === bm.id" class="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-green rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
        <div class="mx-4 my-3 border-t border-gray-100"></div>
        <!-- Group: Layer -->
        <div class="px-4 pb-4">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Layer</p>
          <ul class="space-y-1">
            <li v-for="layer in layers" :key="layer.id">
              <label class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input v-model="layer.active" type="checkbox" class="w-4 h-4 accent-brand-green flex-shrink-0 rounded" />
                <span class="w-3 h-3 rounded-sm flex-shrink-0" :style="{ background: layer.color }"></span>
                <span class="text-xs font-medium text-gray-700 flex-1 min-w-0 truncate">{{ layer.label }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>

      <!-- Body: Basisdata -->
      <div v-else-if="activePanel === 'basisdata'" class="flex-1 overflow-y-auto p-5">
        <p class="text-sm text-gray-500 leading-relaxed">Informasi basisdata profil danau akan tersedia di sini.</p>
      </div>

      <!-- Body: Pelaporan -->
      <div v-else class="flex-1 overflow-y-auto p-5">
        <p class="text-sm text-gray-500 leading-relaxed">Formulir pelaporan dan data laporan akan tersedia di sini.</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.88);
  opacity: 0;
}


.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
  overflow: hidden;
  max-height: 600px;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
