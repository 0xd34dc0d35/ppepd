<script setup lang="ts">
const services = [
  {
    title: 'Mangrove',
    description: 'Informasi dan dukungan pengelolaan ekosistem mangrove sebagai pelindung pesisir dan habitat keanekaragaman hayati.',
  image: '/images/layanan/item-mang-medium.jpg',  },
  {
    title: 'Danau',
    description: 'Layanan inventarisasi, pemantauan, dan pengelolaan danau untuk menjaga fungsi ekologis perairan darat.',
    image: '/images/layanan/item-danau-medium.jpg',
  },
  {
    title: 'Mata Air',
    description: 'Dukungan data dan pendampingan perlindungan mata air sebagai sumber daya air penting bagi masyarakat dan ekosistem.',
    image: '/images/layanan/item-ma-medium.jpg',
  },
]

useSeoMeta({
  title: 'Layanan - PPEPD',
  description: 'Daftar layanan PPEPD untuk Mangrove, Danau, dan Mata Air.',
})
</script>

<template>
  <div class="relative -mx-6 -mt-12 overflow-hidden bg-brand-cream px-6 pb-20 pt-28">
    <div class="mx-auto max-w-6xl">
      <nav class="mb-8 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-charcoal/45">
        <NuxtLink to="/" class="transition-colors hover:text-brand-green">Beranda</NuxtLink>
        <span>/</span>
        <span class="text-brand-green-dark">Layanan</span>
      </nav>

      <header class="mb-12 text-center">
        <h1 class="text-4xl font-black text-brand-green-dark mb-4">Layanan</h1>
      </header>

      <div class="grid gap-8 md:grid-cols-3">
        <article
          v-for="service in services"
          :key="service.title"
          class="shiny-card group"
        >
          <!-- Inner card: clips image and sits above the rotating border -->
          <div class="relative z-10 overflow-hidden rounded-[14px] aspect-[4/3] bg-black">
            <img
              :src="service.image"
              :alt="service.title"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-60"
            />

            <!-- Caption overlay: fade + slide in on hover -->
            <div class="caption-overlay absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/85 via-black/30 to-transparent">
              <h2 class="text-white font-semibold text-xl mb-2 drop-shadow-lg">{{ service.title }}</h2>
              <p class="text-white/75 text-sm leading-relaxed drop-shadow">{{ service.description }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Shiny rotating border wrapper ── */
.shiny-card {
  position: relative;
  padding: 2px;
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(30, 92, 75, 0.10);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.shiny-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(30, 92, 75, 0.15);
}

/* Rotating conic-gradient beam */
.shiny-card::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 200%;
  aspect-ratio: 1;
  background: conic-gradient(
    transparent   0deg,
    transparent   160deg,
    rgba(30, 92, 75, 0.15)  200deg,
    rgba(122, 182, 72, 0.6) 250deg,
    rgba(255, 255, 255, 1)  270deg,
    rgba(122, 182, 72, 0.6) 290deg,
    rgba(30, 92, 75, 0.15)  330deg,
    transparent   360deg
  );
  transform: translate(-50%, -50%) rotate(0deg);
  animation: spin-border 2.5s linear infinite;
  animation-play-state: paused;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.shiny-card:hover::before {
  opacity: 1;
  animation-play-state: running;
}

@keyframes spin-border {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* ── Caption fade + slide ── */
.caption-overlay {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.group:hover .caption-overlay {
  opacity: 1;
  transform: translateY(0);
}
</style>
