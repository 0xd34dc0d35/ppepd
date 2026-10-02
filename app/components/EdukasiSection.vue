<template>
  <section class="pt-4 pb-4 overflow-hidden relative">
    <div class="container mx-auto px-6">
      <!-- Section Header -->
      <div class="relative mb-12">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-4xl font-bold text-klh-green-800 tracking-tight">
            Edukasi dan Campaign
          </h2>
        </div>

        <!-- Navigation -->
        <div class="absolute bottom-0 right-0 hidden md:flex gap-2">
          <button
            :disabled="isLoading"
            class="w-10 h-10 rounded-full border border-line flex items-center justify-center text-klh-green-600/40 hover:text-klh-green-600 hover:border-klh-green-600 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            @click="scrollPrev"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            :disabled="isLoading"
            class="w-10 h-10 rounded-full border border-line flex items-center justify-center text-klh-green-600/40 hover:text-klh-green-600 hover:border-klh-green-600 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            @click="scrollNext"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <!-- Skeleton -->
      <div v-if="isLoading" class="flex gap-6 overflow-hidden pb-10">
        <div
          v-for="i in 4"
          :key="'skel-' + i"
          class="min-w-[calc(100%-48px)] md:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] shrink-0"
        >
          <div class="h-[45vh] rounded-xl bg-ink-900/10 animate-pulse relative overflow-hidden">
            <div class="absolute inset-0 shimmer" />
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex items-center justify-center h-48 text-ink-500 text-sm">
        Gagal memuat konten. Silakan muat ulang halaman.
      </div>

      <!-- Carousel -->
      <div
        v-else
        ref="scrollContainer"
        class="flex gap-6 overflow-x-auto snap-x snap-mandatory pt-4 pb-10 no-scrollbar scroll-smooth"
      >
        <div
          v-for="(item, idx) in items"
          :key="item.id"
          class="min-w-[calc(100%-48px)] md:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] snap-start shrink-0"
        >
          <div class="card-wrap group relative h-[45vh] rounded-xl overflow-hidden bg-ink-900
                      shadow-klh-3 transition-all duration-500 hover:-translate-y-2
                      hover:shadow-[0_8px_40px_-8px_rgba(0,89,82,0.7),0_0_0_1px_rgba(0,89,82,0.15)]">

            <div class="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-0 transition-all duration-300 pointer-events-none z-20" />
            <div class="card-sweep" />

            <div class="card-inner bg-ink-900 overflow-hidden">
              <img
                :src="item.image"
                :alt="item.title"
                loading="lazy"
                decoding="async"
                class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-klh-green-800 via-klh-green-800/20 to-transparent" />

              <div class="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <div class="mb-4 flex gap-2">
                  <span class="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-widest border border-white/10">
                    {{ item.category }}
                  </span>
                  <span :class="[
                    'px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-widest border border-white/10',
                    item.type === 'edukasi' ? 'bg-klh-green-600/60 text-white' : 'bg-klh-orange-500/60 text-on-orange'
                  ]">
                    {{ item.type === 'edukasi' ? 'Edukasi' : 'Campaign' }}
                  </span>
                </div>
                <h3 class="text-2xl font-bold text-white leading-tight mb-4 group-hover:text-klh-orange-400 transition-colors duration-300">
                  {{ item.title }}
                </h3>
                <p class="text-white/70 text-sm font-medium line-clamp-3 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  {{ item.excerpt }}
                </p>
                <NuxtLink
                  :to="`/edukasi/${item.id}`"
                  class="w-full py-4 bg-white text-klh-green-800 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-klh-green-600 hover:text-white transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 text-center block"
                >
                  Baca Selengkapnya
                </NuxtLink>
              </div>

              <div class="absolute top-8 right-8 text-white/10 text-6xl font-bold italic tracking-tight select-none z-10">
                0{{ idx + 1 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface EduItem {
  id: string
  type: 'edukasi' | 'campaign'
  title: string
  excerpt: string
  category: string
  image: string
  author: string
  tags: string[]
}

const scrollContainer = ref<HTMLElement | null>(null)
const items = ref<EduItem[]>([])
const isLoading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('/static/edukasi/catalog.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    items.value = await res.json()
  } catch {
    error.value = true
  } finally {
    isLoading.value = false
  }
})

const scrollNext = () => {
  if (!scrollContainer.value) return
  const cols = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1
  scrollContainer.value.scrollBy({ left: scrollContainer.value.clientWidth / cols, behavior: 'smooth' })
}

const scrollPrev = () => {
  if (!scrollContainer.value) return
  const cols = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1
  scrollContainer.value.scrollBy({ left: -(scrollContainer.value.clientWidth / cols), behavior: 'smooth' })
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ─── Skeleton shimmer ─── */
.shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

/* ─── Border sweep beam ─── */
/*
  Elemen persegi (200% × 200%) yang dirotasikan dari tengah card.
  Conic-gradient membentuk "sorotan" sempit (±35°) yang terlihat
  di gap antara card-wrap dan card-inner — efek border mengitari keliling.
*/
.card-sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent        0deg,
    transparent      290deg,
    rgba(0, 89, 82, 0.35)  315deg,
    rgba(20, 125, 239, 0.85) 342deg,
    rgba(255,255,255, 0.55)  350deg,
    rgba(20, 125, 239, 0.85) 358deg,
    rgba(0, 89, 82, 0.35)  360deg
  );
  transform: translate(-50%, -50%) rotate(0deg);
  opacity: 0;
  transition: opacity 0.35s ease;
  animation: sweep-border 2.4s linear infinite paused;
  z-index: 1;
}

.card-wrap:hover .card-sweep {
  opacity: 1;
  animation-play-state: running;
}

@keyframes sweep-border {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}

/* ─── Inner card: border-thickness transition ─── */
/*
  Default : inset 1px  → border tipis
  Hover   : inset 2px  → border lebih tebal, sweep beam lebih terlihat
*/
.card-inner {
  position: absolute;
  inset: 1px;
  border-radius: 11px; /* rounded-xl (12px) − 1px */
  transition: inset 0.3s ease, border-radius 0.3s ease;
  z-index: 10;
}

.card-wrap:hover .card-inner {
  inset: 2px;
  border-radius: 10px; /* rounded-xl (12px) − 2px */
}
</style>
