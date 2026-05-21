<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const id = route.params.id as string

interface RedirectEntry {
  id: string
  url: string
  title: string
  hits: number
  created: string
}

const entry = ref<RedirectEntry | null>(null)
const notFound = ref(false)
const countdown = ref(6 + Math.floor(Math.random() * 5))
let timer: ReturnType<typeof setInterval>

useSeoMeta({
  title: 'Mengalihkan… | PPEPD',
  robots: 'noindex',
})

onMounted(async () => {
  if (id === 'not-found') { notFound.value = true; return }
  try {
    entry.value = await $fetch<RedirectEntry>(`/api/s/${id}`)
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        window.location.href = entry.value!.url
      }
    }, 1000)
  } catch {
    notFound.value = true
  }
})

onUnmounted(() => clearInterval(timer))

function goNow() {
  if (entry.value) window.location.href = entry.value.url
}
</script>

<template>
  <div class="min-h-screen bg-brand-green-dark flex flex-col items-center justify-center px-6 relative overflow-hidden">

    <!-- Ambient blobs -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] rounded-full bg-white/3 blur-[120px]"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-brand-blue/8 blur-[100px]"></div>
    </div>

    <div class="relative w-full max-w-sm text-center">

      <!-- PPEPD wordmark -->
      <p class="text-xs font-black text-white/30 uppercase tracking-widest mb-10">PPEPD · KLH/BPLH</p>

      <!-- ── NOT FOUND state ── -->
      <template v-if="notFound">
        <div class="w-16 h-16 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
        </div>
        <h1 class="text-xl font-black text-white mb-2">Link Tidak Ditemukan</h1>
        <p class="text-sm text-white/45 leading-relaxed mb-2">
          Tautan <code class="bg-white/10 px-1.5 py-0.5 rounded font-mono text-white/70">/s/{{ id }}</code> tidak tersedia atau sudah kedaluwarsa.
        </p>
        <p class="text-xs text-white/25 mb-8">Tautan mungkin telah dihapus oleh pengelola.</p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 border border-white/15 text-white text-xs font-black uppercase tracking-widest hover:bg-white/15 transition-colors"
        >
          Ke Beranda
        </NuxtLink>
      </template>

      <!-- ── LOADING state ── -->
      <template v-else-if="!entry">
        <div class="w-16 h-16 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <svg class="w-7 h-7 text-white/50 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" stroke-opacity="0.2"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"/>
          </svg>
        </div>
        <p class="text-white/50 text-sm font-medium">Memuat tautan…</p>
      </template>

      <!-- ── REDIRECT state ── -->
      <template v-else>
        <!-- Spinner -->
        <div class="w-14 h-14 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center mx-auto mb-7">
          <svg class="w-6 h-6 text-white/60 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" stroke-opacity="0.2"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"/>
          </svg>
        </div>

        <p class="text-sm text-white/60 leading-relaxed mb-1">Mohon tunggu, Anda akan diarahkan ke</p>
        <h1 v-if="entry.title" class="text-lg font-black text-white leading-tight mb-1">{{ entry.title }}</h1>
        <p class="text-xs text-white/35 font-mono mb-8 truncate max-w-xs mx-auto">{{ entry.url }}</p>

        <button
          @click="goNow"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white/70 text-xs font-bold hover:bg-white/10 hover:text-white transition-colors"
        >
          Jika tidak otomatis, klik di sini
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </template>

    </div>
  </div>
</template>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.9s linear infinite; }
</style>
