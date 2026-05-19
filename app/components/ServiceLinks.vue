<template>
  <section id="layanan" class="container mx-auto px-4 -mt-8 relative z-20 scroll-mt-24 pt-2">
    <div class="flex flex-col items-center">
      <!-- Carousel Display (No Animation) -->
      <div class="flex justify-center gap-6 md:gap-16 flex-wrap w-full">
        <template v-for="(service, index) in services" :key="service.id">
          <NuxtLink 
            v-if="Math.floor(index / 3) === currentIndex"
            :to="service.link" 
            class="group flex flex-col items-center gap-4 w-28 md:w-36"
          >
            <!-- Avatar Wrapper with Neon Sweeping Border -->
            <div class="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-2xl bg-brand-charcoal/5">
              <!-- Static border when not hovered -->
              <div class="absolute inset-0 bg-gradient-to-tr from-brand-green to-brand-blue opacity-100 group-hover:opacity-0 transition-opacity duration-500"></div>

              <!-- Neon border animation background -->
              <div class="absolute top-1/2 left-1/2 w-[200px] h-[60px] bg-[linear-gradient(transparent,theme(colors.brand.green),theme(colors.brand.green),theme(colors.brand.green),transparent)] animate-[spin_2s_linear_infinite] origin-top-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
              
              <!-- Inner Solid Background holding the image -->
              <div class="absolute inset-[3px] bg-white rounded-full z-10 flex items-center justify-center">
                <img :src="service.image" :alt="service.title" loading="lazy" decoding="async" class="w-[calc(100%-6px)] h-[calc(100%-6px)] object-cover rounded-full" />
              </div>
            </div>
            <!-- Title -->
            <span class="text-sm md:text-base font-black text-brand-charcoal text-center group-hover:text-brand-green-dark transition-colors leading-tight">
              {{ service.title }}
            </span>
          </NuxtLink>
        </template>
      </div>

      <!-- Dot Navigation -->
      <div class="flex gap-2 mt-6">
        <button 
          v-for="pageIndex in Math.ceil(services.length / 4)" 
          :key="'dot-' + pageIndex"
          @click="currentIndex = pageIndex - 1"
          class="w-3 h-3 rounded-full transition-colors cursor-pointer"
          :class="currentIndex === pageIndex - 1 ? 'bg-brand-green-dark' : 'bg-brand-charcoal/20 hover:bg-brand-green/60'"
          aria-label="Ganti Halaman Layanan"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentIndex = ref(0)

// 12 Layanan Utama (Replikasi dari 4 awal)
const services = [
  { id: 1, title: 'Perlindungan Danau', 
  link: '/layanan/inventarisasi-danau', 
  image: 'https://images.unsplash.com/photo-1762808471755-325a4ac6e36f?q=80&w=320&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 2, title: 'Perlindungan Mata Air', link: '/layanan/rehabilitasi', 
  image: 'https://plus.unsplash.com/premium_photo-1710628263718-367b1cf5828f?q=80&w=320&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 3, title: 'Perlindungan Mangrove', link: '/layanan/mangrove',
   image: 'event-1.png' },
  { id: 4, title: 'Basisdata Ekosistem', link: '/layanan/edukasi',
   image: 'https://plus.unsplash.com/premium_photo-1745182312745-cdb5d212803a?q=80&w=320&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 5, title: 'Regulasi', link: '/layanan/pemantauan', image: 'https://images.unsplash.com/photo-1470071131384-001b85755536?q=80&w=300&auto=format&fit=crop' },
  { id: 6, title: 'Bimbingan Teknis', link: '/layanan/rehabilitasi', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=300&auto=format&fit=crop' },
  { id: 7, title: 'Konsultasi', link: '/layanan/perizinan', 
  image: 'https://media.istockphoto.com/id/1365412652/photo/multiethnic-diverse-office-conference-room-meeting-team-of-two-creative-entrepreneurs-talk.webp?a=1&b=1&s=612x612&w=0&k=20&c=wuPx6IzpTzFSPqxji9GfrTYRhh8JWiC6__HB0pBq2Ho=' },
  { id: 8, title: 'Edukasi',
   link: '/layanan/edukasi',
    image: 'https://images.unsplash.com/photo-1545065695-64b67d551e68?q=80&w=1673&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 9, title: 'RPPEM', link: '/layanan/pemantauan', image: 'https://images.unsplash.com/photo-1470071131384-001b85755536?q=80&w=300&auto=format&fit=crop' },
  { id: 10, title: 'RPPEPD', link: '/layanan/rehabilitasi', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=300&auto=format&fit=crop' },
  { id: 11, title: 'DMPM', link: '/layanan/perizinan', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=300&auto=format&fit=crop' },
  { id: 12, title: 'DPSA', link: '/layanan/edukasi', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=300&auto=format&fit=crop' }
]
</script>
