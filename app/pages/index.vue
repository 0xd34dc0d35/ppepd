<script setup lang="ts">
const events = [
  { id: 1, title: 'Restorasi Mangrove Teluk Jakarta', date: '15 Mei 2026', image: '/event-1.png', category: 'Restorasi' },
  { id: 2, title: 'Monitoring Air Danau Toba', date: '12 Mei 2026', image: '/event-2.png', category: 'Monitoring' },
  { id: 3, title: 'Ekspedisi Kapuas Hulu', date: '10 Mei 2026', image: '/event-3.png', category: 'Ekspedisi' },
  { id: 4, title: 'Workshop Konservasi PPEPD', date: '08 Mei 2026', image: '/event-1.png', category: 'Workshop' },
  { id: 5, title: 'Seminar Ekosistem Darat', date: '05 Mei 2026', image: '/event-2.png', category: 'Seminar' },
  { id: 6, title: 'Penanaman Pohon Riparian', date: '01 Mei 2026', image: '/event-3.png', category: 'Konservasi' },
  { id: 7, title: 'Audit Lingkungan Industri', date: '28 April 2026', image: '/event-1.png', category: 'Audit' },
  { id: 8, title: 'Pelatihan Ranger Perairan', date: '25 April 2026', image: '/event-2.png', category: 'Pelatihan' },
  { id: 9, title: 'Festival Sungai Bersih', date: '20 April 2026', image: '/event-3.png', category: 'Festival' },
]

useSeoMeta({
  title: 'PPEPD - Sistem Informasi Ekosistem Perairan Darat',
  description: 'Perlindungan dan Pengelolaan Ekosistem Perairan Darat.',
  ogTitle: 'PPEPD',
  ogDescription: 'Sistem perairan darat terpadu.',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="-mt-12 -mx-6">
    <div class="space-y-24 pb-24">
      <!-- Hero & Services Group -->
      <div class="md:min-h-[100vh] px-6 pt-[70px] pb-[2vh] flex flex-col justify-between">
        <div class="flex-grow flex flex-col justify-center">
          <Hero/>
        </div>
        <div class="mt-4 flex-shrink-0">
          <ServiceLinks />
        </div>
      </div>
      <!-- Event Carousel Section -->
      <section id="events" class="scroll-mt-24 px-6">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-4xl font-black text-brand-green-dark tracking-tight">Event Terakhir</h2>
            <p class="text-brand-charcoal/60 mt-2">Aktivitas terbaru dalam perlindungan ekosistem perairan.</p>
          </div>
          <div class="hidden md:flex gap-2">
            <div class="w-10 h-10 rounded-full border border-brand-green/10 flex items-center justify-center text-brand-green/40 hover:text-brand-green hover:border-brand-green transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </div>
            <div class="w-10 h-10 rounded-full border border-brand-green/10 flex items-center justify-center text-brand-green/40 hover:text-brand-green hover:border-brand-green transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </div>

        <div class="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 no-scrollbar scroll-smooth">
          <div v-for="event in events" :key="event.id" class="min-w-[300px] md:min-w-[400px] snap-start">
            <div class="group glass-card overflow-hidden border-2 border-transparent hover:border-brand-green hover:shadow-2xl hover:shadow-brand-green/10 transition-all duration-500 rounded-2xl">
              <div class="aspect-[16/10] overflow-hidden relative">
                <img :src="event.image" :alt="event.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div class="absolute top-4 left-4">
                  <span class="px-3 py-1 rounded-full bg-brand-green text-white text-[10px] font-bold uppercase tracking-widest">{{ event.category }}</span>
                </div>
              </div>
              <div class="p-6">
                <div class="text-brand-green text-xs font-bold mb-2">{{ event.date }}</div>
                <h3 class="text-xl font-black text-brand-green-dark leading-snug group-hover:text-brand-green transition-colors">{{ event.title }}</h3>
                <div class="mt-4 flex items-center text-brand-charcoal/40 text-sm font-bold group-hover:text-brand-green transition-colors">
                  Detail Kegiatan
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="ml-2 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Features Grid -->
    <FeatureGrid />
    <PengelolaanGrid/>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}
</style>
