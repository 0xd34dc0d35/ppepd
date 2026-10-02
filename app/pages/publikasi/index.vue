<script setup lang="ts">
import { ref, computed, watch } from 'vue'

definePageMeta({ layout: 'data' })

const { public: { apiBase } } = useRuntimeConfig()

const CATEGORY_COLORS: Record<string, string> = {
  laporan:   'bg-klh-blue-500',
  jurnal:    'bg-purple-500',
  buku:      'bg-klh-green-500',
  regulasi:  'bg-klh-orange-500',
  data:      'bg-klh-green-600',
  prosiding: 'bg-klh-blue-500',
  lainnya:   'bg-ink-400',
}

const CATEGORY_TEXT: Record<string, string> = {
  laporan:   'text-klh-blue-600 bg-klh-blue-50 border-klh-blue-200',
  jurnal:    'text-purple-600 bg-purple-50 border-purple-200',
  buku:      'text-klh-green-600 bg-klh-green-50 border-klh-green-200',
  regulasi:  'text-klh-orange-600 bg-klh-orange-50 border-klh-orange-200',
  data:      'text-klh-green-600 bg-klh-green-600/5 border-line',
  prosiding: 'text-klh-blue-600 bg-klh-blue-50 border-klh-blue-200',
  lainnya:   'text-ink-500 bg-surface-2 border-line',
}

const activeCategory = ref<string>('semua')
const viewMode = ref<'card' | 'table'>('card')
const searchQuery = ref('')
const PAGE_SIZE = 9
const currentPage = ref(1)

const { data: categoriesRaw } = await useAsyncData('pub-categories', () =>
  $fetch<{ data: any[] }>(`${apiBase}/publication-categories`)
)
const categories = computed(() => categoriesRaw.value?.data ?? [])

const apiParams = computed(() => {
  const p: Record<string, string> = { limit: '200', status: 'published' }
  if (activeCategory.value !== 'semua') p.category = activeCategory.value
  return p
})

const { data: rawData, status } = await useAsyncData(
  () => `pub-${activeCategory.value}`,
  () => $fetch<{ data: any[]; total: number }>(`${apiBase}/publications`, { params: apiParams.value }),
  { watch: [activeCategory] }
)

const isLoading = computed(() => status.value === 'pending')

const allItems = computed(() => rawData.value?.data ?? [])

const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return allItems.value
  return allItems.value.filter(item =>
    item.title?.toLowerCase().includes(q) ||
    item.author?.toLowerCase().includes(q) ||
    item.institution?.toLowerCase().includes(q) ||
    item.summary?.toLowerCase().includes(q) ||
    (item.tags ?? []).some((t: string) => t.toLowerCase().includes(q))
  )
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / PAGE_SIZE))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredData.value.slice(start, start + PAGE_SIZE)
})

watch([activeCategory, searchQuery], () => { currentPage.value = 1 })

useSeoMeta({
  title: 'Katalog Publikasi – PPEPD',
  description: 'Repositori laporan, jurnal, buku panduan, dan regulasi terkait perlindungan dan pengelolaan ekosistem perairan darat.',
})
</script>

<template>
  <div class="flex flex-col h-[calc(100dvh-var(--klh-header-h))] overflow-hidden bg-surface-bg/30">
    <h1 class="sr-only">Katalog Publikasi</h1>
    <h2 class="sr-only">Daftar publikasi</h2>

    <!-- Toolbar -->
    <header class="relative flex-shrink-0 flex flex-col overflow-hidden bg-white/60 border-b border-line" role="region" aria-label="Filter publikasi">

      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-40%] left-[-5%] w-[50%] h-[160%] rounded-full bg-klh-green-600/8 blur-[80px]"></div>
        <div class="absolute top-[-20%] right-[-5%] w-[40%] h-[140%] rounded-full bg-klh-blue-500/6 blur-[80px]"></div>
      </div>

      

      <div class="flex justify-center py-3 relative z-10">
        <div class="flex items-center gap-3 w-[75vw]">

          <!-- Kategori Tab -->
          <div class="flex-shrink-0 flex items-center gap-1 bg-surface-bg/80 border border-line rounded-lg p-0.5 max-w-[60vw] overflow-x-auto no-scrollbar" role="tablist">
            <button
              @click="activeCategory = 'semua'"
              :class="[
                'flex-shrink-0 h-7 px-3 flex items-center justify-center rounded-md text-xs font-medium transition-all duration-200',
                activeCategory === 'semua'
                  ? 'bg-white shadow-klh-1 text-klh-green-600'
                  : 'text-ink-400 hover:text-klh-green-600'
              ]"
              role="tab"
            >Semua</button>
            <button
              v-for="cat in categories"
              :key="cat.code"
              @click="activeCategory = cat.code"
              :class="[
                'flex-shrink-0 h-7 px-3 flex items-center justify-center rounded-md text-xs font-medium transition-all duration-200',
                activeCategory === cat.code
                  ? 'bg-white shadow-klh-1 text-klh-green-600'
                  : 'text-ink-400 hover:text-klh-green-600'
              ]"
              role="tab"
            >{{ cat.name }}</button>
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
                placeholder="Cari judul, penulis, atau topik..."
                class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-line focus:border-klh-green-600 focus:outline-none focus:shadow-klh-3 transition-all duration-300 text-ink-900 text-sm font-medium placeholder-ink-400"
              />
            </div>
          </div>

          <!-- View Toggle -->
          <div class="flex-shrink-0 flex items-center gap-1 bg-surface-bg/80 border border-line rounded-lg p-0.5" role="group">
            <button @click="viewMode = 'card'" :class="['w-8 h-7 flex items-center justify-center rounded-md transition-all duration-200', viewMode === 'card' ? 'bg-white shadow-klh-1 text-klh-green-600' : 'text-ink-400 hover:text-klh-green-600']" title="Card View">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </button>
            <button @click="viewMode = 'table'" :class="['w-8 h-7 flex items-center justify-center rounded-md transition-all duration-200', viewMode === 'table' ? 'bg-white shadow-klh-1 text-klh-green-600' : 'text-ink-400 hover:text-klh-green-600']" title="Table View">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>

        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="flex-grow flex flex-col overflow-hidden">
      <div class="flex-grow overflow-y-auto px-6 py-8 flex justify-center" id="pub-scroll-area">
        <div class="w-full max-w-[75vw]">

          <!-- Skeleton -->
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="animate-pulse">
              <div class="aspect-[3/4] rounded-xl bg-ink-900/8 shimmer mb-3"></div>
              <div class="h-3 w-16 bg-ink-900/8 rounded shimmer mb-2"></div>
              <div class="h-5 w-full bg-ink-900/8 rounded shimmer"></div>
            </div>
          </div>

          <!-- Card View -->
          <div v-else-if="filteredData.length > 0 && viewMode === 'card'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            <NuxtLink
              v-for="pub in paginatedData"
              :key="pub.slug"
              :to="`/publikasi/${pub.slug}`"
              class="group flex gap-4 bg-white rounded-2xl border border-line p-4 hover:border-klh-green-200 hover:shadow-klh-3 transition-all duration-300"
            >
              <!-- Cover Thumbnail -->
              <div class="flex-shrink-0 w-[80px] aspect-[2/3] rounded-lg overflow-hidden bg-ink-900/5 relative">
                <img
                  v-if="pub.cover_image"
                  :src="pub.cover_image"
                  :alt="pub.title"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-klh-green-600/8 to-klh-blue-500/8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-klh-green-600/30"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <div v-if="pub.is_featured" class="absolute top-1 right-1 w-4 h-4 rounded-full bg-klh-orange-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor" class="text-white"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <div v-if="pub.download_access === 'terdaftar'" class="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-klh-orange-500/90 flex items-center justify-center" title="Pengguna Terdaftar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <div class="flex items-center gap-1.5 mb-2 flex-wrap">
                    <span :class="['px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-widest border', CATEGORY_TEXT[pub.category_code] ?? 'text-ink-500 bg-surface-2 border-line']">
                      {{ pub.category_name ?? pub.category_code }}
                    </span>
                    <span class="text-ink-400 text-[11px] font-bold">{{ pub.year }}</span>
                  </div>
                  <h3 class="text-sm font-bold text-klh-green-800 leading-snug group-hover:text-klh-green-600 transition-colors line-clamp-3">{{ pub.title }}</h3>
                </div>
                <div class="mt-2">
                  <p v-if="pub.author" class="text-[11px] text-ink-500 font-medium truncate">{{ pub.author }}</p>
                  <div class="mt-2 flex items-center gap-3 text-[11px] text-ink-400 font-medium">
                    <span v-if="pub.pages" class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      {{ pub.pages }} hal
                    </span>
                    <span class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      {{ pub.views_count ?? 0 }}
                    </span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Table View -->
          <div
            v-else-if="filteredData.length > 0 && viewMode === 'table'"
            class="bg-white rounded-md border border-line [overflow:clip] animate-fadeIn"
          >
            <div class="sticky top-0 z-10 flex items-center px-4 py-3 bg-surface-bg/95 backdrop-blur-sm border-b border-line">
              <div class="w-16 flex-shrink-0 text-[11px] font-bold uppercase tracking-widest text-ink-500">Cover</div>
              <div class="flex-1 min-w-0 px-4 text-[11px] font-bold uppercase tracking-widest text-ink-500">Judul</div>
              <div class="w-28 flex-shrink-0 px-2 text-[11px] font-bold uppercase tracking-widest text-ink-500">Kategori</div>
              <div class="w-16 flex-shrink-0 px-2 text-[11px] font-bold uppercase tracking-widest text-ink-500">Tahun</div>
              <div class="w-10 flex-shrink-0"></div>
            </div>
            <NuxtLink
              v-for="pub in paginatedData"
              :key="pub.slug"
              :to="`/publikasi/${pub.slug}`"
              class="group flex items-center px-4 py-3 border-b border-line last:border-b-0 hover:bg-klh-green-600/2 transition-colors"
            >
              <div class="w-16 flex-shrink-0">
                <div class="w-10 aspect-[2/3] rounded overflow-hidden bg-ink-900/5">
                  <img v-if="pub.cover_image" :src="pub.cover_image" :alt="pub.title" loading="lazy" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-klh-green-600/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-klh-green-600/30"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </div>
                </div>
              </div>
              <div class="flex-1 min-w-0 px-4">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-bold text-klh-green-800 group-hover:text-klh-green-600 transition-colors line-clamp-1">{{ pub.title }}</p>
                  <span v-if="pub.download_access === 'terdaftar'" class="flex-shrink-0 w-4 h-4 rounded-full bg-klh-orange-100 flex items-center justify-center" title="Pengguna Terdaftar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-klh-orange-600"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                </div>
                <p v-if="pub.author" class="text-[11px] text-ink-500 font-medium mt-0.5">{{ pub.author }}</p>
              </div>
              <div class="w-28 flex-shrink-0 px-2">
                <span :class="['px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-widest border', CATEGORY_TEXT[pub.category_code] ?? 'text-ink-500 bg-surface-2 border-line']">
                  {{ pub.category_name ?? pub.category_code }}
                </span>
              </div>
              <div class="w-16 flex-shrink-0 px-2 text-xs font-bold text-ink-500">{{ pub.year }}</div>
              <div class="w-10 flex-shrink-0 flex justify-end">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-ink-400 group-hover:text-klh-green-600 transition-colors"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </NuxtLink>
          </div>

          <!-- Empty State -->
          <div v-else-if="!isLoading" class="flex flex-col items-center justify-center min-h-[400px] py-24 text-center">
            <div class="w-24 h-24 bg-klh-green-600/5 rounded-full flex items-center justify-center mb-6 border-2 border-line">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-klh-green-600/25"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <h3 class="text-xl font-bold text-klh-green-800 mb-2">Tidak Ditemukan</h3>
            <p class="text-sm text-ink-500 mb-8 max-w-sm font-medium">
              Tidak ada publikasi yang cocok dengan pencarian "<span class="font-bold text-ink-700">{{ searchQuery }}</span>".
            </p>
            <button @click="searchQuery = ''; activeCategory = 'semua'" class="px-6 py-2.5 rounded-full border-2 border-klh-green-600 text-klh-green-600 text-[11px] font-bold uppercase tracking-widest hover:bg-klh-green-600 hover:text-white transition-all duration-300">
              Reset Filter
            </button>
          </div>

        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!isLoading && totalPages > 1" class="flex-shrink-0 flex items-center justify-center px-6 h-14 bg-surface border-t border-line">
        <div class="flex items-center gap-3">
          <p class="text-[11px] font-bold text-ink-500 uppercase tracking-widest">
            Hal <span class="text-klh-green-600 font-bold">{{ currentPage }}</span> / <span class="text-ink-500">{{ totalPages }}</span>
          </p>
          <div class="flex items-center gap-1">
            <button @click="currentPage--" :disabled="currentPage === 1" class="w-8 h-8 rounded-lg flex items-center justify-center border border-line text-ink-500 hover:border-klh-green-600 hover:text-klh-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button
              v-for="p in totalPages"
              :key="p"
              @click="currentPage = p"
              :class="['w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200', currentPage === p ? 'bg-klh-green-600 text-white shadow-klh-2' : 'border border-line text-ink-500 hover:border-klh-green-600 hover:text-klh-green-600']"
            >{{ p }}</button>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="w-8 h-8 rounded-lg flex items-center justify-center border border-line text-ink-500 hover:border-klh-green-600 hover:text-klh-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.shimmer { position: relative; overflow: hidden; }
.shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0));
  animation: shimmer 2s infinite;
}
@keyframes shimmer { 100% { transform: translateX(100%); } }
#pub-scroll-area::-webkit-scrollbar { width: 6px; }
#pub-scroll-area::-webkit-scrollbar-track { background: transparent; }
#pub-scroll-area::-webkit-scrollbar-thumb { background: rgb(var(--klh-g-600) / .19); border-radius: 99px; }
#pub-scroll-area::-webkit-scrollbar-thumb:hover { background: rgb(var(--klh-g-600) / .38); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
</style>
