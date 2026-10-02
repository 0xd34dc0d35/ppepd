<script setup lang="ts">
useHead({
  meta: [
    {
      name: 'google-site-verification',
      content: 'rth7zi2XFcnt4jkFIGyKWIo20IM4_a9ZYfVIb5hMGrw'
    }
  ]
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a href="#konten-utama" class="skip-link">Lewati ke konten utama</a>
    <KlhSiteHeader />

    <main id="konten-utama" tabindex="-1" class="relative mx-auto w-full max-w-container flex-grow px-6 py-12 focus:outline-none">
      <slot />
    </main>

    <KlhSiteFooter />
  </div>
</template>
