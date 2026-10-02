<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const id = computed(() => route.query.id as string || '')

useSeoMeta({
  title: 'Link Tidak Ditemukan | PPEPD',
  robots: 'noindex',
})
</script>

<template>
  <div class="min-h-screen bg-surface-bg/40 flex items-center justify-center px-6">
    <div class="w-full max-w-md text-center">

      <!-- Icon -->
      <div class="w-20 h-20 rounded-3xl bg-white border border-line shadow-klh-1 flex items-center justify-center mx-auto mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364L5.636 5.636" class="text-danger"/>
        </svg>
      </div>

      <!-- Wordmark -->
      <p class="text-xs font-bold text-ink-400 uppercase tracking-widest mb-4">PPEPD · KLH/BPLH</p>

      <!-- Heading -->
      <h1 class="text-2xl font-bold text-ink-900 leading-tight mb-3">Link Tidak Ditemukan</h1>
      <p class="text-sm text-ink-500 leading-relaxed mb-3">
        Tautan yang Anda akses tidak tersedia, sudah kedaluwarsa, atau mungkin telah dihapus.
      </p>

      <!-- ID badge -->
      <div v-if="id" class="inline-flex items-center gap-2 bg-white border border-line rounded-lg px-3 py-1.5 mb-8">
        <span class="text-[11px] font-bold text-ink-400 uppercase tracking-widest">ID</span>
        <code class="text-sm font-mono text-ink-500">{{ id }}</code>
      </div>
      <div v-else class="mb-8"></div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <NuxtLink
          to="/"
          class="w-full sm:w-auto px-6 py-2.5 rounded-full bg-klh-green-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-klh-green-800 transition-colors"
        >
          Ke Beranda
        </NuxtLink>
        <NuxtLink
          to="/hubungi"
          class="w-full sm:w-auto px-6 py-2.5 rounded-full border border-line text-ink-500 text-xs font-bold uppercase tracking-widest hover:border-klh-green-600 hover:text-klh-green-600 transition-colors"
        >
          Hubungi Kami
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
