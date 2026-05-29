<script setup lang="ts">
useSeoMeta({
  title: 'PPEPD - Sistem Informasi Ekosistem Perairan Darat',
  description: 'Sistem Informasi Perlindungan dan Pengelolaan Ekosistem Perairan Darat.',
  ogTitle: 'PPEPD',
  ogDescription: 'Sistem Informasi Perlindungan dan Pengelolaan Ekosistem Perairan Darat.',
  twitterCard: 'summary_large_image',
})

useHead({
  bodyAttrs: {
    class: 'index-gradient-body',
  },
})
</script>

<template>
  <div class="relative -mt-12 -mx-6 overflow-hidden">
    <div class="space-y-24 pb-12">
      <!-- Hero & Services Group -->
      <div class="md:h-[100vh] px-6 pt-[70px] pb-[2vh] flex flex-col justify-between">
        <div class="flex-grow flex flex-col justify-center pb-[10vh]">
          <Hero/>
        </div>
        <div class="mt-4 flex-shrink-0">
          <ServiceLinks />
        </div>
      </div>
      <!-- Berita & Events Section -->
      <BeritaEvents />
    <!-- Features Grid -->
    <FeatureGrid />
    <!-- manually di non aktifkan <PengelolaanGrid/> -->
    <!-- Publikasi Section -->
    <Publikasi />
    <EdukasiSection />
    </div>
  </div>
</template>

