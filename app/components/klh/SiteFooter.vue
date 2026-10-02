<script setup lang="ts">
// Footer instansi — pola "Footer Instansi 4 kolom" DS KLH/BPLH v2.1 §07.
// compact: hanya baris bawah (dipakai layout `data`).
defineProps<{ compact?: boolean }>()

const year = new Date().getFullYear()

const quickLinks = [
  { label: 'Beranda', to: '/' },
  { label: 'Katalog Data', to: '/data' },
  { label: 'Publikasi', to: '/publikasi' },
  { label: 'Regulasi', to: '/regulasi' },
  { label: 'Peta Situs', to: '/sitemap' },
]
const infoLinks = [
  { label: 'Layanan PPEPD', to: '/layanan' },
  { label: 'Tentang Kami', to: '/about' },
  { label: 'Zona Integritas', to: '/zona-integritas' },
  { label: 'Berita & Kegiatan', to: '/berita-events' },
  { label: 'Hubungi Kami', to: '/hubungi' },
]

const policies = {
  privacy: {
    title: 'Kebijakan Privasi',
    content: `
      <p>Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat berkomitmen untuk melindungi privasi data pribadi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan menjaga informasi Anda.</p>
      <h4>1. Informasi yang Kami Kumpulkan</h4>
      <p>Kami mengumpulkan informasi yang Anda berikan secara sukarela saat mengisi formulir kontak, melakukan pengaduan, atau mendaftar di sistem kami. Informasi ini dapat mencakup nama, alamat email, dan detail kontak lainnya.</p>
      <h4>2. Penggunaan Informasi</h4>
      <p>Informasi Anda digunakan untuk memproses pengaduan, memberikan layanan informasi, dan meningkatkan kualitas pengalaman pengguna di portal PPEPD.</p>
      <h4>3. Keamanan Data</h4>
      <p>Kami menerapkan standar keamanan teknis yang ketat untuk mencegah akses tidak sah, pengungkapan, atau penyalahgunaan data pribadi Anda sesuai dengan peraturan perundang-undangan yang berlaku.</p>
      <h4>4. Hak Anda</h4>
      <p>Anda memiliki hak untuk mengakses, memperbarui, atau meminta penghapusan data pribadi Anda yang tersimpan di sistem kami kapan saja.</p>
    `,
  },
  terms: {
    title: 'Ketentuan Penggunaan',
    content: `
      <p>Dengan mengakses dan menggunakan portal PPEPD, Anda dianggap telah membaca, memahami, dan menyetujui ketentuan penggunaan berikut ini.</p>
      <h4>1. Penggunaan Layanan</h4>
      <p>Layanan ini disediakan untuk tujuan penyediaan informasi dan perlindungan ekosistem perairan darat. Pengguna dilarang menggunakan platform ini untuk tujuan ilegal atau yang merugikan pihak lain.</p>
      <h4>2. Hak Kekayaan Intelektual</h4>
      <p>Seluruh konten, logo, data, dan teknologi di platform ini adalah milik Kementerian Lingkungan Hidup/Badan Perlindungan Lingkungan Hidup, dilindungi oleh undang-undang hak cipta.</p>
      <h4>3. Batasan Tanggung Jawab</h4>
      <p>Kami berupaya menyajikan data yang akurat, namun tidak bertanggung jawab atas kerugian yang timbul akibat kesalahan penafsiran data atau gangguan teknis yang berada di luar kendali kami.</p>
      <h4>4. Perubahan Ketentuan</h4>
      <p>Kami berhak memperbarui ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya untuk menyesuaikan dengan regulasi terbaru.</p>
    `,
  },
}

const active = ref<keyof typeof policies | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)
let opener: HTMLElement | null = null

const open = async (key: keyof typeof policies, e: Event) => {
  opener = e.currentTarget as HTMLElement
  active.value = key
  document.body.style.overflow = 'hidden'
  await nextTick()
  closeBtn.value?.focus()
}
const close = () => {
  active.value = null
  document.body.style.overflow = ''
  opener?.focus()
}
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && active.value) close() }
onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <footer class="relative overflow-hidden bg-klh-green-900 text-white">
    <KlhLeafmark v-if="!compact" class="pointer-events-none absolute -right-16 -top-20 h-72 w-72 text-white opacity-[.08]" />

    <div v-if="!compact" class="relative mx-auto grid max-w-container grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
      <!-- Identitas -->
      <div class="flex gap-4">
        <img src="/logo.png" alt="Lambang KLH/BPLH" width="56" height="56" class="h-14 w-14 shrink-0 rounded-full bg-white p-1">
        <div>
          <p class="font-display text-base font-bold leading-snug">Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat</p>
          <p class="mt-2 text-[13px] leading-relaxed text-white/75">
            Deputi Bidang Tata Lingkungan dan Sumber Daya Alam Berkelanjutan<br>
            Kementerian Lingkungan Hidup/Badan Perlindungan Lingkungan Hidup
          </p>
        </div>
      </div>

      <nav aria-labelledby="ft-akses">
        <h2 id="ft-akses" class="mb-3 font-display text-sm font-bold">Akses Cepat</h2>
        <ul class="space-y-0.5">
          <li v-for="l in quickLinks" :key="l.to">
            <NuxtLink :to="l.to" class="inline-flex min-h-[32px] items-center text-[13px] text-white/75 hover:text-white">{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <nav aria-labelledby="ft-info">
        <h2 id="ft-info" class="mb-3 font-display text-sm font-bold">Informasi</h2>
        <ul class="space-y-0.5">
          <li v-for="l in infoLinks" :key="l.to">
            <NuxtLink :to="l.to" class="inline-flex min-h-[32px] items-center text-[13px] text-white/75 hover:text-white">{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="mb-3 font-display text-sm font-bold">Kontak</h2>
        <address class="space-y-3 text-[13px] not-italic leading-relaxed text-white/75">
          <p class="flex gap-2.5">
            <svg class="icon--sm mt-0.5 text-klh-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Menara Plaza Kuningan, Jl. H.R. Rasuna Said Kav. C11-14, Kuningan, Jakarta Selatan</span>
          </p>
          <p class="flex gap-2.5">
            <svg class="icon--sm mt-0.5 text-klh-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <a href="mailto:info@ppepd.kemenlh.go.id" class="break-all hover:text-white">info@ppepd.kemenlh.go.id</a>
          </p>
        </address>
      </div>
    </div>

    <div class="relative bg-black/25">
      <div class="mx-auto flex max-w-container flex-col items-start justify-between gap-2 px-4 py-4 text-[12.5px] text-white/70 sm:flex-row sm:items-center md:px-6">
        <p>&copy; {{ year }} PPEPD · Kementerian Lingkungan Hidup/Badan Perlindungan Lingkungan Hidup</p>
        <div class="flex gap-1">
          <button type="button" class="min-h-[44px] rounded-lg px-2 hover:bg-white/10 hover:text-white" @click="open('privacy', $event)">Kebijakan Privasi</button>
          <button type="button" class="min-h-[44px] rounded-lg px-2 hover:bg-white/10 hover:text-white" @click="open('terms', $event)">Ketentuan Penggunaan</button>
        </div>
      </div>
    </div>

    <!-- Dialog kebijakan -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="active" class="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/50 p-4" @click.self="close">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-title"
            class="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-klh-3"
          >
            <div class="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
              <h2 id="policy-title" class="font-display text-xl font-bold text-ink-900">{{ policies[active].title }}</h2>
              <button ref="closeBtn" type="button" class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-500 hover:bg-surface-2 hover:text-ink-900" aria-label="Tutup" @click="close">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="prose prose-klh max-w-none overflow-y-auto px-6 py-5 prose-h4:mb-1 prose-h4:mt-5" v-html="policies[active].content" />
            <div class="flex justify-end border-t border-line bg-surface-2 px-6 py-4">
              <button type="button" class="btn btn-primary" @click="close">Tutup</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </footer>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
