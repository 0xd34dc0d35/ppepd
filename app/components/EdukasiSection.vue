<template>
  <section class="pt-4 pb-4 overflow-hidden relative">
    <div class="container mx-auto px-6">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-center">
        <div class="max-w-1xl">
          <h2 class="text-4xl md:text-5xl font-black text-brand-green-dark tracking-tight leading-none">
            Edukasi dan <span class="text-brand-green">Campaign</span>
          </h2>

        </div>
        
        <!-- Custom Navigation -->
        <div class="flex gap-3">
          <button @click="scrollPrev" class="w-12 h-12 rounded-2xl border-2 border-brand-green/10 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white hover:border-brand-green transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button @click="scrollNext" class="w-12 h-12 rounded-2xl border-2 border-brand-green/10 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white hover:border-brand-green transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-0.5 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <!-- Carousel Container -->
      <div 
        ref="scrollContainer"
        class="flex gap-6 overflow-x-auto snap-x snap-mandatory pt-4 pb-10 no-scrollbar scroll-smooth"
      >
        <div 
          v-for="item in items" 
          :key="item.id"
          class="min-w-[calc(100%-48px)] md:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] snap-start"
        >
          <div class="group relative h-[45vh] rounded-[32px] overflow-hidden bg-brand-charcoal transition-all duration-500 hover:-translate-y-2 border-transparent hover:border-transparent shadow-xl hover:shadow-2xl hover:shadow-brand-green/10">
            <!-- Neon border animation background -->
            <div class="absolute top-1/2 left-1/2 w-[800px] h-[160px] bg-[linear-gradient(transparent,theme(colors.brand.green),theme(colors.brand.green),theme(colors.brand.green),transparent)] animate-[spin_3s_linear_infinite] origin-top-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <!-- Inner container for image and content -->
            <div class="absolute inset-[2px] bg-brand-charcoal rounded-[30px] overflow-hidden z-10">
              <!-- Background Image with Overlay -->
              <img :src="item.image" :alt="item.title" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-brand-green-dark via-brand-green-dark/20 to-transparent"></div>
              
              <!-- Content -->
              <div class="absolute inset-0 p-8 flex flex-col justify-end">
                <div class="mb-4">
                  <span class="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
                    {{ item.category }}
                  </span>
                </div>
                <h3 class="text-2xl font-black text-white leading-tight mb-4 group-hover:text-brand-green transition-colors">
                  {{ item.title }}
                </h3>
                <p class="text-white/70 text-sm font-medium line-clamp-3 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {{ item.description }}
                </p>
                
                <button class="w-full py-4 bg-white text-brand-green-dark font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-brand-green hover:text-white transition-all duration-300 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  Pelajari Modul
                </button>
              </div>
              
              <!-- Index Number (Top Right) -->
              <div class="absolute top-8 right-8 text-white/10 text-6xl font-black italic tracking-tighter select-none">
                0{{ item.id }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scrollContainer = ref<HTMLElement | null>(null)

const items = [
  {
    id: 1,
    title: 'Siklus Hidrologi Perairan Darat',
    category: 'Dasar',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop',
    description: 'Memahami bagaimana air bergerak melalui ekosistem darat dari pegunungan hingga ke hilir.'
  },
  {
    id: 2,
    title: 'Keanekaragaman Hayati Sungai',
    category: 'Biologi',
    image: 'https://images.unsplash.com/photo-1470071131384-001b85755536?q=80&w=600&auto=format&fit=crop',
    description: 'Mengenal spesies endemik yang mendiami sungai-sungai di Indonesia dan peran penting mereka.'
  },
  {
    id: 3,
    title: 'Teknologi Monitoring IoT',
    category: 'Teknologi',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
    description: 'Bagaimana sensor pintar membantu kita memantau kualitas air secara real-time.'
  },
  {
    id: 4,
    title: 'Manajemen Restorasi Gambut',
    category: 'Restorasi',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop',
    description: 'Langkah-langkah teknis dalam memulihkan ekosistem gambut yang terdegradasi.'
  },
  {
    id: 5,
    title: 'Hukum Lingkungan Perairan',
    category: 'Regulasi',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&auto=format&fit=crop',
    description: 'Memahami kerangka hukum nasional dalam perlindungan ekosistem perairan darat.'
  },
  {
    id: 6,
    title: 'Edukasi Masyarakat Pesisir',
    category: 'Sosial',
    image: 'https://images.unsplash.com/photo-1544650030-3c6984747f9c?q=80&w=600&auto=format&fit=crop',
    description: 'Pemberdayaan masyarakat dalam menjaga kelestarian ekosistem mangrove di sekitarnya.'
  }
]

const scrollNext = () => {
  if (scrollContainer.value) {
    const cardWidth = scrollContainer.value.clientWidth / (window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1)
    scrollContainer.value.scrollBy({ left: cardWidth, behavior: 'smooth' })
  }
}

const scrollPrev = () => {
  if (scrollContainer.value) {
    const cardWidth = scrollContainer.value.clientWidth / (window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1)
    scrollContainer.value.scrollBy({ left: -cardWidth, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Custom clamp for description */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
