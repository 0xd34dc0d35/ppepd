<script setup lang="ts">
definePageMeta({ layout: 'data' })

const route = useRoute()
const slug = route.params.slug as string
const { public: { siteUrl, apiBase } } = useRuntimeConfig()
const { isLoggedIn } = useAuth()

const CATEGORY_TEXT: Record<string, string> = {
  laporan:   'text-blue-600 bg-blue-50 border-blue-200',
  jurnal:    'text-purple-600 bg-purple-50 border-purple-200',
  buku:      'text-teal-600 bg-teal-50 border-teal-200',
  regulasi:  'text-orange-600 bg-orange-50 border-orange-200',
  data:      'text-brand-green bg-brand-green/5 border-brand-green/20',
  prosiding: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  lainnya:   'text-gray-600 bg-gray-50 border-gray-200',
}

const { data, status } = await useAsyncData(`pub-${slug}`, () =>
  $fetch<{ data: any }>(`${apiBase}/publications/slug/${slug}`).catch(() => null)
)

const pub = computed(() => data.value?.data ?? null)
const isLoading = computed(() => status.value === 'pending')
const notFound = computed(() => status.value !== 'pending' && !pub.value)

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  return `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const isDownloading = ref(false)
const showAccessDialog = ref(false)
const isRestricted = computed(() => pub.value?.download_access === 'terdaftar')

async function handleDownload() {
  if (!pub.value?.file_url && !pub.value?.external_link) return
  if (isRestricted.value && !isLoggedIn.value) {
    showAccessDialog.value = true
    return
  }
  isDownloading.value = true
  try {
    await $fetch(`${apiBase}/publications/${pub.value.id}/download`, { method: 'POST' })
  } catch { /* best-effort */ }
  const target = pub.value.file_url || pub.value.external_link
  window.open(target, '_blank', 'noopener,noreferrer')
  isDownloading.value = false
}

const ogImage = computed(() => {
  const img = pub.value?.cover_image
  if (!img) return ''
  return img.startsWith('http') ? img : `${siteUrl}${img}`
})

useSeoMeta({
  title: computed(() => pub.value ? `${pub.value.title} – Publikasi PPEPD` : 'Publikasi PPEPD'),
  description: computed(() => pub.value?.summary ?? ''),
  ogTitle: computed(() => pub.value?.title ?? ''),
  ogDescription: computed(() => pub.value?.summary ?? ''),
  ogImage,
  ogUrl: computed(() => `${siteUrl}/publikasi/${slug}`),
  ogType: 'article',
  ogSiteName: 'PPEPD – Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="min-h-screen bg-brand-cream/30">

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <div class="w-10 h-10 rounded-full border-2 border-brand-green/20 border-t-brand-green animate-spin"></div>
        <p class="text-sm font-bold text-brand-charcoal/40">Memuat publikasi...</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="notFound" class="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <div class="w-24 h-24 bg-brand-green/5 rounded-full flex items-center justify-center mb-6 border-2 border-brand-green/10">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-brand-green/25"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      </div>
      <h2 class="text-2xl font-black text-brand-green-dark mb-2">Publikasi Tidak Ditemukan</h2>
      <p class="text-sm text-brand-charcoal/50 mb-8">Dokumen yang Anda cari tidak tersedia atau telah dipindahkan.</p>
      <NuxtLink to="/publikasi" class="px-6 py-2.5 rounded-full bg-brand-green text-white text-xs font-black uppercase tracking-widest hover:bg-brand-green-dark transition-all">
        Kembali ke Katalog
      </NuxtLink>
    </div>

    <!-- Detail -->
    <div v-else-if="pub" class="pt-[50px]">

      <!-- Thin Header Banner -->
      <div class="relative h-32 overflow-hidden bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-green/70">
        <img v-if="pub.cover_image" :src="pub.cover_image" :alt="pub.title" class="w-full h-full object-cover opacity-20 scale-110" />
        <div class="absolute inset-0 bg-gradient-to-r from-brand-green-dark/90 to-transparent"></div>
        <div class="absolute inset-0 flex items-center px-8 max-w-6xl mx-auto">
          <div class="flex items-center gap-3">
            <span :class="['px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border', CATEGORY_TEXT[pub.category_code] ?? 'text-gray-600 bg-gray-50 border-gray-200']">
              {{ pub.category_name ?? pub.category_code }}
            </span>
            <span v-if="pub.is_featured" class="px-2.5 py-1 rounded-lg bg-brand-orange/90 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Unggulan
            </span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

        <!-- Main -->
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-brand-green-dark leading-tight mb-2">{{ pub.title }}</h1>
          <p v-if="pub.subtitle" class="text-lg text-brand-charcoal/60 font-medium mb-6">{{ pub.subtitle }}</p>

          <!-- Stats row -->
          <div class="flex items-center gap-5 mb-8 text-[11px] text-brand-charcoal/40 font-bold">
            <span class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {{ pub.views_count ?? 0 }} dilihat
            </span>
            <span class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {{ pub.downloads_count ?? 0 }} unduhan
            </span>
            <span v-if="pub.pages" class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              {{ pub.pages }} halaman
            </span>
          </div>

          <!-- Summary -->
          <div v-if="pub.summary" class="prose prose-sm prose-p:text-brand-charcoal/70 prose-p:leading-relaxed max-w-none">
            <p>{{ pub.summary }}</p>
          </div>

          <!-- Tags -->
          <div v-if="pub.tags?.length" class="mt-8">
            <p class="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/30 mb-3">Topik</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in pub.tags"
                :key="tag"
                class="px-3 py-1.5 rounded-full bg-brand-cream border border-brand-green/10 text-brand-charcoal/60 text-[11px] font-bold"
              >#{{ tag }}</span>
            </div>
          </div>

          <!-- Access Notice for file -->
          <div v-if="isRestricted && !isLoggedIn && (pub.file_url || pub.external_link)" class="mt-8 p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500 flex-shrink-0 mt-0.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <div>
              <p class="text-xs font-bold text-amber-800 mb-0.5">Akses Terbatas</p>
              <p class="text-xs text-amber-700/80 font-medium">Dokumen ini hanya tersedia untuk pengguna terdaftar.
                <NuxtLink to="/register" class="text-amber-700 font-bold hover:underline">Daftar sekarang</NuxtLink>
                atau <NuxtLink to="/login" class="text-amber-700 font-bold hover:underline">masuk</NuxtLink> untuk mengunduh.
              </p>
            </div>
          </div>
          <div v-else-if="pub.file_url || pub.external_link" class="mt-8 p-4 rounded-xl border border-brand-green/15 bg-brand-green/3 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-green flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p class="text-xs text-brand-charcoal/60 font-medium">
              <span v-if="isLoggedIn">Anda telah login. Tombol unduh tersedia di panel kanan.</span>
              <span v-else>Dokumen ini tersedia untuk diunduh secara bebas.</span>
            </p>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="space-y-4">

          <!-- Cover -->
          <div v-if="pub.cover_image" class="w-full max-w-[200px] mx-auto aspect-[2/3] rounded-xl overflow-hidden shadow-xl shadow-brand-charcoal/10">
            <img :src="pub.cover_image" :alt="pub.title" class="w-full h-full object-cover" />
          </div>

          <!-- Download / Access Button -->
          <div v-if="pub.file_url || pub.external_link">
            <button
              @click="handleDownload"
              :disabled="isDownloading"
              :class="[
                'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed',
                isRestricted && !isLoggedIn
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                  : 'bg-brand-green text-white hover:bg-brand-green-dark active:scale-[0.98] shadow-lg shadow-brand-green/20'
              ]"
            >
              <svg v-if="isRestricted && !isLoggedIn" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span v-if="!isDownloading">{{ isRestricted && !isLoggedIn ? 'Akses Terbatas' : (pub.file_url ? 'Unduh Dokumen' : 'Buka Tautan') }}</span>
              <span v-else>Membuka...</span>
            </button>
            <p v-if="pub.file_size" class="text-center text-[10px] text-brand-charcoal/30 font-medium mt-1.5">
              {{ pub.file_type?.toUpperCase() }} · {{ formatFileSize(pub.file_size) }}
            </p>
          </div>

          <!-- Metadata Card -->
          <div class="bg-white rounded-2xl border border-brand-green/10 p-5 space-y-4">
            <h3 class="text-xs font-black text-brand-charcoal/40 uppercase tracking-widest">Informasi Dokumen</h3>

            <div v-if="pub.author">
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-1">Penulis / Instansi</p>
              <p class="text-sm font-bold text-brand-green-dark">{{ pub.author }}</p>
              <p v-if="pub.institution" class="text-xs text-brand-charcoal/50 font-medium mt-0.5">{{ pub.institution }}</p>
            </div>

            <div>
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-1">Tahun Terbit</p>
              <p class="text-sm font-bold text-brand-green-dark">{{ pub.year }}</p>
            </div>

            <div v-if="pub.isbn_issn">
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-1">ISBN / ISSN</p>
              <p class="text-sm font-bold text-brand-charcoal">{{ pub.isbn_issn }}</p>
            </div>

            <div v-if="pub.edition">
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-1">Edisi</p>
              <p class="text-sm font-bold text-brand-charcoal">{{ pub.edition }}</p>
            </div>

            <div>
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-1">Kategori</p>
              <span :class="['inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border', CATEGORY_TEXT[pub.category_code] ?? 'text-gray-600 bg-gray-50 border-gray-200']">
                {{ pub.category_name ?? pub.category_code }}
              </span>
            </div>

            <div v-if="pub.published_at">
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-1">Tanggal Publikasi</p>
              <p class="text-sm font-bold text-brand-charcoal">{{ formatDate(pub.published_at) }}</p>
            </div>
          </div>

          <!-- Back Button -->
          <NuxtLink
            to="/publikasi"
            class="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-brand-green/10 text-brand-charcoal/50 hover:border-brand-green hover:text-brand-green text-xs font-bold transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
            Kembali ke Katalog
          </NuxtLink>

        </aside>
      </div>
    </div>

  </div>

  <!-- Dialog: Akses Terbatas -->
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="showAccessDialog" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm" @click="showAccessDialog = false"></div>
        <div class="dialog-card relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-400"></div>
          <div class="p-8">
            <div class="w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h2 class="text-center text-lg font-black text-brand-green-dark mb-1.5">Konten untuk Pengguna Terdaftar</h2>
            <p class="text-center text-sm text-brand-charcoal/50 font-medium mb-6">Dokumen ini memerlukan akun terdaftar untuk dapat diunduh.</p>
            <div class="bg-brand-cream/60 rounded-xl p-4 space-y-3 mb-6">
              <div class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p class="text-xs text-brand-charcoal/70 font-medium">Memastikan dokumen diakses oleh pihak yang memiliki kepentingan resmi terhadap pengelolaan ekosistem perairan darat.</p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p class="text-xs text-brand-charcoal/70 font-medium">Data unduhan direkam untuk keperluan pelaporan dan pemantauan distribusi dokumen kepada pemangku kepentingan.</p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p class="text-xs text-brand-charcoal/70 font-medium">Pendaftaran gratis dan dapat diselesaikan dalam beberapa menit.</p>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <NuxtLink
                to="/register"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-green text-white text-sm font-black uppercase tracking-widest hover:bg-brand-green-dark transition-all duration-200 shadow-lg shadow-brand-green/20"
                @click="showAccessDialog = false"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                Daftar Sekarang — Gratis
              </NuxtLink>
              <div class="flex items-center gap-2">
                <NuxtLink
                  to="/login"
                  class="flex-1 flex items-center justify-center px-4 py-2.5 rounded-xl border border-brand-green/20 text-brand-green text-xs font-bold hover:border-brand-green hover:bg-brand-green/5 transition-all"
                  @click="showAccessDialog = false"
                >
                  Sudah punya akun? Masuk
                </NuxtLink>
                <button
                  @click="showAccessDialog = false"
                  class="flex-1 flex items-center justify-center px-4 py-2.5 rounded-xl border border-brand-charcoal/10 text-brand-charcoal/40 text-xs font-bold hover:border-brand-charcoal/20 hover:text-brand-charcoal/60 transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

</template>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.8s linear infinite; }

.dialog-enter-active { transition: opacity 0.2s ease; }
.dialog-leave-active { transition: opacity 0.15s ease; }
.dialog-enter-from, .dialog-leave-to { opacity: 0; }
.dialog-enter-active .dialog-card { transition: transform 0.2s ease, opacity 0.2s ease; }
.dialog-leave-active .dialog-card { transition: transform 0.15s ease, opacity 0.15s ease; }
.dialog-enter-from .dialog-card, .dialog-leave-to .dialog-card { transform: scale(0.96) translateY(6px); opacity: 0; }
</style>
