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
  <div class="min-h-screen bg-brand-cream/40 flex items-center justify-center px-6">
    <div class="w-full max-w-md text-center">

      <!-- Icon -->
      <div class="w-20 h-20 rounded-3xl bg-white border border-brand-green/10 shadow-sm flex items-center justify-center mx-auto mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9 text-brand-charcoal/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364L5.636 5.636" class="text-red-400"/>
        </svg>
      </div>

      <!-- Wordmark -->
      <p class="text-xs font-black text-brand-charcoal/25 uppercase tracking-widest mb-4">PPEPD · KLH/BPLH</p>

      <!-- Heading -->
      <h1 class="text-2xl font-black text-brand-charcoal leading-tight mb-3">Link Tidak Ditemukan</h1>
      <p class="text-sm text-brand-charcoal/50 leading-relaxed mb-3">
        Tautan yang Anda akses tidak tersedia, sudah kedaluwarsa, atau mungkin telah dihapus.
      </p>

      <!-- ID badge -->
      <div v-if="id" class="inline-flex items-center gap-2 bg-white border border-brand-green/10 rounded-lg px-3 py-1.5 mb-8">
        <span class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest">ID</span>
        <code class="text-sm font-mono text-brand-charcoal/60">{{ id }}</code>
      </div>
      <div v-else class="mb-8"></div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <NuxtLink
          to="/"
          class="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-green text-white text-xs font-black uppercase tracking-widest hover:bg-brand-green-dark transition-colors"
        >
          Ke Beranda
        </NuxtLink>
        <NuxtLink
          to="/hubungi"
          class="w-full sm:w-auto px-6 py-2.5 rounded-full border border-brand-green/20 text-brand-charcoal/60 text-xs font-black uppercase tracking-widest hover:border-brand-green hover:text-brand-green transition-colors"
        >
          Hubungi Kami
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
