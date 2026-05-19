<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({ layout: 'data' })

const activeTab = ref<'mangrove' | 'danau' | 'mataair'>('mangrove')
const viewMode = ref<'card' | 'table'>('card')
const searchQuery = ref('')
const isLoading = ref(true)
const allData = ref<any[]>([])

const PAGE_SIZE = 6
const currentPage = ref(1)

onMounted(async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    const res = await fetch('/static/regulasi/catalog.json')
    allData.value = await res.json()
  } catch (e) {
    console.error('Failed to load catalog:', e)
  } finally {
    isLoading.value = false
  }
})

const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return allData.value.filter(item => {
    if (item.ekosistem !== activeTab.value) return false
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      item.jenis.toLowerCase().includes(q) ||
      item.nomor.toString().includes(q) ||
      item.tahun.toString().includes(q) ||
      item.tags.some((t: string) => t.toLowerCase().includes(q))
    )
  })
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / PAGE_SIZE))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredData.value.slice(start, start + PAGE_SIZE)
})

watch([activeTab, searchQuery], () => { currentPage.value = 1 })

function setTab(tab: 'mangrove' | 'danau' | 'mataair') {
  activeTab.value = tab
}

const tabLabel: Record<string, string> = {
  mangrove: 'Mangrove',
  danau: 'Danau',
  mataair: 'Mata Air',
}

const jenisColor: Record<string, string> = {
  UU:      'bg-brand-charcoal text-white',
  Perpres: 'bg-brand-green-dark text-white',
  PP:      'bg-brand-green text-white',
  Permen:  'bg-brand-blue text-white',
  SE:      'bg-brand-orange text-white',
}

useSeoMeta({
  title: 'Regulasi – PPEPD',
  description: 'Peraturan perundang-undangan terkait perlindungan dan pengelolaan ekosistem perairan darat: Mangrove, Danau, dan Mata Air.',
})
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-brand-cream/30">

    <!-- Toolbar -->
    <header class="relative flex-shrink-0 flex flex-col overflow-hidden bg-white/60 border-b border-brand-green/10" role="region" aria-label="Filter and search area">

      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-40%] left-[-5%] w-[50%] h-[160%] rounded-full bg-brand-green/8 blur-[80px]"></div>
        <div class="absolute top-[-20%] right-[-5%] w-[40%] h-[140%] rounded-full bg-brand-blue/8 blur-[80px]"></div>
      </div>

      <div class="h-[50px] flex-shrink-0"></div>

      <div class="flex justify-center py-3 relative z-10">
        <div class="flex items-center gap-3 w-[70vw]">

          <!-- Tab Switcher -->
          <div class="flex-shrink-0 flex items-center gap-1 bg-brand-cream/80 border border-brand-green/10 rounded-lg p-0.5" role="tablist">
            <button
              v-for="tab in (['mangrove', 'danau', 'mataair'] as const)"
              :key="tab"
              @click="setTab(tab)"
              :class="[
                'h-7 px-3 flex items-center justify-center rounded-md text-xs font-medium transition-all duration-200',
                activeTab === tab
                  ? 'bg-white shadow text-brand-green'
                  : 'text-brand-charcoal/30 hover:text-brand-green'
              ]"
              :aria-selected="activeTab === tab"
              role="tab"
            >
              {{ tabLabel[tab] }}
            </button>
          </div>

          <!-- Search -->
          <div class="flex-1 min-w-0 relative group">
            <div class="absolute inset-0 bg-brand-green/5 rounded-xl blur-xl group-focus-within:bg-brand-green/10 transition-all duration-500"></div>
            <div class="relative flex items-center">
              <div class="absolute left-4 text-brand-charcoal/30 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="`Cari regulasi ${tabLabel[activeTab].toLowerCase()}, nomor, atau tag...`"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-brand-green/10 focus:border-brand-green focus:outline-none focus:shadow-xl transition-all duration-300 text-brand-charcoal text-sm font-medium placeholder-brand-charcoal/30"
              />
            </div>
          </div>

          <!-- View Toggle -->
          <div class="flex-shrink-0 flex items-center gap-1 bg-brand-cream/80 border border-brand-green/10 rounded-lg p-0.5" role="group">
            <button
              @click="viewMode = 'card'"
              :class="[
                'w-8 h-7 flex items-center justify-center rounded-md transition-all duration-200',
                viewMode === 'card' ? 'bg-white shadow text-brand-green' : 'text-brand-charcoal/30 hover:text-brand-green'
              ]"
              title="Card View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </button>
            <button
              @click="viewMode = 'table'"
              :class="[
                'w-8 h-7 flex items-center justify-center rounded-md transition-all duration-200',
                viewMode === 'table' ? 'bg-white shadow text-brand-green' : 'text-brand-charcoal/30 hover:text-brand-green'
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
      <div class="flex-grow overflow-y-auto px-6 py-8 flex justify-center" id="reg-scroll-area">
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
            <NuxtLink
              v-for="item in paginatedData"
              :key="item.id"
              :to="`/regulasi/${item.id}`"
              class="group bg-white rounded-2xl border border-brand-green/10 p-6 flex flex-col gap-4 hover:border-brand-green hover:shadow-xl hover:shadow-brand-green/8 transition-all duration-300 hover:-translate-y-1"
            >
              <!-- Jenis badge & tahun -->
              <div class="flex items-center justify-between">
                <span :class="['px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest', jenisColor[item.jenis] ?? 'bg-brand-charcoal/10 text-brand-charcoal']">
                  {{ item.jenis }}
                </span>
                <span class="text-[10px] font-black text-brand-charcoal/30 uppercase tracking-widest">{{ item.tahun }}</span>
              </div>

              <!-- Nomor -->
              <p class="text-[11px] font-black text-brand-charcoal/40 uppercase tracking-widest -mt-1">
                No. {{ item.nomor }} Tahun {{ item.tahun }}
              </p>

              <!-- Judul -->
              <h3 class="text-base font-black text-brand-green-dark leading-snug group-hover:text-brand-green transition-colors line-clamp-3">
                {{ item.title }}
              </h3>

              <!-- Excerpt -->
              <p class="text-sm text-brand-charcoal/55 leading-relaxed font-medium line-clamp-3 flex-grow">
                {{ item.excerpt }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-brand-green/5">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="px-2 py-0.5 rounded-full bg-brand-cream border border-brand-green/10 text-[10px] font-bold text-brand-charcoal/50"
                >
                  #{{ tag }}
                </span>
              </div>
            </NuxtLink>
          </div>

          <!-- Table View -->
          <div
            v-else-if="filteredData.length > 0 && viewMode === 'table'"
            class="bg-white rounded-md border border-brand-green/20 [overflow:clip] animate-fadeIn"
          >
            <!-- Sticky header -->
            <div class="sticky top-0 z-10 flex items-center px-4 py-3 bg-brand-cream/95 backdrop-blur-sm border-b border-brand-green/15">
              <div class="w-20 flex-shrink-0 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Jenis</div>
              <div class="w-28 flex-shrink-0 px-2 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Nomor</div>
              <div class="flex-1 min-w-0 px-2 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Judul</div>
              <div class="w-10 flex-shrink-0"></div>
            </div>
            <!-- Rows -->
            <NuxtLink
              v-for="item in paginatedData"
              :key="item.id"
              :to="`/regulasi/${item.id}`"
              class="flex items-center px-4 py-3.5 border-b border-brand-green/5 last:border-0 hover:bg-brand-cream/50 transition-colors group"
            >
              <div class="w-20 flex-shrink-0">
                <span :class="['px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest', jenisColor[item.jenis] ?? 'bg-brand-charcoal/10 text-brand-charcoal']">
                  {{ item.jenis }}
                </span>
              </div>
              <div class="w-28 flex-shrink-0 px-2 text-xs font-bold text-brand-charcoal/50">
                No. {{ item.nomor }}/{{ item.tahun }}
              </div>
              <div class="flex-1 min-w-0 px-2">
                <p class="text-sm font-bold text-brand-green-dark group-hover:text-brand-green transition-colors truncate">{{ item.title }}</p>
              </div>
              <div class="w-10 flex-shrink-0 flex justify-end">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand-charcoal/20 group-hover:text-brand-green group-hover:translate-x-0.5 transition-all"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </NuxtLink>
          </div>

          <!-- Empty State -->
          <div v-else-if="!isLoading && filteredData.length === 0" class="flex flex-col items-center justify-center min-h-[400px] py-24 text-center">
            <div class="w-24 h-24 bg-brand-green/5 rounded-full flex items-center justify-center mb-6 border-2 border-brand-green/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand-green/25"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 class="text-xl font-black text-brand-green-dark mb-2">Tidak Ditemukan</h3>
            <p class="text-sm text-brand-charcoal/50 mb-8 max-w-sm font-medium">
              Tidak ada regulasi untuk "<span class="font-bold text-brand-charcoal/70">{{ searchQuery }}</span>" dalam ekosistem
              <span class="font-bold text-brand-charcoal/70">{{ tabLabel[activeTab] }}</span>.
            </p>
            <button
              @click="searchQuery = ''"
              class="px-6 py-2.5 rounded-full border-2 border-brand-green text-brand-green text-[11px] font-black uppercase tracking-widest hover:bg-brand-green hover:text-white transition-all duration-300"
            >
              Reset Pencarian
            </button>
          </div>

        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="!isLoading && totalPages > 1"
        class="flex-shrink-0 flex items-center justify-center px-6 h-14 bg-white/80 backdrop-blur-md border-t border-brand-green/5"
      >
        <div class="flex items-center gap-3">
          <p class="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest">
            Hal <span class="text-brand-green font-black">{{ currentPage }}</span> / <span class="text-brand-charcoal/60">{{ totalPages }}</span>
          </p>
          <div class="flex items-center gap-1">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="w-8 h-8 rounded-lg flex items-center justify-center border border-brand-green/10 text-brand-charcoal/40 hover:border-brand-green hover:text-brand-green disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
            >
              {{ p }}
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="w-8 h-8 rounded-lg flex items-center justify-center border border-brand-green/10 text-brand-charcoal/40 hover:border-brand-green hover:text-brand-green disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
#reg-scroll-area::-webkit-scrollbar { width: 6px; }
#reg-scroll-area::-webkit-scrollbar-track { background: transparent; }
#reg-scroll-area::-webkit-scrollbar-thumb { background: #1E5C4B30; border-radius: 99px; }
#reg-scroll-area::-webkit-scrollbar-thumb:hover { background: #1E5C4B60; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
</style>
