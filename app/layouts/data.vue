<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolledPast100vh = ref(false)

const handleScroll = () => {
  isScrolledPast100vh.value = window.scrollY > 50
}

const showModal = ref(false)
const modalTitle = ref('')
const modalContent = ref('')

const footerContent = {
  privacy: {
    title: 'Kebijakan Privasi (Privacy Policy)',
    content: `
      <p class="mb-4">Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat berkomitmen untuk melindungi privasi data pribadi Anda.</p>
      <h4 class="font-bold mb-2">1. Informasi yang Kami Kumpulkan</h4>
      <p class="mb-4">Kami mengumpulkan informasi yang Anda berikan secara sukarela saat mengisi formulir kontak atau mendaftar di sistem kami.</p>
      <h4 class="font-bold mb-2">2. Penggunaan Informasi</h4>
      <p>Informasi Anda digunakan untuk memproses pengaduan dan memberikan layanan informasi.</p>
    `
  },
  terms: {
    title: 'Ketentuan Penggunaan (Terms of Use)',
    content: `
      <p class="mb-4">Dengan mengakses platform SIPPEM, Anda menyetujui ketentuan penggunaan berikut.</p>
      <h4 class="font-bold mb-2">1. Penggunaan Layanan</h4>
      <p>Layanan ini disediakan untuk tujuan penyediaan informasi dan perlindungan ekosistem perairan darat.</p>
    `
  }
}

const openModal = (type: 'privacy' | 'terms') => {
  modalTitle.value = footerContent[type].title
  modalContent.value = footerContent[type].content
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen flex flex-col overflow-hidden">
    <!-- Navbar -->
    <nav
      :class="[
        'z-50 h-[50px] w-full transition-all duration-300',
        isScrolledPast100vh
          ? 'fixed top-0 backdrop-blur-xl bg-white/90 border-b border-brand-green/10 shadow-sm'
          : 'fixed top-0 bg-transparent'
      ]"
    >
      <div class="container mx-auto px-6 h-full flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter gradient-text leading-none">
          PPEPD
        </NuxtLink>
        <div class="flex gap-10 text-sm font-bold tracking-wide uppercase text-brand-charcoal/60">
          <NuxtLink to="/" class="hover:text-brand-green transition-all duration-300">Beranda</NuxtLink>
          <NuxtLink to="/data" class="hover:text-brand-green transition-all duration-300">Data</NuxtLink>
          <NuxtLink to="/layanan" class="hover:text-brand-green transition-all duration-300">Layanan</NuxtLink>
          <NuxtLink to="/about" class="hover:text-brand-green transition-all duration-300">Tentang</NuxtLink>
          <NuxtLink to="/zona-integritas" class="hover:text-brand-green transition-all duration-300">Zona Integritas</NuxtLink>
          <NuxtLink to="/hubungi" class="hover:text-brand-green transition-all duration-300">Hubungi</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content: no padding, full bleed -->
    <main class="flex-grow flex flex-col">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-brand-cream/80 backdrop-blur-md border-t border-brand-green/10 pt-8 pb-8 mt-8">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <p class="text-brand-charcoal/40 text-[10px] font-black uppercase tracking-widest text-center md:text-left">
            &copy; 2024 SIPPEM. Kementerian Lingkungan Hidup/Badan Perlindungan Lingkungan Hidup.
          </p>
          <div class="flex gap-8">
            <button @click="openModal('privacy')" class="text-brand-charcoal/40 hover:text-brand-green text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">Privacy Policy</button>
            <button @click="openModal('terms')" class="text-brand-charcoal/40 hover:text-brand-green text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">Terms of Use</button>
          </div>
        </div>
      </div>
    </footer>

    <!-- Modal Dialog -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-charcoal/40 backdrop-blur-md" @click.self="closeModal">
        <div class="bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col w-full max-w-[55vw] max-h-[85vh] border border-brand-green/10">
          <div class="px-8 pt-8 pb-6 flex justify-between items-start">
            <h3 class="text-xl font-black text-brand-green-dark">{{ modalTitle }}</h3>
            <button @click="closeModal" class="w-10 h-10 rounded-xl bg-white border border-brand-green/10 flex items-center justify-center text-brand-charcoal/40 hover:text-brand-green transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="p-8 overflow-y-auto prose prose-emerald max-w-none text-brand-charcoal/70" v-html="modalContent"></div>
          <div class="px-8 py-6 border-t border-brand-green/5 bg-brand-cream/30 flex justify-end">
            <button @click="closeModal" class="px-6 py-3 bg-brand-green-dark text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-green transition-all">Tutup</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply text-brand-green;
}
.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-brand-green to-brand-green-dark;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
