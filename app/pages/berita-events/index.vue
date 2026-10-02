<script setup lang="ts">
import { ref, computed, watch } from 'vue'

definePageMeta({ layout: 'data' })

const { public: { apiBase } } = useRuntimeConfig()

const activeTab = ref<'berita' | 'events' | 'featured'>('berita')
const viewMode = ref<'card' | 'table'>('card')
const searchQuery = ref('')

const PAGE_SIZE = 6
const currentPage = ref(1)

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  return `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

const apiParams = computed(() => {
  const p: Record<string, string> = { limit: '100' }
  if (activeTab.value === 'featured') {
    p.featured = 'true'
  } else {
    p.type = activeTab.value
  }
  return p
})

const { data: rawData, status } = await useAsyncData(
  () => `be-${activeTab.value}`,
  () => $fetch<{ data: any[]; total: number }>(`${apiBase}/berita-events/public`, { params: apiParams.value }),
  { watch: [activeTab] }
)

const isLoading = computed(() => status.value === 'pending')

const allItems = computed(() =>
  (rawData.value?.data ?? []).map(item => ({
    ...item,
    date: formatDate(item.published_at),
  }))
)

const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return allItems.value
  return allItems.value.filter(item =>
    item.title?.toLowerCase().includes(q) ||
    item.author?.toLowerCase().includes(q) ||
    item.category?.toLowerCase().includes(q) ||
    (item.tags ?? []).some((t: string) => t.toLowerCase().includes(q))
  )
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / PAGE_SIZE))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredData.value.slice(start, start + PAGE_SIZE)
})

watch([activeTab, searchQuery], () => { currentPage.value = 1 })

function setTab(tab: 'berita' | 'events' | 'featured') {
  activeTab.value = tab
}

useSeoMeta({
  title: 'Berita & Events – PPEPD',
  description: 'Berita terkini dan kegiatan terbaru dari Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat.'
})
</script>

<template>
  <div class="flex flex-col h-[calc(100dvh-var(--klh-header-h))] overflow-hidden bg-surface-bg/30">
    <h1 class="sr-only">Berita &amp; Kegiatan</h1>
    <h2 class="sr-only">Daftar berita dan kegiatan</h2>

    <!-- Toolbar -->
    <header class="relative flex-shrink-0 flex flex-col overflow-hidden bg-white/60 border-b border-line" role="region" aria-label="Filter and search area">

      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-40%] left-[-5%] w-[50%] h-[160%] rounded-full bg-klh-green-600/8 blur-[80px]"></div>
        <div class="absolute top-[-20%] right-[-5%] w-[40%] h-[140%] rounded-full bg-klh-blue-500/8 blur-[80px]"></div>
      </div>

      

      <div class="flex justify-center py-3 relative z-10">
        <div class="flex items-center gap-3 w-[70vw]">

          <!-- Tab Switcher -->
          <div class="flex-shrink-0 flex items-center gap-1 bg-surface-bg/80 border border-line rounded-lg p-0.5" role="tablist">
            <button
              @click="setTab('berita')"
              :class="[
                'h-7 px-3 flex items-center justify-center rounded-md text-xs font-medium transition-all duration-200',
                activeTab === 'berita'
                  ? 'bg-white shadow-klh-1 text-klh-green-600'
                  : 'text-ink-400 hover:text-klh-green-600'
              ]"
              :aria-selected="activeTab === 'berita'"
              role="tab"
            >
              Berita
            </button>
            <button
              @click="setTab('events')"
              :class="[
                'h-7 px-3 flex items-center justify-center rounded-md text-xs font-medium transition-all duration-200',
                activeTab === 'events'
                  ? 'bg-white shadow-klh-1 text-klh-green-600'
                  : 'text-ink-400 hover:text-klh-green-600'
              ]"
              :aria-selected="activeTab === 'events'"
              role="tab"
            >
              Events
            </button>
            <button
              @click="setTab('featured')"
              :class="[
                'h-7 px-3 flex items-center justify-center rounded-md text-xs font-medium transition-all duration-200',
                activeTab === 'featured'
                  ? 'bg-white shadow-klh-1 text-klh-orange-700'
                  : 'text-ink-400 hover:text-klh-orange-700'
              ]"
              :aria-selected="activeTab === 'featured'"
              role="tab"
            >
              Featured
            </button>
          </div>

          <!-- Search -->
          <div class="flex-1 min-w-0 relative group">
            <div class="absolute inset-0 bg-klh-green-600/5 rounded-xl blur-xl group-focus-within:bg-klh-green-600/10 transition-all duration-500"></div>
            <div class="relative flex items-center">
              <div class="absolute left-4 text-ink-400 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="activeTab === 'berita' ? 'Cari berita, penulis, atau tag...' : activeTab === 'events' ? 'Cari kegiatan, penyelenggara, atau tag...' : 'Cari konten pilihan...'"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-line focus:border-klh-green-600 focus:outline-none focus:shadow-klh-3 transition-all duration-300 text-ink-900 text-sm font-medium placeholder-ink-400"
              />
            </div>
          </div>

          <!-- View Toggle -->
          <div class="flex-shrink-0 flex items-center gap-1 bg-surface-bg/80 border border-line rounded-lg p-0.5" role="group">
            <button
              @click="viewMode = 'card'"
              :class="[
                'w-8 h-7 flex items-center justify-center rounded-md transition-all duration-200',
                viewMode === 'card' ? 'bg-white shadow-klh-1 text-klh-green-600' : 'text-ink-400 hover:text-klh-green-600'
              ]"
              title="Card View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </button>
            <button
              @click="viewMode = 'table'"
              :class="[
                'w-8 h-7 flex items-center justify-center rounded-md transition-all duration-200',
                viewMode === 'table' ? 'bg-white shadow-klh-1 text-klh-green-600' : 'text-ink-400 hover:text-klh-green-600'
              ]"
              title="Table View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>

        </div>
      </div>
    </header>

    <!-- Content Area -->
    <div class="flex-grow flex flex-col overflow-hidden">
      <div class="flex-grow overflow-y-auto px-6 py-8 flex justify-center" id="be-scroll-area">
        <div class="w-full max-w-[75vw]">

          <!-- Skeleton -->
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DataSkeleton v-for="i in 6" :key="i" />
          </div>

          <!-- Card View -->
          <div
            v-else-if="filteredData.length > 0 && viewMode === 'card'"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn"
          >
            <BeritaEventsCard v-for="item in paginatedData" :key="item.slug" :item="item" />
          </div>

          <!-- Table View -->
          <div
            v-else-if="filteredData.length > 0 && viewMode === 'table'"
            class="bg-white rounded-md border border-line [overflow:clip] animate-fadeIn"
          >
            <div class="sticky top-0 z-10 flex items-center px-4 py-3 bg-surface-bg/95 backdrop-blur-sm border-b border-line">
              <div class="w-20 flex-shrink-0 text-[11px] font-bold uppercase tracking-widest text-ink-500">Img</div>
              <div class="flex-1 min-w-0 px-4 text-[11px] font-bold uppercase tracking-widest text-ink-500">Judul</div>
              <div class="w-32 flex-shrink-0 px-2 text-[11px] font-bold uppercase tracking-widest text-ink-500">Tanggal</div>
              <div class="w-10 flex-shrink-0"></div>
            </div>
            <BeritaEventsTableRow
              v-for="item in paginatedData"
              :key="item.slug"
              :item="item"
            />
          </div>

          <!-- Empty State -->
          <div v-else-if="!isLoading && filteredData.length === 0" class="flex flex-col items-center justify-center min-h-[400px] py-24 text-center">
            <div class="w-24 h-24 bg-klh-green-600/5 rounded-full flex items-center justify-center mb-6 border-2 border-line">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-klh-green-600/25"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 class="text-xl font-bold text-klh-green-800 mb-2">Tidak Ditemukan</h3>
            <p class="text-sm text-ink-500 mb-8 max-w-sm font-medium">
              Tidak ada hasil untuk "<span class="font-bold text-ink-700">{{ searchQuery }}</span>" dalam kategori
              <span class="font-bold text-ink-700">{{ activeTab === 'berita' ? 'Berita' : activeTab === 'events' ? 'Events' : 'Featured' }}</span>.
            </p>
            <button
              @click="searchQuery = ''"
              class="px-6 py-2.5 rounded-full border-2 border-klh-green-600 text-klh-green-600 text-[11px] font-bold uppercase tracking-widest hover:bg-klh-green-600 hover:text-white transition-all duration-300"
            >
              Reset Pencarian
            </button>
          </div>

        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="!isLoading && totalPages > 1"
        class="flex-shrink-0 flex items-center justify-center px-6 h-14 bg-surface border-t border-line"
      >
        <div class="flex items-center gap-3">
          <p class="text-[11px] font-bold text-ink-500 uppercase tracking-widest">
            Hal <span class="text-klh-green-600 font-bold">{{ currentPage }}</span> / <span class="text-ink-500">{{ totalPages }}</span>
          </p>
          <div class="flex items-center gap-1">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="w-8 h-8 rounded-lg flex items-center justify-center border border-line text-ink-500 hover:border-klh-green-600 hover:text-klh-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button
              v-for="p in totalPages"
              :key="p"
              @click="currentPage = p"
              :class="[
                'w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200',
                currentPage === p
                  ? 'bg-klh-green-600 text-white shadow-klh-2'
                  : 'border border-line text-ink-500 hover:border-klh-green-600 hover:text-klh-green-600'
              ]"
            >
              {{ p }}
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="w-8 h-8 rounded-lg flex items-center justify-center border border-line text-ink-500 hover:border-klh-green-600 hover:text-klh-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
#be-scroll-area::-webkit-scrollbar { width: 6px; }
#be-scroll-area::-webkit-scrollbar-track { background: transparent; }
#be-scroll-area::-webkit-scrollbar-thumb { background: rgb(var(--klh-g-600) / .19); border-radius: 99px; }
#be-scroll-area::-webkit-scrollbar-thumb:hover { background: rgb(var(--klh-g-600) / .38); }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
</style>
