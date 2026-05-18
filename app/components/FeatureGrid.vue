<template>
  <section class="mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-black text-brand-green-dark tracking-tight">Perlindungan & Pengelolaan Ekosistem</h2>
    </div>
    
    <div class="grid md:grid-cols-3 gap-4  mx-auto">
      <NuxtLink v-for="feature in features" :key="feature.id" :to="feature.to" class="glass-card p-10 group bg-white/40 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden border-transparent hover:border-transparent block no-underline">
        <!-- Neon border animation background -->
        <div class="absolute top-1/2 left-1/2 w-[600px] h-[120px] bg-[linear-gradient(transparent,theme(colors.brand.green-dark),theme(colors.brand.green-dark),theme(colors.brand.green-dark),transparent)] animate-[spin_4s_linear_infinite] origin-top-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
        
        <!-- Inner glass layer -->
        <div class="absolute inset-[3px] bg-brand-cream group-hover:bg-white rounded-[calc(1rem-3px)] z-0 transition-colors duration-500 shadow-inner"></div>

        <!-- Content Wrapper -->
        <div class="relative z-10">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-brand-green/5 rounded-full blur-2xl group-hover:bg-brand-green/10 transition-colors"></div>
          
          <div class="w-14 h-14 rounded-2xl bg-brand-green/5 flex items-center justify-center mb-8 text-brand-green group-hover:scale-110 transition-transform duration-500 shadow-inner">
            <svg v-if="feature.id === 1" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            <svg v-if="feature.id === 2" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          
          <h3 class="text-2xl font-black mb-4 text-brand-green-dark">{{ feature.title }}</h3>
          <p class="text-brand-charcoal/60 text-base leading-relaxed">
            {{ feature.description }}
          </p>
          
          <div class="mt-8 pt-8 border-100 border-brand-green/5 flex items-center text-brand-green font-bold text-sm group-hover:gap-2 transition-all cursor-pointer rounded-md">
            Selengkapnya
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="ml-1 opacity-0 group-hover:opacity-100 transition-all"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    id: 1,
    title: 'Danau',
    description: 'Penyajian data yang akurat dan real-time untuk mendukung pengambilan keputusan yang tepat dan cepat dalam ekosistem perairan darat.'
    ,to:'/danau/profil-danau',
  },
  {
    id: 2,
    title: 'Mangrove',
    description: 'Penyajian data yang akurat dan real-time untuk mendukung pengambilan keputusan yang tepat dan cepat dalam ekosistem mangrove.'
   ,to:'/mangrove',
  },
    {
    id: 2,
    title: 'Mata Air',
    description: 'Penyajian data yang akurat dan real-time untuk mendukung pengambilan keputusan yang tepat dan cepat dalam ekosistem mangrove.'
   ,to:'/danau/profil-danau',
  }
]
</script>
