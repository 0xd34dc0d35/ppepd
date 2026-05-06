<script setup lang="ts">
import { ref } from 'vue'

const slides = [
  {
    subtitle: 'Perlindungan dan Pengelolaan',
    title: 'Ekosistem Perairan Darat',
    description: 'Melindungi dan mengelola ekosistem perairan darat adalah tanggung jawab kita bersama. Sungai, danau, rawa dan mangrove bukan hanya milik hari ini — ia adalah titipan untuk anak cucu kita. Marilah kita rawat, kelola, dan jaga secara berkelanjutan.'
  },
  {
    subtitle: 'Perlindungan dan Pengelolaan',
    title: 'Ekosistem Mangrove',
    description: 'Melindungi dan mengelola ekosistem mangrove adalah tanggung jawab kita bersama. Sabuk hijau pesisir ini bukan hanya milik hari ini — ia adalah titipan untuk anak cucu kita. Marilah kita rawat, kelola, dan jaga secara berkelanjutan.'
  },
  {
    subtitle: 'Perlindungan dan Pengelolaan',
    title: 'Danau dan Mata Air',
    description: 'Melindungi dan mengelola danau serta mata air adalah tanggung jawab kita bersama. Sumber kehidupan ini bukan hanya milik hari ini — ia adalah titipan untuk anak cucu kita. Marilah kita rawat, kelola, dan jaga secara berkelanjutan.'
  }
]

const currentSlide = ref(0)
const totalSlides = slides.length

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides
}
</script>

<template>
  <section class="relative py-2 flex flex-col items-center text-center w-full overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 bg-mesh-gradient opacity-60 -z-10"></div>
    
    <!-- Side Navigation -->
    <button @click="prevSlide" class="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/80 backdrop-blur border border-white/50 text-brand-green-dark transition-all z-30 mx-2 md:mx-6 shadow-lg hover:scale-110 opacity-40 hover:opacity-100" aria-label="Previous Slide">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
    </button>
    <button @click="nextSlide" class="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/80 backdrop-blur border border-white/50 text-brand-green-dark transition-all z-30 mx-2 md:mx-6 shadow-lg hover:scale-110 opacity-40 hover:opacity-100" aria-label="Next Slide">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </button>

    <!-- Carousel Content -->
    <div class="relative w-full px-12 md:px-24">
      <Transition name="fade" mode="out-in">
        <div :key="currentSlide" class="flex flex-col items-center w-full">
          <img src="/logo.png" alt="SIPPEM Logo" class="h-16 md:h-20 mb-4 object-contain drop-shadow-md" />
          
          <h3 class="text-center text-2xl md:text-4xl font-black tracking-tighter mb-4 leading-[0.9] text-brand-orange">
              <span>{{ slides[currentSlide].subtitle }}</span>
          </h3>
          <h1 class="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9] text-brand-green-dark">
            <span class="gradient-text">{{ slides[currentSlide].title }}</span>
          </h1>
          
          <p class="text-base md:text-lg lg:text-xl text-brand-charcoal/80 max-w-4xl mx-auto mb-8 leading-snug font-medium">
            {{ slides[currentSlide].description }}
          </p>
          
          <div class="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <!-- Button Lindungi -->
            <NuxtLink to="/about" class="group relative px-10 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-[0_10px_30px_rgba(217,123,58,0.3)] overflow-hidden bg-white/10">
              <!-- Neon border animation background -->
              <div class="absolute top-1/2 left-1/2 w-[300px] h-[80px] bg-[linear-gradient(transparent,theme(colors.brand.green-dark),theme(colors.brand.green-dark),theme(colors.brand.green-dark),transparent)] animate-[spin_4s_linear_infinite] origin-top-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
              
              <!-- Inner Solid Background -->
              <div class="absolute inset-[3px] bg-red-500 rounded-[calc(0.75rem-3px)] z-0 overflow-hidden">
                <!-- Original hover slide effect -->
                <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </div>
              
              <span class="relative z-10 text-white font-black flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                Lindungi
              </span>
            </NuxtLink>

            <!-- Button Kelola -->
            <NuxtLink to="/about" class="group relative px-10 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-[0_10px_30px_rgba(217,123,58,0.3)] overflow-hidden bg-white/10">
              <!-- Neon border animation background -->
              <div class="absolute top-1/2 left-1/2 w-[300px] h-[80px] bg-[linear-gradient(transparent,theme(colors.brand.green-dark),theme(colors.brand.green-dark),theme(colors.brand.green-dark),transparent)] animate-[spin_4s_linear_infinite] origin-top-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
              
              <!-- Inner Solid Background -->
              <div class="absolute inset-[3px] bg-hero-gradient rounded-[calc(0.75rem-3px)] z-0 overflow-hidden">
                <!-- Original hover slide effect -->
                <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </div>
              
              <span class="relative z-10 text-white font-black flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                Kelola
              </span>
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: scale(0.98);
}
.fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>