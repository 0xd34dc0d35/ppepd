<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'map' })

useSeoMeta({
  title: 'Profil Danau | PPEPD',
  description: 'Peta interaktif profil danau-danau di Indonesia – Direktorat PPEPD KLHK.',
})

const showTOU = ref(true)
const showBasisdata = ref(false)
const showPelaporan = ref(false)
const searchQuery = ref('')

const acceptTOU = () => { showTOU.value = false }
</script>

<template>
  <!-- Map layer — zIndex 0 -->
  <div class="absolute inset-0" style="z-index: 0">
    <ClientOnly>
      <MapLibre />
    </ClientOnly>
  </div>

  <!-- Overlay Transparent Appbar — zIndex 2, height 42px -->
  <header
    class="absolute top-0 left-0 right-0 flex items-center gap-3 px-3 backdrop-blur-md bg-white/20 border-b border-white/30"
    style="z-index: 2; height: 42px"
  >
    <!-- Prepend: back + title -->
    <div class="flex items-center gap-2 shrink-0">
      <button
        class="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-black/10 transition-colors text-black"
        aria-label="Kembali"
        @click="$router.back()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span class="text-black font-bold text-sm tracking-wide select-none whitespace-nowrap">Profil Danau</span>
    </div>

    <!-- Center: search field -->
    <div class="flex-1 flex items-center min-w-0">
      <div class="relative w-full max-w-sm mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/50 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Temukan danau"
          class="w-full h-7 pl-7 pr-3 text-xs text-black placeholder-black/40 bg-white/40 backdrop-blur-sm border border-white/50 rounded-lg outline-none focus:bg-white/60 focus:border-white/80 transition-all"
        />
      </div>
    </div>

    <!-- Append: Basisdata + Pelaporan buttons -->
    <div class="flex items-center gap-1 shrink-0">
      <button
        class="flex items-center gap-1.5 px-3 h-7 text-xs font-semibold text-black rounded-lg hover:bg-black/10 transition-colors whitespace-nowrap"
        @click="showBasisdata = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        Basisdata
      </button>
      <button
        class="flex items-center gap-1.5 px-3 h-7 text-xs font-semibold text-black rounded-lg hover:bg-black/10 transition-colors whitespace-nowrap"
        @click="showPelaporan = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
        </svg>
        Pelaporan
      </button>
    </div>
  </header>

  <!-- Dialog TOU — zIndex 2 -->
  <Transition name="fade">
    <div
      v-if="showTOU"
      class="absolute inset-0 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
      style="z-index: 2"
    >
      <Transition name="zoom">
        <div v-if="showTOU" class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <h2 class="text-base font-bold text-brand-charcoal mb-1">Ketentuan Penggunaan</h2>
          <p class="text-xs text-gray-400 mb-4">Harap baca sebelum menggunakan halaman ini</p>
          <div class="text-sm text-gray-600 space-y-2 max-h-56 overflow-y-auto pr-1 leading-relaxed">
            <p>Dengan mengakses halaman <strong>Profil Danau</strong>, Anda menyetujui ketentuan berikut:</p>
            <ol class="list-decimal pl-4 space-y-2">
              <li>Data dan peta yang ditampilkan bersifat informatif dan hanya untuk keperluan referensi.</li>
              <li>Pengguna dilarang menggunakan data untuk kepentingan komersial tanpa izin tertulis dari Direktorat PPEPD.</li>
              <li>Seluruh data bersumber dari Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat (PPEPD) KLHK dan dapat berubah sewaktu-waktu.</li>
              <li>Kami tidak bertanggung jawab atas kerugian yang timbul akibat penggunaan atau penafsiran data yang tidak tepat.</li>
              <li>Penggunaan peta ini tunduk pada regulasi yang berlaku di wilayah Republik Indonesia.</li>
            </ol>
          </div>
          <div class="mt-5 flex gap-3 justify-end">
            <button class="px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors" @click="showTOU = false">
              Lewati
            </button>
            <button class="px-5 py-2 bg-brand-green text-white text-sm font-semibold rounded-xl hover:bg-brand-green-dark transition-colors" @click="acceptTOU">
              Saya Setuju
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Dialog Basisdata — zIndex 3 -->
  <Transition name="fade">
    <div
      v-if="showBasisdata"
      class="absolute inset-0 flex items-start justify-end"
      style="z-index: 3; padding-top: 50px; padding-right: 12px"
      @click.self="showBasisdata = false"
    >
      <Transition name="slide-down">
        <div v-if="showBasisdata" class="bg-white rounded-2xl shadow-2xl w-80">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 class="text-sm font-bold text-brand-charcoal">Basisdata Profil Danau</h3>
            <button class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600" @click="showBasisdata = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-5 text-sm text-gray-500 leading-relaxed min-h-32">
            <p>Informasi basisdata profil danau akan tersedia di sini.</p>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Dialog Pelaporan — zIndex 3 -->
  <Transition name="fade">
    <div
      v-if="showPelaporan"
      class="absolute inset-0 flex items-start justify-end"
      style="z-index: 3; padding-top: 50px; padding-right: 12px"
      @click.self="showPelaporan = false"
    >
      <Transition name="slide-down">
        <div v-if="showPelaporan" class="bg-white rounded-2xl shadow-2xl w-80">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 class="text-sm font-bold text-brand-charcoal">Pelaporan</h3>
            <button class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600" @click="showPelaporan = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-5 text-sm text-gray-500 leading-relaxed min-h-32">
            <p>Formulir pelaporan dan data laporan akan tersedia di sini.</p>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.88);
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
