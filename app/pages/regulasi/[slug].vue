<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: 'data' })

const route = useRoute()
const slug = route.params.slug as string

const item = ref<any>(null)
const isLoading = ref(true)
const notFound = ref(false)

const jenisColor: Record<string, string> = {
  UU:      'bg-brand-charcoal text-white',
  Perpres: 'bg-brand-green-dark text-white',
  PP:      'bg-brand-green text-white',
  Permen:  'bg-brand-blue text-white',
  SE:      'bg-brand-orange text-white',
}

const ekosistemLabel: Record<string, string> = {
  mangrove: 'Mangrove',
  danau:    'Danau',
  mataair:  'Mata Air',
}

onMounted(async () => {
  try {
    const res = await fetch('/static/regulasi/catalog.json')
    if (!res.ok) { notFound.value = true; return }
    const catalog = await res.json()
    item.value = catalog.find((c: any) => c.id === slug) ?? null
    if (!item.value) notFound.value = true
  } catch {
    notFound.value = true
  } finally {
    isLoading.value = false
  }
})

useSeoMeta({
  title: computed(() => item.value ? `${item.value.jenis} No. ${item.value.nomor}/${item.value.tahun} – PPEPD` : 'PPEPD'),
  description: computed(() => item.value?.excerpt ?? ''),
})
</script>

<template>
  <div class="min-h-screen bg-brand-cream/30">

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <div class="w-10 h-10 rounded-full border-2 border-brand-green/20 border-t-brand-green animate-spin"></div>
        <p class="text-sm font-bold text-brand-charcoal/40">Memuat regulasi...</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="notFound" class="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <div class="w-24 h-24 bg-brand-green/5 rounded-full flex items-center justify-center mb-6 border-2 border-brand-green/10">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-brand-green/25"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
      </div>
      <h2 class="text-2xl font-black text-brand-green-dark mb-2">Regulasi Tidak Ditemukan</h2>
      <p class="text-sm text-brand-charcoal/50 mb-8">Dokumen yang Anda cari tidak tersedia atau telah dipindahkan.</p>
      <NuxtLink to="/regulasi" class="px-6 py-2.5 rounded-full bg-brand-green text-white text-xs font-black uppercase tracking-widest hover:bg-brand-green-dark transition-all">
        Kembali ke Katalog
      </NuxtLink>
    </div>

    <!-- Detail -->
    <div v-else-if="item" class="pt-[50px]">

      <!-- Hero -->
      <div class="bg-brand-green-dark relative overflow-hidden">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-[-20%] left-[-5%] w-[40%] h-[200%] rounded-full bg-white/5 blur-[80px]"></div>
          <div class="absolute bottom-[-20%] right-[-5%] w-[30%] h-[150%] rounded-full bg-brand-blue/10 blur-[80px]"></div>
        </div>
        <div class="relative max-w-4xl mx-auto px-8 py-14">
          <div class="flex items-center gap-3 mb-6">
            <span :class="['px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest', jenisColor[item.jenis] ?? 'bg-white/20 text-white']">
              {{ item.jenis }}
            </span>
            <span class="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest">
              {{ ekosistemLabel[item.ekosistem] }}
            </span>
          </div>
          <p class="text-white/50 text-sm font-bold mb-3 uppercase tracking-widest">
            {{ item.jenis }} Nomor {{ item.nomor }} Tahun {{ item.tahun }}
          </p>
          <h1 class="text-2xl md:text-3xl font-black text-white leading-tight max-w-3xl">
            {{ item.title }}
          </h1>
        </div>
      </div>

      <!-- Content Layout -->
      <div class="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">

        <!-- Body -->
        <div class="space-y-6">
          <div class="bg-white rounded-2xl border border-brand-green/10 p-8">
            <h2 class="text-xs font-black text-brand-charcoal/40 uppercase tracking-widest mb-4">Ringkasan</h2>
            <p class="text-base text-brand-charcoal/70 leading-relaxed font-medium">{{ item.excerpt }}</p>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="space-y-6">
          <div class="bg-white rounded-2xl border border-brand-green/10 p-6 space-y-4">
            <h3 class="text-xs font-black text-brand-charcoal/40 uppercase tracking-widest">Informasi Regulasi</h3>

            <div>
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-1">Jenis</p>
              <span :class="['inline-block px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest', jenisColor[item.jenis] ?? 'bg-brand-charcoal/10 text-brand-charcoal']">
                {{ item.jenis }}
              </span>
            </div>

            <div>
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-1">Nomor</p>
              <p class="text-sm font-bold text-brand-green-dark">No. {{ item.nomor }} Tahun {{ item.tahun }}</p>
            </div>

            <div>
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-1">Ekosistem</p>
              <p class="text-sm font-bold text-brand-charcoal">{{ ekosistemLabel[item.ekosistem] }}</p>
            </div>

            <div>
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-2">Tags</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="px-2.5 py-1 rounded-full bg-brand-cream border border-brand-green/10 text-brand-charcoal/60 text-[10px] font-bold"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/regulasi"
            class="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-brand-green/10 text-brand-charcoal/50 hover:border-brand-green hover:text-brand-green text-xs font-bold transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
            Kembali ke Katalog
          </NuxtLink>
        </aside>
      </div>
    </div>

  </div>
</template>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 0.8s linear infinite; }
</style>
