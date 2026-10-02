<script setup lang="ts">
import { ref } from 'vue'
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  org: ''
})

const isSubmitting = ref(false)
const submitted = ref(false)
const maxMsgLength = 1000

const handleSubmit = async () => {
  if (formData.value.message.length > maxMsgLength) return
  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 2000))
  isSubmitting.value = false
  submitted.value = true
  setTimeout(() => {
    submitted.value = false
    formData.value = { name: '', email: '', subject: '', message: '', org: '' }
  }, 5000)
}

const faqs = [
  { q: 'Bagaimana cara mendapatkan data spasial?', a: 'Anda dapat mengajukan permohonan melalui formulir ini dengan subjek "Permohonan Data" atau mengunjungi Portal Data Spasial kami.' },
  { q: 'Apakah layanan konsultasi berbayar?', a: 'Seluruh layanan konsultasi dan bimbingan teknis yang diberikan oleh PPEPD tidak dipungut biaya (Gratis).' },
  { q: 'Berapa lama waktu respon pengaduan?', a: 'Kami berkomitmen memberikan respon awal maksimal 3 hari kerja setelah pesan diterima.' },
]

useSeoMeta({
  title: 'Hubungi Kami – PPEPD KLH/BPLH',
  description: 'Saluran komunikasi resmi Perlindungan dan Pengelolaan Ekosistem Perairan Darat Kementerian Lingkungan Hidup/Badan Perlindungan Lingkungan Hidup.',
})
</script>

<template>
  <div class="relative min-h-screen bg-surface-bg overflow-hidden">
    <!-- Floating gradient blobs -->
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div class="absolute top-0 left-1/4 w-72 h-72 bg-klh-green-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute bottom-0 right-1/3 w-80 h-80 bg-klh-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay:4s"></div>
      <div class="absolute inset-0 opacity-5" style="background-image:radial-gradient(#005952 1px,transparent 1px);background-size:40px 40px;"></div>
    </div>

    <div class="container mx-auto px-6 py-20 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <!-- Left side: Intro & FAQ -->
        <aside class="space-y-12 animate-fade-in">
          <div class="mb-8">
            <div class="inline-flex items-center rounded-full border-2 border-line bg-white/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-klh-green-600">
              Saluran Komunikasi Resmi
            </div>
            <h1 class="mt-4 text-5xl md:text-6xl font-bold text-klh-green-800 leading-tight">
              Hubungi <span class="text-klh-orange-700 italic">Kami</span>
            </h1>
            <p class="mt-4 text-ink-700 max-w-xl text-lg">
              Sampaikan pertanyaan, laporan, atau ajakan kolaborasi untuk melestarikan ekosistem perairan darat Indonesia.
            </p>
          </div>

          <!-- Contact Cards -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="group p-6 rounded-2xl bg-white/50 border border-line hover:bg-white hover:shadow-klh-3 hover:border-klh-green-200 transition-all duration-300">
              <div class="w-12 h-12 rounded-full bg-klh-green-600/10 flex items-center justify-center text-klh-green-600 mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <h2 class="text-sm font-bold text-klh-green-800 mb-1">Kantor Pusat</h2>
              <p class="text-xs font-medium text-ink-700">Menara Plaza Kuningan, Jakarta Selatan</p>
            </div>
            <div class="group p-6 rounded-2xl bg-white/50 border border-line hover:bg-white hover:shadow-klh-3 hover:border-klh-green-200 transition-all duration-300">
              <div class="w-12 h-12 rounded-full bg-klh-green-600/10 flex items-center justify-center text-klh-green-600 mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <h2 class="text-sm font-bold text-klh-green-800 mb-1">Email Layanan</h2>
              <p class="text-xs font-medium text-ink-700">layanan.ppepd@kemenlh.go.id</p>
            </div>
          </div>

          <div class="p-8 rounded-3xl bg-klh-green-800 text-white relative overflow-hidden">
            <div class="relative z-10">
              <h2 class="text-lg font-bold mb-6">Pertanyaan Populer</h2>
              <div class="space-y-4">
                <div v-for="faq in faqs" :key="faq.q" class="group hover:bg-klh-green-600/20 rounded-lg p-3 transition-colors">
                  <p class="text-xs font-bold uppercase text-klh-blue-600 mb-1">{{ faq.q }}</p>
                  <p class="text-sm text-white/80 leading-relaxed">{{ faq.a }}</p>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-klh-green-600 blur-3xl opacity-20"></div>
          </div>
        </aside>

        <!-- Right side: Form -->
        <div class="animate-fade-in" style="animation-delay:0.2s">
          <div class="glass-card p-8 md:p-12 bg-white/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-klh-3">
            <Transition name="scale" mode="out-in">
              <div v-if="submitted" class="flex flex-col items-center text-center py-16">
                <div class="w-24 h-24 bg-klh-green-600/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-line">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-klh-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-klh-green-800 mb-2">Aspirasi Diterima</h2>
                <p class="text-ink-700 max-w-sm">Pesan Anda telah masuk ke antrean kami. Terima kasih atas partisipasinya.</p>
                <button @click="submitted = false" class="mt-8 text-xs font-bold uppercase tracking-widest text-klh-green-600 hover:underline">Kirim Pesan Lainnya</button>
              </div>
              <form v-else @submit.prevent="handleSubmit" class="space-y-8">
                <div class="border-b border-line pb-6 mb-8">
                  <h2 class="text-2xl font-bold text-klh-green-800">Formulir Aspirasi</h2>
                  <p class="text-sm text-ink-500 mt-1">Isi data di bawah ini dengan lengkap dan benar.</p>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="relative">
                    <label class="block text-xs font-bold uppercase text-klh-green-800 mb-1 opacity-70">Nama Pengirim</label>
                    <input v-model="formData.name" type="text" required placeholder="Nama Lengkap" class="form-input"/>
                  </div>
                  <div class="relative">
                    <label class="block text-xs font-bold uppercase text-klh-green-800 mb-1 opacity-70">Email</label>
                    <input v-model="formData.email" type="email" required placeholder="email@instansi.go.id" class="form-input"/>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div class="relative">
                    <label class="block text-xs font-bold uppercase text-klh-green-800 mb-1 opacity-70">Instansi / Organisasi</label>
                    <input v-model="formData.org" type="text" placeholder="Nama Instansi (Opsional)" class="form-input"/>
                  </div>
                  <div class="relative">
                    <label class="block text-xs font-bold uppercase text-klh-green-800 mb-1 opacity-70">Kategori</label>
                    <select v-model="formData.subject" required class="form-input appearance-none">
                      <option disabled value="">Pilih Kategori</option>
                      <option value="data">Permohonan Data Spasial</option>
                      <option value="konsultasi">Konsultasi Teknis</option>
                      <option value="kerjasama">Kemitraan Strategis</option>
                      <option value="pengaduan">Pengaduan Masyarakat</option>
                    </select>
                  </div>
                </div>

                <div class="relative">
                  <label class="block text-xs font-bold uppercase text-klh-green-800 mb-1 opacity-70">Uraian Pesan</label>
                  <textarea v-model="formData.message" required rows="5" placeholder="Tuliskan detail aspirasi atau pertanyaan Anda..." class="form-input resize-none"></textarea>
                  <div class="absolute bottom-2 right-3 text-xs text-ink-400">
                    {{ formData.message.length }} / {{ maxMsgLength }}
                  </div>
                </div>

                <button type="submit" :disabled="isSubmitting" class="relative w-full overflow-hidden rounded-xl bg-klh-green-800 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-klh-3 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50">
                  <div class="absolute inset-0 bg-klh-orange-500 opacity-0 hover:opacity-100 transition-opacity"></div>
                  <span class="relative z-10 flex items-center justify-center gap-2">
                    <svg v-if="isSubmitting" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 2 11 13"/>
                      <path d="m22 2-7 20-4-9-9-4z"/>
                    </svg>
                    <span>{{ isSubmitting ? 'Memproses...' : 'Kirim Aspirasi' }}</span>
                  </span>
                </button>
              </form>
            </Transition>

            <!-- Decorative corners -->
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-klh-blue-500/5 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-klh-orange-500/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-input {
  @apply w-full px-5 py-4 rounded-xl bg-white/70 border-2 border-line placeholder:text-ink-400 focus:border-klh-green-600 focus:bg-white focus:shadow-klh-3 transition-all text-ink-900 font-medium;
}
.animate-pulse-slow {
  animation: pulse 8s cubic-bezier(0.4,0,0.6,1) infinite;
}
@keyframes pulse {
  0%,100% { opacity:0.3; }
  50% { opacity:0.6; }
}
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity:0; }
  to { opacity:1; }
}
.scale-enter-active, .scale-leave-active {
  transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
.scale-enter-from { opacity:0; transform:scale(0.9); }
.scale-leave-to { opacity:0; transform:scale(1.1); }
</style>
