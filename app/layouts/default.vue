<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

useHead({
  meta: [
    {
      name: 'google-site-verification',
      content: 'rth7zi2XFcnt4jkFIGyKWIo20IM4_a9ZYfVIb5hMGrw'
    }
  ]
})

const isScrolledPast100vh = ref(false)

const handleScroll = () => {
  // Check if scrolled past 100vh
  if (window.scrollY > window.innerHeight) {
    isScrolledPast100vh.value = true
  } else {
    isScrolledPast100vh.value = false
  }
}

const showModal = ref(false)
const modalTitle = ref('')
const modalContent = ref('')

const footerContent = {
  privacy: {
    title: 'Kebijakan Privasi (Privacy Policy)',
    content: `
      <p class="mb-4">Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat berkomitmen untuk melindungi privasi data pribadi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan menjaga informasi Anda.</p>
      <h4 class="font-bold mb-2">1. Informasi yang Kami Kumpulkan</h4>
      <p class="mb-4">Kami mengumpulkan informasi yang Anda berikan secara sukarela saat mengisi formulir kontak, melakukan pengaduan, atau mendaftar di sistem kami. Informasi ini dapat mencakup nama, alamat email, dan detail kontak lainnya.</p>
      <h4 class="font-bold mb-2">2. Penggunaan Informasi</h4>
      <p class="mb-4">Informasi Anda digunakan untuk memproses pengaduan, memberikan layanan informasi, dan meningkatkan kualitas pengalaman pengguna di platform SIPPEM.</p>
      <h4 class="font-bold mb-2">3. Keamanan Data</h4>
      <p class="mb-4">Kami menerapkan standar keamanan teknis yang ketat untuk mencegah akses tidak sah, pengungkapan, atau penyalahgunaan data pribadi Anda sesuai dengan peraturan perundang-undangan yang berlaku.</p>
      <h4 class="font-bold mb-2">4. Hak Anda</h4>
      <p>Anda memiliki hak untuk mengakses, memperbarui, atau meminta penghapusan data pribadi Anda yang tersimpan di sistem kami kapan saja.</p>
    `
  },
  terms: {
    title: 'Ketentuan Penggunaan (Terms of Use)',
    content: `
      <p class="mb-4">Dengan mengakses dan menggunakan platform SIPPEM, Anda dianggap telah membaca, memahami, dan menyetujui ketentuan penggunaan berikut ini.</p>
      <h4 class="font-bold mb-2">1. Penggunaan Layanan</h4>
      <p class="mb-4">Layanan ini disediakan untuk tujuan penyediaan informasi dan perlindungan ekosistem perairan darat. Pengguna dilarang menggunakan platform ini untuk tujuan ilegal atau yang merugikan pihak lain.</p>
      <h4 class="font-bold mb-2">2. Hak Kekayaan Intelektual</h4>
      <p class="mb-4">Seluruh konten, logo, data, dan teknologi di platform ini adalah milik Kementerian Lingkungan Hidup dan Kehutanan, dilindungi oleh undang-undang hak cipta.</p>
      <h4 class="font-bold mb-2">3. Batasan Tanggung Jawab</h4>
      <p class="mb-4">Kami berupaya menyajikan data yang akurat, namun tidak bertanggung jawab atas kerugian yang timbul akibat kesalahan penafsiran data atau gangguan teknis yang berada di luar kendali kami.</p>
      <h4 class="font-bold mb-2">4. Perubahan Ketentuan</h4>
      <p>Kami berhak memperbarui ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya untuk menyesuaikan dengan regulasi terbaru.</p>
    `
  }
}

const openModal = (type: 'privacy' | 'terms') => {
  modalTitle.value = footerContent[type].title
  modalContent.value = footerContent[type].content
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  showModal.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen flex flex-col relative overflow-x-hidden">
    <!-- Animated Background Gradients -->
    <div class="fixed inset-0 -z-10">
      <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-green/5 blur-[150px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/5 blur-[150px] animate-pulse" style="animation-delay: 3s"></div>
    </div>

    <!-- Navigation -->
    <nav 
      :class="[
        'z-50 h-[50px] w-full transition-colors duration-300',
        isScrolledPast100vh 
          ? 'fixed top-0 animate-slideDown backdrop-blur-xl bg-white/90 border-b border-brand-green/10 shadow-sm' 
          : 'absolute top-0 bg-transparent'
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

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-6 py-12 relative">
      <slot />
    </main>


    <!-- Footer -->
    <footer class="bg-brand-cream/80 backdrop-blur-md border-t border-brand-green/10 pt-12 pb-10">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <!-- Column 1: Brand & Social -->
          <div class="space-y-6">
            <NuxtLink to="/" class="text-3xl font-black tracking-tighter gradient-text inline-block">
              PPEPD
            </NuxtLink>
            <p class="text-brand-charcoal/70 text-sm leading-relaxed max-w-xs">
              Sistem Informasi Perlindungan dan Pengelolaan Ekosistem Perairan Darat. Berkomitmen menjaga kelestarian sungai, danau, dan mangrove Indonesia.
            </p>
            <div class="flex gap-4">
              <!-- Instagram -->
              <a href="#" class="w-10 h-10 rounded-xl bg-white border border-brand-green/10 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <!-- TikTok -->
              <a href="#" class="w-10 h-10 rounded-xl bg-white border border-brand-green/10 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
              <!-- Facebook / Other (Optional but adds to "premium" feel) -->
              <a href="#" class="w-10 h-10 rounded-xl bg-white border border-brand-green/10 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="space-y-6">
            <h4 class="text-brand-green-dark font-black uppercase tracking-widest text-xs">Tautan Cepat</h4>
            <ul class="space-y-3">
              <li><NuxtLink to="/" class="text-brand-charcoal/60 hover:text-brand-green text-sm font-bold transition-colors">Beranda</NuxtLink></li>
              <li><NuxtLink to="/data" class="text-brand-charcoal/60 hover:text-brand-green text-sm font-bold transition-colors">Katalog Data</NuxtLink></li>
              <li><NuxtLink to="/about" class="text-brand-charcoal/60 hover:text-brand-green text-sm font-bold transition-colors">Tentang Kami</NuxtLink></li>
              <li><NuxtLink to="/zona-integritas" class="text-brand-charcoal/60 hover:text-brand-green text-sm font-bold transition-colors">Zona Integritas</NuxtLink></li>
              <li><NuxtLink to="/hubungi" class="text-brand-charcoal/60 hover:text-brand-green text-sm font-bold transition-colors">Hubungi Kami</NuxtLink></li>
            </ul>
          </div>

          <!-- Column 3: Services -->
          <div class="space-y-6">
            <h4 class="text-brand-green-dark font-black uppercase tracking-widest text-xs">Layanan PPEPD</h4>
            <ul class="space-y-3">
              <li><a href="#" class="text-brand-charcoal/60 hover:text-brand-green text-sm font-bold transition-colors">Inventarisasi Ekosistem</a></li>
              <li><a href="#" class="text-brand-charcoal/60 hover:text-brand-green text-sm font-bold transition-colors">Perlindungan Perairan</a></li>
              <li><a href="#" class="text-brand-charcoal/60 hover:text-brand-green text-sm font-bold transition-colors">Pengelolaan Berkelanjutan</a></li>
              <li><a href="#" class="text-brand-charcoal/60 hover:text-brand-green text-sm font-bold transition-colors">Monitoring Kualitas</a></li>
            </ul>
          </div>

          <!-- Column 4: Contact -->
          <div class="space-y-6">
            <h4 class="text-brand-green-dark font-black uppercase tracking-widest text-xs">Kantor Pusat</h4>
            <div class="space-y-4">
              <div class="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-brand-green shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <p class="text-brand-charcoal/60 text-sm font-medium">Menara Plaza Kuningan. Jl. H.R. Rasuna Said Kav. C11-14. Kuningan, Jakarta Selatan. (021)</p>
              </div>
              <div class="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-brand-green shrink-0"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <p class="text-brand-charcoal/60 text-sm font-medium">info@ppepd.menlhk.go.id</p>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-brand-green/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p class="text-brand-charcoal/40 text-[10px] font-black uppercase tracking-widest">
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
        <Transition name="zoom">
          <div v-if="showModal" class="bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col w-full max-w-[90vw] md:max-w-[55vw] max-h-[85vh] border border-brand-green/10">
            <!-- Modal Header -->
            <div class="px-8 pt-8 pb-6 flex justify-between items-start">
              <h3 class="text-xl font-black text-brand-green-dark tracking-tight">{{ modalTitle }}</h3>
              <button @click="closeModal" class="w-10 h-10 rounded-xl bg-white border border-brand-green/10 flex items-center justify-center text-brand-charcoal/40 hover:text-brand-green hover:border-brand-green transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <!-- Modal Content -->
            <div class="p-8 overflow-y-auto custom-scrollbar prose prose-emerald max-w-none text-brand-charcoal/70 leading-relaxed font-medium" v-html="modalContent">
            </div>
            
            <!-- Modal Footer -->
            <div class="px-8 py-6 border-t border-brand-green/5 bg-brand-cream/30 flex justify-end">
              <button @click="closeModal" class="px-6 py-3 bg-brand-green-dark text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-green transition-all shadow-lg shadow-brand-green/10">
                Tutup
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply text-brand-green;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Modal Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.zoom-enter-active, .zoom-leave-active {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
}
.zoom-enter-from, .zoom-leave-to {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

/* Custom Scrollbar for Modal */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: theme('colors.brand.green');
  border-radius: 10px;
  opacity: 0.2;
}
</style>
