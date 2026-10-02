<script setup lang="ts">
useSeoMeta({
  title: 'PPEPD — Perlindungan dan Pengelolaan Ekosistem Perairan Darat',
  description: 'Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat, Kementerian Lingkungan Hidup/Badan Perlindungan Lingkungan Hidup.',
  ogTitle: 'PPEPD',
  ogDescription: 'Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat, Kementerian Lingkungan Hidup/Badan Perlindungan Lingkungan Hidup.',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="relative -mt-12 -mx-6 overflow-hidden">
    <div class="space-y-24 pb-12">
      <!-- Hero & Services Group -->
      <div class="md:min-h-[calc(100dvh-var(--klh-header-h))] px-6 pt-10 pb-[2vh] flex flex-col justify-between">
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

