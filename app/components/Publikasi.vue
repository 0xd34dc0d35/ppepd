<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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

const publications = ref<any[]>([])
const isLoading = ref(true)

const scrollContainer = ref<HTMLElement | null>(null)
let autoPlayInterval: any = null

const scrollNext = () => {
  if (!scrollContainer.value) return
  const c = scrollContainer.value
  const cardW = c.querySelector('a')?.clientWidth ?? 220
  const gap = 24
  const scrollAmt = (cardW + gap) * 2
  if (c.scrollLeft >= c.scrollWidth - c.clientWidth - 10) {
    c.scrollTo({ left: 0, behavior: 'smooth' })
  } else {
    c.scrollBy({ left: scrollAmt, behavior: 'smooth' })
  }
}

const scrollPrev = () => {
  if (!scrollContainer.value) return
  const c = scrollContainer.value
  const cardW = c.querySelector('a')?.clientWidth ?? 220
  const gap = 24
  const scrollAmt = (cardW + gap) * 2
  if (c.scrollLeft <= 10) {
    c.scrollTo({ left: c.scrollWidth, behavior: 'smooth' })
  } else {
    c.scrollBy({ left: -scrollAmt, behavior: 'smooth' })
  }
}

const startAutoPlay = () => { autoPlayInterval = setInterval(scrollNext, 6000) }
const stopAutoPlay  = () => { if (autoPlayInterval) clearInterval(autoPlayInterval) }

onMounted(async () => {
  try {
    const res = await $fetch<{ data: any[] }>(`${apiBase}/publications`, {
      params: { limit: '20', status: 'published' }
    })
    publications.value = res.data ?? []
  } catch {
    publications.value = []
  } finally {
    isLoading.value = false
    setTimeout(startAutoPlay, 200)
  }
})

onUnmounted(() => stopAutoPlay())
</script>

<template>
  <section id="publikasi" class="scroll-mt-24 px-6">
    <div class="container mx-auto px-4">

      <!-- Header -->
      <div class="relative mb-10">
        <div class="mx-auto max-w-2xl text-center">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-klh-green-600/60 mb-3">Repositori Ilmiah</p>
          <h2 class="text-4xl font-bold text-klh-green-800 tracking-tight">Publikasi</h2>
          <p class="text-ink-500 mt-2 text-sm">Laporan, jurnal, dan panduan resmi pengelolaan ekosistem perairan darat.</p>
        </div>
        <div class="absolute bottom-0 right-0 hidden md:flex items-center gap-3">
          <NuxtLink
            to="/publikasi"
            class="h-8 px-4 flex items-center text-[11px] font-bold uppercase tracking-widest text-klh-green-600 border border-line rounded-full hover:bg-klh-green-600 hover:text-white transition-all duration-300"
          >
            Lihat Semua
          </NuxtLink>
          <div class="flex gap-1.5">
            <button
              @click="scrollPrev(); stopAutoPlay(); startAutoPlay()"
              class="w-9 h-9 rounded-full border border-line flex items-center justify-center text-klh-green-600/40 hover:text-klh-green-600 hover:border-klh-green-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button
              @click="scrollNext(); stopAutoPlay(); startAutoPlay()"
              class="w-9 h-9 rounded-full border border-line flex items-center justify-center text-klh-green-600/40 hover:text-klh-green-600 hover:border-klh-green-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Skeleton -->
      <div v-if="isLoading" class="flex gap-6 overflow-hidden pb-4">
        <div v-for="i in 5" :key="i" class="flex-shrink-0 w-[200px]">
          <div class="animate-pulse">
            <div class="aspect-[2/3] rounded-xl bg-ink-900/8 shimmer mb-3"></div>
            <div class="h-3 w-16 bg-ink-900/8 rounded shimmer mb-2"></div>
            <div class="h-4 w-full bg-ink-900/8 rounded shimmer mb-1"></div>
            <div class="h-4 w-3/4 bg-ink-900/8 rounded shimmer"></div>
          </div>
        </div>
      </div>

      <!-- Cards -->
      <div
        v-else
        ref="scrollContainer"
        class="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar scroll-smooth"
        @mouseenter="stopAutoPlay"
        @mouseleave="startAutoPlay"
      >
        <NuxtLink
          v-for="pub in publications"
          :key="pub.slug"
          :to="`/publikasi/${pub.slug}`"
          class="group flex-shrink-0 w-[200px] snap-start block"
        >
          <!-- Cover -->
          <div class="relative aspect-[2/3] rounded-xl overflow-hidden bg-ink-900/5 mb-3 shadow-klh-1 group-hover:shadow-klh-3 transition-all duration-500">
            <img
              v-if="pub.cover_image"
              :src="pub.cover_image"
              :alt="pub.title"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-klh-green-600/10 to-klh-blue-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-klh-green-600/30"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <!-- Category badge -->
            <div class="absolute top-2 left-2">
              <span :class="['px-2 py-0.5 rounded-full text-white text-[11px] font-bold uppercase tracking-widest', CATEGORY_COLORS[pub.category_code] ?? 'bg-ink-400']">
                {{ pub.category_name ?? pub.category_code }}
              </span>
            </div>
            <!-- Featured star -->
            <div v-if="pub.is_featured" class="absolute top-2 right-2 w-5 h-5 rounded-full bg-klh-orange-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="text-white"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
          </div>

          <!-- Meta -->
          <p class="text-klh-green-600 text-[11px] font-bold mb-1">{{ pub.year }}</p>
          <h3 class="text-[13px] font-bold text-klh-green-800 leading-snug group-hover:text-klh-green-600 transition-colors line-clamp-2">{{ pub.title }}</h3>
          <p v-if="pub.author" class="text-ink-500 text-[11px] font-medium mt-1 truncate">{{ pub.author }}</p>
        </NuxtLink>

        <!-- Lihat semua card -->
        <NuxtLink
          to="/publikasi"
          class="group flex-shrink-0 w-[200px] snap-start flex flex-col items-center justify-center aspect-[2/3] rounded-xl border-2 border-dashed border-line hover:border-klh-green-200 hover:bg-klh-green-600/3 transition-all duration-300 mt-0 mb-3 text-center px-4"
        >
          <div class="w-10 h-10 rounded-full border border-line flex items-center justify-center mb-3 group-hover:bg-klh-green-600 group-hover:border-klh-green-600 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-klh-green-600/50 group-hover:text-white transition-colors"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
          <p class="text-[11px] font-bold text-ink-500 group-hover:text-klh-green-600 transition-colors uppercase tracking-widest leading-tight">Lihat<br/>Semua</p>
        </NuxtLink>
      </div>

    </div>
  </section>
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
</style>
