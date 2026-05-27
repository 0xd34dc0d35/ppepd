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
        class="glass-card group relative overflow-hidden border-transparent hover:border-transparent block no-underline min-h-[380px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.10)]"
      >
        <!-- Shining border animation -->
        <div class="absolute top-1/2 left-1/2 w-[600px] h-[120px] bg-[linear-gradient(transparent,theme(colors.brand.green-dark),theme(colors.brand.green-dark),theme(colors.brand.green-dark),transparent)] animate-[spin_4s_linear_infinite] origin-top-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

        <!-- Inner card: image + overlay -->
        <div class="absolute inset-[3px] rounded-[calc(1rem-3px)] overflow-hidden z-[1]">
          <img
            :src="feature.image"
            :alt="feature.title"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none select-none"
          />
          <!-- Overlay: tipis default, gelap saat hover -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent group-hover:from-black/85 group-hover:via-black/60 group-hover:to-black/20 transition-all duration-500"></div>
        </div>

        <!-- Content: anchor to bottom -->
        <div class="absolute inset-[3px] rounded-[calc(1rem-3px)] z-[2] flex flex-col justify-end p-8">

          <h3 class="text-2xl font-black text-white leading-snug">{{ feature.title }}</h3>

          <!-- Detail: grid-rows reveal on hover -->
          <div class="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 opacity-0 group-hover:opacity-100">
            <div class="overflow-hidden">
              <p class="text-white/80 text-sm leading-relaxed mt-3 mb-5">{{ feature.description }}</p>
              <div class="flex items-center text-white font-bold text-sm gap-2">
                Selengkapnya
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
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
    title: 'Ekosistem Danau',
    image: '/images/ilu-danau.webp',
    description: 'Data status ekosistem, kualitas air, tutupan lahan, dan profil 15 Danau Prioritas Nasional Indonesia.',
    to: '/danau',
  },
  {
    id: 2,
    title: 'Ekosistem Mangrove',
    image: '/images/ilu-mangrove.webp',
    description: 'Pemantauan kerapatan, sebaran, tren luas, dan program Desa Mandiri Peduli Mangrove di seluruh Indonesia.',
    to: '/mangrove',
  },
  {
    id: 3,
    title: 'Ekosistem Mata Air',
    image: '/images/ilu-mataair.webp',
    description: 'Data sebaran titik mata air, penilaian kesehatan, dan program Desa Peduli Sumber Air berbasis komunitas.',
    to: '/mataair',
  },
]
</script>
