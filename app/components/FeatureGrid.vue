<template>
  <section class="mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-black text-brand-green-dark tracking-tight">Perlindungan & Pengelolaan Ekosistem</h2>
    </div>

    <div class="grid md:grid-cols-3 gap-4 mx-auto">
      <NuxtLink
        v-for="feature in features"
        :key="feature.id"
        :to="feature.to"
        class="glass-card group bg-white/40 relative overflow-hidden border-transparent hover:border-transparent block no-underline min-h-[380px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.13),0_4px_16px_rgba(0,0,0,0.08)]"
      >
        <!-- Shining border animation -->
        <div class="absolute top-1/2 left-1/2 w-[600px] h-[120px] bg-[linear-gradient(transparent,theme(colors.brand.green-dark),theme(colors.brand.green-dark),theme(colors.brand.green-dark),transparent)] animate-[spin_4s_linear_infinite] origin-top-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

        <!-- Inner glass layer -->
        <div class="absolute inset-[3px] rounded-[calc(1rem-3px)] z-0 overflow-hidden">
          <!-- Base background -->
          <div class="absolute inset-0 bg-brand-cream group-hover:bg-white transition-colors duration-500"></div>

          <!-- Illustration -->
          <img
            :src="feature.image"
            :alt="feature.title"
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[88%] object-contain object-bottom opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 pointer-events-none select-none"
          />

          <!-- Gradient fade: solid top → transparent at illustration -->
          <div class="absolute inset-x-0 top-0 h-[58%] bg-gradient-to-b from-brand-cream via-brand-cream/95 to-transparent group-hover:from-white group-hover:via-white/95 transition-colors duration-500 pointer-events-none"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 p-10">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-brand-green/5 rounded-full blur-2xl group-hover:bg-brand-green/10 transition-colors"></div>

          <div class="w-14 h-14 rounded-2xl bg-brand-green/8 flex items-center justify-center mb-6 text-brand-green group-hover:scale-110 group-hover:bg-brand-green/15 transition-all duration-500 shadow-inner">
            <svg v-if="feature.id === 1" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20M2 12c0 5.523 4.477 10 10 10S22 17.523 22 12M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10M12 2v20"/><path d="M12 2C9.5 7 8 9.5 8 12s1.5 5 4 10M12 2c2.5 5 4 7.5 4 10s-1.5 5-4 10"/></svg>
            <svg v-if="feature.id === 2" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8c.7 1.4 1 2.9 1 4.4C18 17.2 15.3 21 12 21S6 17.2 6 12.4c0-1.5.3-3 1-4.4"/><path d="M12 21V3"/><path d="m9 6 3-3 3 3"/><path d="M9 10c-1 .5-3 2-3 4"/><path d="M15 10c1 .5 3 2 3 4"/></svg>
            <svg v-if="feature.id === 3" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a8 8 0 0 1-8-8c0-4.314 7-14 8-14s8 9.686 8 14a8 8 0 0 1-8 8z"/></svg>
          </div>

          <h3 class="text-2xl font-black mb-3 text-brand-green-dark">{{ feature.title }}</h3>
          <p class="text-brand-charcoal/60 text-sm leading-relaxed">{{ feature.description }}</p>

          <div class="mt-6 flex items-center text-brand-green font-bold text-sm gap-0 group-hover:gap-2 transition-all duration-300">
            Selengkapnya
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
    image: '/images/ilu-danau.png',
    description: 'Data status ekosistem, kualitas air, tutupan lahan, dan profil 15 Danau Prioritas Nasional Indonesia.',
    to: '/danau',
  },
  {
    id: 2,
    title: 'Mangrove',
    image: '/images/ilu-mangrove.png',
    description: 'Pemantauan kerapatan, sebaran, tren luas, dan program Desa Mandiri Peduli Mangrove di seluruh Indonesia.',
    to: '/mangrove',
  },
  {
    id: 3,
    title: 'Mata Air',
    image: '/images/ilu-mataair.png',
    description: 'Data sebaran titik mata air, penilaian kesehatan, dan program Desa Peduli Sumber Air berbasis komunitas.',
    to: '/mataair',
  },
]
</script>
