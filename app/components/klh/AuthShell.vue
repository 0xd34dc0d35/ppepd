<script setup lang="ts">
// Template T4 · Auth Split (DS KLH/BPLH v2.1 §03 Standar Layout).
// Sisi ilustrasi tidak pernah memuat informasi wajib; <1024px menjadi satu kolom (kartu form saja).
defineProps<{ title?: string; message?: string }>()
</script>

<template>
  <div class="grid min-h-screen bg-surface-bg lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
    <a href="#konten-utama" class="skip-link">Lewati ke konten utama</a>

    <!-- Sisi ilustrasi (dekoratif) -->
    <aside class="relative hidden overflow-hidden bg-klh-hero p-12 text-white lg:flex lg:flex-col lg:justify-between" aria-hidden="true">
      <KlhLeafmark class="pointer-events-none absolute -bottom-24 -right-20 h-[420px] w-[420px] text-white opacity-[.12]" />
      <div class="relative flex items-center gap-3">
        <img src="/logo.png" alt="" width="44" height="44" class="h-11 w-11 rounded-full bg-white p-1">
        <span class="leading-tight">
          <span class="block font-display text-lg font-extrabold">PPEPD</span>
          <span class="block text-xs text-klh-green-200">Ekosistem Perairan Darat · KLH/BPLH</span>
        </span>
      </div>
      <div class="relative max-w-md">
        <p class="font-display text-3xl font-bold leading-tight">{{ title || 'Bersama menjaga ekosistem perairan darat Indonesia' }}</p>
        <p class="mt-4 text-[15px] leading-relaxed text-klh-green-200">
          {{ message || 'Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat — data danau, mangrove, dan mata air dalam satu portal.' }}
        </p>
      </div>
    </aside>

    <!-- Kartu form -->
    <div class="flex flex-col">
      <header class="flex h-16 items-center justify-between px-6 lg:justify-end">
        <NuxtLink to="/" class="flex items-center gap-2.5 lg:hidden" aria-label="PPEPD — Beranda">
          <img src="/logo.png" alt="" width="36" height="36" class="h-9 w-9">
          <span class="font-display text-base font-extrabold text-klh-green-700">PPEPD</span>
        </NuxtLink>
        <NuxtLink to="/" class="btn btn-ghost btn-sm">
          <svg class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          Beranda
        </NuxtLink>
      </header>
      <main id="konten-utama" tabindex="-1" class="flex flex-grow items-center justify-center px-4 pb-16 pt-4 focus:outline-none">
        <slot />
      </main>
    </div>
  </div>
</template>
