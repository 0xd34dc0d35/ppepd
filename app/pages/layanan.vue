<script setup lang="ts">
const services = [
  {
    title: 'Mangrove',
    description: 'Informasi dan dukungan pengelolaan ekosistem mangrove sebagai pelindung pesisir dan habitat keanekaragaman hayati.',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=900&auto=format&fit=crop',
  },
  {
    title: 'Danau',
    description: 'Layanan inventarisasi, pemantauan, dan pengelolaan danau untuk menjaga fungsi ekologis perairan darat.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop',
  },
  {
    title: 'Mata Air',
    description: 'Dukungan data dan pendampingan perlindungan mata air sebagai sumber daya air penting bagi masyarakat dan ekosistem.',
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=900&auto=format&fit=crop',
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

      <header class="mb-12 max-w-3xl">
        <div class="mb-4 inline-flex items-center rounded-full border border-brand-green/10 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-wide text-brand-green shadow-sm">
          Layanan PPEPD
        </div>
        <h1 class="text-[34px] font-black leading-tight tracking-tight text-brand-green-dark md:text-[56px]">
          Pilih Layanan Ekosistem Perairan Darat
        </h1>
        <p class="mt-5 text-base font-medium leading-relaxed text-brand-charcoal/65 md:text-lg">
          Halaman dummy untuk menampilkan tiga kategori layanan utama yang dapat dikembangkan menjadi halaman detail.
        </p>
      </header>

      <div class="grid gap-6 md:grid-cols-3">
        <article
          v-for="service in services"
          :key="service.title"
          class="group overflow-hidden rounded-2xl border border-brand-green/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-2xl hover:shadow-brand-green/10"
        >
          <div class="aspect-[4/3] overflow-hidden bg-brand-charcoal/5">
            <img
              :src="service.image"
              :alt="service.title"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            >
          </div>
          <div class="p-6">
            <h2 class="text-2xl font-black text-brand-green-dark">{{ service.title }}</h2>
            <p class="mt-3 text-sm font-medium leading-relaxed text-brand-charcoal/65">
              {{ service.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
