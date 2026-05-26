<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const { public: { apiBase } } = useRuntimeConfig()

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  return `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

const events = ref<any[]>([])
const isLoading = ref(true)

const scrollContainer = ref<HTMLElement | null>(null)
let autoPlayInterval: any = null

const scrollNext = () => {
  if (scrollContainer.value) {
    const container = scrollContainer.value
    const scrollAmount = container.clientWidth * 0.8
    const maxScroll = container.scrollWidth - container.clientWidth
    if (container.scrollLeft >= maxScroll - 10) {
      container.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }
}

const scrollPrev = () => {
  if (scrollContainer.value) {
    const container = scrollContainer.value
    const scrollAmount = container.clientWidth * 0.8
    if (container.scrollLeft <= 10) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }
}

const startAutoPlay = () => {
  autoPlayInterval = setInterval(scrollNext, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
}

onMounted(async () => {
  try {
    const res = await $fetch<{ data: any[] }>(`${apiBase}/berita-events/public`, {
      params: { featured: 'true', limit: '20' }
    })
    events.value = res.data ?? []
  } catch {
    events.value = []
  } finally {
    isLoading.value = false
    setTimeout(startAutoPlay, 100)
  }
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <section id="events" class="scroll-mt-24 px-6">
    <div class="container mx-auto px-4">
      <div class="relative mb-12">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-4xl font-black text-brand-green-dark tracking-tight">Berita & Events</h2>
          <p class="text-brand-charcoal/60 mt-2">Aktivitas terbaru dalam perlindungan ekosistem perairan.</p>
        </div>
        <div class="absolute bottom-0 right-0 hidden md:flex gap-2">
          <div @click="scrollPrev(); stopAutoPlay(); startAutoPlay()" class="w-10 h-10 rounded-full border border-brand-green/10 flex items-center justify-center text-brand-green/40 hover:text-brand-green hover:border-brand-green transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <div @click="scrollNext(); stopAutoPlay(); startAutoPlay()" class="w-10 h-10 rounded-full border border-brand-green/10 flex items-center justify-center text-brand-green/40 hover:text-brand-green hover:border-brand-green transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>

      <!-- Skeleton Loader -->
      <div v-if="isLoading" class="flex gap-6 overflow-hidden pb-8 no-scrollbar">
        <div v-for="i in 3" :key="'skeleton-' + i" class="min-w-[300px] md:min-w-[400px]">
          <div class="glass-card overflow-hidden border-2 border-transparent rounded-2xl h-full animate-pulse bg-brand-charcoal/5">
            <div class="aspect-[16/10] bg-brand-charcoal/10 shimmer"></div>
            <div class="p-6 space-y-4">
              <div class="h-3 w-20 bg-brand-charcoal/10 rounded shimmer"></div>
              <div class="h-6 w-full bg-brand-charcoal/10 rounded shimmer"></div>
              <div class="h-4 w-32 bg-brand-charcoal/10 rounded shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Event Cards -->
      <div v-else ref="scrollContainer" class="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 no-scrollbar scroll-smooth" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
        <NuxtLink v-for="event in events" :key="event.slug" :to="`/berita-events/${event.slug}`" class="min-w-[300px] md:min-w-[400px] snap-start block">
          <div class="group glass-card overflow-hidden border-2 border-transparent hover:border-brand-green hover:shadow-2xl hover:shadow-brand-green/10 transition-all duration-500 rounded-2xl h-full">
            <div class="aspect-[16/10] overflow-hidden relative">
              <img :src="event.hero_image" :alt="event.title" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div class="absolute top-4 left-4 flex gap-2">
                <span :class="[
                  'px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest',
                  event.type === 'berita' ? 'bg-brand-blue' : 'bg-brand-green'
                ]">{{ event.type === 'berita' ? 'Berita' : 'Event' }}</span>
                <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest">{{ event.category }}</span>
              </div>
            </div>
            <div class="p-6">
              <div class="text-brand-green text-xs font-bold mb-2">{{ formatDate(event.published_at) }}</div>
              <h3 class="text-xl font-black text-brand-green-dark leading-snug group-hover:text-brand-green transition-colors">{{ event.title }}</h3>
              <div class="mt-4 flex items-center text-brand-charcoal/40 text-sm font-bold group-hover:text-brand-green transition-colors">
                Baca Selengkapnya
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="ml-2 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
          </div>
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
  top: 0; right: 0; bottom: 0; left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0));
  animation: shimmer 2s infinite;
}
@keyframes shimmer { 100% { transform: translateX(100%); } }
</style>
