<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({ layout: 'data' })

// --- State ---
const activeTab = ref<'raw' | 'statistic'>('raw')
const viewMode = ref<'card' | 'table'>('card')
const searchQuery = ref('')
const isLoading = ref(true)
const allData = ref<any[]>([])

// Pagination
const PAGE_SIZE = 6
const currentPage = ref(1)

// --- Data Fetching ---
onMounted(async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const res = await fetch('/ppepd-data.json')
    allData.value = await res.json()
  } catch (e) {
    console.error('Failed to load data catalog:', e)
  } finally {
    isLoading.value = false
  }
})

// --- Computed ---
const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return allData.value.filter(item => {
    if (item.type !== activeTab.value) return false
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q) ||
      item.metadata.tags.some((t: string) => t.toLowerCase().includes(q)) ||
      item.metadata.category.toLowerCase().includes(q)
    )
  })
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / PAGE_SIZE))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredData.value.slice(start, start + PAGE_SIZE)
})

// Reset page when tab/search changes
watch([activeTab, searchQuery], () => { currentPage.value = 1 })

function setTab(tab: 'raw' | 'statistic') {
  activeTab.value = tab
}

useSeoMeta({
  title: 'Katalog Data – PPEPD',
  description: 'Akses data terbuka perlindungan dan pengelolaan ekosistem perairan darat.'
})
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-brand-cream/30">

    <!-- ══════════════════════════════
         TOOLBAR  ·  single row
         ══════════════════════════════ -->
    <header class="relative flex-shrink-0 flex flex-col overflow-hidden bg-white/60 border-b border-brand-green/10" role="region" aria-label="Filter and search area">

      <!-- Ambient background blobs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-40%] left-[-5%] w-[50%] h-[160%] rounded-full bg-brand-green/8 blur-[80px]"></div>
        <div class="absolute top-[-20%] right-[-5%] w-[40%] h-[140%] rounded-full bg-brand-blue/8 blur-[80px]"></div>
      </div>

      <!-- Navbar spacer -->
      <div class="h-[50px] flex-shrink-0"></div>

      <!-- Single control row -->
      <div class="flex justify-center py-3 relative z-10">
      <div class="flex items-center gap-3 w-[70vw]">

        <!-- Tab Switcher -->
        <div class="flex-shrink-0 flex items-center gap-1 bg-brand-cream/80 border border-brand-green/10 rounded-lg p-0.5" role="tablist">
          <button
            id="tab-raw"
            @click="setTab('raw')"
            :class="[
              'h-7 px-3 flex items-center justify-center rounded-md text-xs font-medium transition-all duration-200',
              activeTab === 'raw'
                ? 'bg-white shadow text-brand-green'
                : 'text-brand-charcoal/30 hover:text-brand-green'
            ]"
            :aria-selected="activeTab === 'raw'"
            role="tab"
          >
            Raw
          </button>
          <button
            id="tab-statistic"
            @click="setTab('statistic')"
            :class="[
              'h-7 px-3 flex items-center justify-center rounded-md text-xs font-medium transition-all duration-200',
              activeTab === 'statistic'
                ? 'bg-white shadow text-brand-green'
                : 'text-brand-charcoal/30 hover:text-brand-green'
            ]"
            :aria-selected="activeTab === 'statistic'"
            role="tab"
          >
            Statistic
          </button>
        </div>

        <!-- Search Input -->
        <div class="flex-grow relative group">
          <div class="absolute inset-0 bg-brand-green/5 rounded-xl blur-xl group-focus-within:bg-brand-green/10 transition-all duration-500"></div>
          <div class="relative flex items-center">
            <div class="absolute left-4 text-brand-charcoal/30 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari dataset, penulis, atau tag..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-brand-green/10 focus:border-brand-green focus:outline-none focus:shadow-xl transition-all duration-300 text-brand-charcoal text-sm font-medium placeholder-brand-charcoal/30"
              aria-label="Search datasets"
            />
          </div>
        </div>

        <!-- Card / Table Toggle -->
        <div class="flex-shrink-0 flex items-center gap-1 bg-brand-cream/80 border border-brand-green/10 rounded-lg p-0.5" role="group" aria-label="View mode toggle">
          <button
            id="view-card"
            @click="viewMode = 'card'"
            :class="[
              'w-8 h-7 flex items-center justify-center rounded-md transition-all duration-200',
              viewMode === 'card' ? 'bg-white shadow text-brand-green' : 'text-brand-charcoal/30 hover:text-brand-green'
            ]"
            title="Card View"
            :aria-pressed="viewMode === 'card'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          </button>
          <button
            id="view-table"
            @click="viewMode = 'table'"
            :class="[
              'w-8 h-7 flex items-center justify-center rounded-md transition-all duration-200',
              viewMode === 'table' ? 'bg-white shadow text-brand-green' : 'text-brand-charcoal/30 hover:text-brand-green'
            ]"
            title="Table View"
            :aria-pressed="viewMode === 'table'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>
      </div>
    </header>

    <!-- ══════════════════════════════
         ITEMS SECTION  ·  flex-grow
         ══════════════════════════════ -->
    <div class="flex-grow flex flex-col overflow-hidden">

      <!-- Scrollable Content Area -->
      <div class="flex-grow overflow-y-auto px-6 py-8 flex justify-center" id="data-scroll-area">
        <div class="w-full max-w-[75vw]">

          <!-- SKELETON -->
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DataSkeleton v-for="i in 6" :key="i" />
          </div>

          <!-- CARD VIEW -->
          <div
            v-else-if="!isLoading && filteredData.length > 0 && viewMode === 'card'"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn"
          >
            <DataCard v-for="item in paginatedData" :key="item.id" :item="item" />
          </div>

          <!-- TABLE VIEW -->
          <div
            v-else-if="!isLoading && filteredData.length > 0 && viewMode === 'table'"
            class="bg-white rounded-md border border-brand-green/10 overflow-hidden animate-fadeIn"
          >
            <table class="w-full text-left">
              <thead>
                <tr class="bg-brand-cream/60 border-b border-brand-green/10">
                  <th class="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 w-10">#</th>
                  <th class="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 w-16">Img</th>
                  <th class="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Judul</th>
                  <th class="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Tahun</th>
                  <th class="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Author</th>
                  <th class="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Kategori</th>
                  <th class="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Format</th>
                  <th class="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Ukuran</th>
                  <th class="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40"></th>
                </tr>
              </thead>
              <tbody>
                <DataTableRow
                  v-for="(item, idx) in paginatedData"
                  :key="item.id"
                  :item="item"
                  :index="(currentPage - 1) * PAGE_SIZE + idx"
                />
              </tbody>
            </table>
          </div>

          <!-- EMPTY STATE -->
          <div v-else-if="!isLoading && filteredData.length === 0" class="flex flex-col items-center justify-center min-h-[400px] py-24 text-center">
            <div class="w-24 h-24 bg-brand-green/5 rounded-full flex items-center justify-center mb-6 border-2 border-brand-green/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand-green/25"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 class="text-xl font-black text-brand-green-dark mb-2">Data Tidak Ditemukan</h3>
            <p class="text-sm text-brand-charcoal/50 mb-8 max-w-sm font-medium">Tidak ada hasil untuk kata kunci "<span class="font-bold text-brand-charcoal/70">{{ searchQuery }}</span>" dalam kategori <span class="font-bold text-brand-charcoal/70">{{ activeTab === 'raw' ? 'RAW Data' : 'Statistic' }}</span>.</p>
            <button 
              @click="searchQuery = ''"
              class="px-6 py-2.5 rounded-full border-2 border-brand-green text-brand-green text-[11px] font-black uppercase tracking-widest hover:bg-brand-green hover:text-white transition-all duration-300"
            >
              Reset Pencarian
            </button>
          </div>

        </div>
      </div>

      <!-- ══════════════════════════════
           FOOTER PAGINATION
           ══════════════════════════════ -->
      <div
        v-if="!isLoading && totalPages > 1"
        class="flex-shrink-0 flex items-center justify-center px-6 h-14 bg-white/80 backdrop-blur-md border-t border-brand-green/5"
      >
        <div class="flex items-center gap-3">
          <p class="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest">
            Hal <span class="text-brand-green font-black">{{ currentPage }}</span> / <span class="text-brand-charcoal/60">{{ totalPages }}</span>
          </p>
          <div class="flex items-center gap-1" role="navigation" aria-label="Pagination">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="w-8 h-8 rounded-lg flex items-center justify-center border border-brand-green/10 text-brand-charcoal/40 hover:border-brand-green hover:text-brand-green disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button
              v-for="p in totalPages"
              :key="p"
              @click="currentPage = p"
              :class="[
                'w-8 h-8 rounded-lg text-xs font-black transition-all duration-200',
                currentPage === p
                  ? 'bg-brand-green text-white shadow-md'
                  : 'border border-brand-green/10 text-brand-charcoal/40 hover:border-brand-green hover:text-brand-green'
              ]"
              :aria-label="`Page ${p}`"
              :aria-current="currentPage === p ? 'page' : undefined"
            >
              {{ p }}
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="w-8 h-8 rounded-lg flex items-center justify-center border border-brand-green/10 text-brand-charcoal/40 hover:border-brand-green hover:text-brand-green disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
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
/* Custom thin scrollbar for content area */
#data-scroll-area::-webkit-scrollbar {
  width: 6px;
}
#data-scroll-area::-webkit-scrollbar-track {
  background: transparent;
}
#data-scroll-area::-webkit-scrollbar-thumb {
  background: #1E5C4B30;
  border-radius: 99px;
}
#data-scroll-area::-webkit-scrollbar-thumb:hover {
  background: #1E5C4B60;
}

/* Fade in animation for view transitions */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
