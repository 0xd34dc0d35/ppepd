<script setup lang="ts">
// Layout koleksi/katalog (template DS T2) — konten mengatur lebar & padding sendiri.
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a href="#konten-utama" class="skip-link">Lewati ke konten utama</a>
    <KlhSiteHeader />

    <main id="konten-utama" tabindex="-1" class="flex flex-grow flex-col focus:outline-none">
      <slot />
    </main>

    <KlhSiteFooter compact />
  </div>
</template>
