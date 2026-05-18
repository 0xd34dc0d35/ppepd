<script setup lang="ts">
import { ref } from 'vue'

useSeoMeta({
  title: 'Layanan – PPEPD',
  description: 'Layanan perlindungan dan pengelolaan ekosistem perairan darat: Mangrove, Danau, dan Mata Air.',
})

const openFaq = ref<number | null>(null)
function toggleFaq(i: number) {
  openFaq.value = openFaq.value === i ? null : i
}

const stats = [
  { value: '3,36 Jt Ha', label: 'Kawasan Mangrove' },
  { value: '15', label: 'Danau Prioritas Nasional' },
  { value: '1.200+', label: 'Mata Air Dilindungi' },
]

const services = [
  {
    key: 'mangrove',
    label: 'Ekosistem Mangrove',
    subtitle: '',
    description: 'Inventarisasi, pemantauan kondisi tutupan, dan dukungan rehabilitasi kawasan mangrove sebagai tameng pesisir dan habitat hayati.',
    image: '/images/layanan/item-mang-medium.jpg',
    featured: false,
    features: [
      { text: 'Peta Mangrove Nasional', yes: true },
      { text: 'Peta Kesatuan Lanskap Mangrove', yes: true },
      { text: 'Inventarisasi Mangrove', yes: true },
      { text: 'Rencana Perlindungan dan Pengelolaan Mangrove Nasional', yes: true },
      { text: 'Desa Mandiri Peduli Mangrove', yes: true },
      { text: 'Pengawasan, dan Pemulihan', yes: true },
    ],
  },
  {
    key: 'danau',
    label: 'Ekosistem Danau',
    subtitle: '',
    description: 'Pengelolaan komprehensif 15 danau prioritas nasional: pemantauan kualitas air, beban pencemaran, dan koordinasi pemangku kepentingan.',
    image: '/images/layanan/item-danau-medium.jpg',
    featured: false,
    features: [
      { text: 'Profil ekologi setiap danau', yes: true },
      { text: 'Pemantauan kualitas air', yes: true },
      { text: 'Laporan beban pencemaran', yes: true },
      { text: 'Koordinasi multipihak', yes: true },
      { text: 'Integrasi data multisumber', yes: true },
      { text: 'Dashboard interaktif real-time', yes: true },
    ],
  },
  {
    key: 'mata-air',
    label: 'Ekosistem Mata Air',
    subtitle: '',
    description: 'Perlindungan dan pendampingan teknis mata air sebagai sumber air baku bagi masyarakat dan ekosistem sekitarnya.',
    image: '/images/layanan/item-ma-medium.jpg',
    featured: false,
    features: [
      { text: 'Registrasi dan pemetaan lokasi', yes: true },
      { text: 'Analisis debit dan kualitas', yes: true },
      { text: 'Laporan pemantauan berkala', yes: true },
      { text: 'Pendampingan perlindungan', yes: false },
      { text: 'Integrasi data multisumber', yes: false },
      { text: 'Dashboard interaktif real-time', yes: false },
    ],
  },
]

const comparisonFeatures = [
  { label: 'Peta & Spasial',              mangrove: true,  danau: true,  mataAir: true  },
  { label: 'Pemantauan Kualitas Air',      mangrove: false, danau: true,  mataAir: true  },
  { label: 'Laporan Berkala',              mangrove: true,  danau: true,  mataAir: true  },
  { label: 'Analisis Beban Pencemaran',    mangrove: false, danau: true,  mataAir: false },
  { label: 'Koordinasi Multipihak',        mangrove: true,  danau: true,  mataAir: false },
  { label: 'Pendampingan Teknis',          mangrove: true,  danau: true,  mataAir: false },
  { label: 'Dashboard Real-time',          mangrove: false, danau: true,  mataAir: false },
  { label: 'Integrasi Data Multisumber',   mangrove: false, danau: true,  mataAir: false },
]

const faqs = [
  {
    q: 'Siapa yang bisa mengakses layanan PPEPD?',
    a: 'Layanan kami terbuka untuk instansi pemerintah pusat dan daerah, lembaga penelitian, perguruan tinggi, serta mitra swasta yang bekerja di bidang konservasi ekosistem perairan darat.',
  },
  {
    q: 'Bagaimana cara mengajukan kerja sama atau permintaan data?',
    a: 'Pengajuan dapat dilakukan melalui formulir hubungi kami atau langsung menghubungi Direktorat PPEPD. Tim kami akan merespons dalam 2×24 jam kerja.',
  },
  {
    q: 'Apakah akses data dikenakan biaya?',
    a: 'Data yang tersedia di portal ini bersifat terbuka (open data) dan bebas diakses. Layanan pendampingan teknis dan analisis khusus dapat dikonsultasikan lebih lanjut dengan tim kami.',
  },
  {
    q: 'Berapa lama proses permohonan kerja sama?',
    a: 'Proses permohonan umumnya memerlukan 5–10 hari kerja, tergantung pada lingkup dan kompleksitas kerja sama yang diajukan.',
  },
  {
    q: 'Apakah tersedia dukungan teknis untuk pengolahan data?',
    a: 'Ya. Tim teknis PPEPD menyediakan pendampingan dalam pengolahan dan interpretasi data, khususnya untuk kebutuhan penelitian dan perencanaan pengelolaan ekosistem.',
  },
]
</script>

<template>
  <div class="relative -mx-6 -mt-12 overflow-hidden">

    <!-- ── Hero ── -->
    <section class="relative px-6 pt-28 pb-10 text-center overflow-hidden">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-green/8 blur-[150px]" />
        <div class="absolute bottom-0 right-[-5%] w-[50%] h-[50%] rounded-full bg-brand-blue/6 blur-[150px]" />
      </div>

      <div class="relative mx-auto max-w-3xl">
        <p class="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-4">Deputi Tata Lingkungan & SDA Berkelanjutan · KLH/BPLH</p>
        <h3 class="text-center text-2xl md:text-4xl font-black tracking-tighter mb-4 leading-[0.9] text-brand-orange">
          Perlindungan dan Pengelolaan
        </h3>
        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 max-w-xl mx-auto">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="glass-card px-4 py-5 text-center cursor-default"
          >
            <p class="text-2xl font-black text-brand-green-dark">{{ stat.value }}</p>
            <p class="mt-1 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Service Cards ── -->
    <section class="px-6 py-10">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-black text-brand-green-dark tracking-tight">Cakupan Layanan</h2>
          <p class="mt-3 text-sm font-medium text-brand-charcoal/50">Pilih ekosistem yang sesuai dengan kebutuhan Anda</p>
        </div>

        <div class="grid gap-8 md:grid-cols-3 items-start">
          <article
            v-for="svc in services"
            :key="svc.key"
            :class="[
              'glass-card group relative overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2',
              svc.featured
                ? 'ring-2 ring-brand-green shadow-xl shadow-brand-green/10 md:scale-[1.04]'
                : ''
            ]"
          >
            <!-- Neon border spinner (FeatureGrid pattern) -->
            <div class="absolute top-1/2 left-1/2 w-[600px] h-[120px] bg-[linear-gradient(transparent,theme(colors.brand.green-dark),theme(colors.brand.green-dark),theme(colors.brand.green-dark),transparent)] animate-[spin_4s_linear_infinite] origin-top-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
            <!-- Inner solid layer (clips content to rounded card) -->
            <div class="absolute inset-[3px] bg-brand-cream group-hover:bg-white rounded-[calc(1rem-3px)] z-[1] transition-colors duration-500 overflow-hidden" />

            <!-- Featured badge -->
            <div v-if="svc.featured" class="absolute top-4 right-4 z-20">
              <span class="rounded-full bg-brand-green px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-green/30">
                Unggulan
              </span>
            </div>

            <!-- Card content (above inner layer) -->
            <div class="relative z-10 flex flex-col h-full">
              <!-- Image -->
              <div class="relative h-44 flex-shrink-0 overflow-hidden">
                <img
                  :src="svc.image"
                  :alt="svc.label"
                  loading="lazy"
                  class="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-90"
                />
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-brand-green-dark/30" />
              </div>

              <!-- Body -->
              <div class="flex flex-col flex-grow p-8">
                <p class="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-1">{{ svc.subtitle }}</p>
                <h3 class="text-2xl font-black text-brand-green-dark mb-3">{{ svc.label }}</h3>
                <p class="text-base leading-relaxed text-brand-charcoal/60 mb-6">{{ svc.description }}</p>

                <!-- Features -->
                <ul class="mb-8 flex flex-col gap-2.5">
                  <li
                    v-for="feat in svc.features"
                    :key="feat.text"
                    class="flex items-center gap-2.5"
                  >
                    <span :class="[
                      'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
                      feat.yes
                        ? 'bg-brand-green/10 text-brand-green'
                        : 'bg-brand-charcoal/5 text-brand-charcoal/25'
                    ]">
                      <svg v-if="feat.yes" xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </span>
                    <span :class="['text-sm font-medium', feat.yes ? 'text-brand-charcoal/70' : 'text-brand-charcoal/25']">
                      {{ feat.text }}
                    </span>
                  </li>
                </ul>

                <div class="mt-auto">
                  <NuxtLink
                    to="/hubungi"
                    :class="[
                      'block w-full rounded-xl py-3 text-center text-xs font-black uppercase tracking-widest transition-all duration-300',
                      svc.featured
                        ? 'bg-brand-green-dark text-white hover:bg-brand-green'
                        : 'border-2 border-brand-green/20 text-brand-green hover:border-brand-green hover:bg-brand-green hover:text-white'
                    ]"
                  >
                    Jelajahi
                  </NuxtLink>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ── Comparison Table ── -->
    <section class="px-6 py-20 pt-4">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-black text-brand-green-dark tracking-tight">Layanan</h2>
          <p class="mt-3 text-sm font-medium text-brand-charcoal/50">Fitur lengkap yang tersedia di setiap ekosistem</p>
        </div>

        <div class="overflow-hidden rounded-2xl border border-brand-green/10 bg-white/60 backdrop-blur-xl shadow-sm">
          <!-- Header -->
          <div class="grid grid-cols-4 bg-brand-cream/80 border-b border-brand-green/10">
            <div class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Fitur</div>
            <div class="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-brand-charcoal/60">Mangrove</div>
            <div class="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-brand-green bg-brand-green/5">Danau</div>
            <div class="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-brand-charcoal/60">Mata Air</div>
          </div>

          <!-- Rows -->
          <div
            v-for="(row, i) in comparisonFeatures"
            :key="row.label"
            :class="['grid grid-cols-4 border-b border-brand-green/5 last:border-0', i % 2 !== 0 ? 'bg-brand-cream/30' : '']"
          >
            <div class="px-6 py-4 text-sm font-bold text-brand-charcoal/70">{{ row.label }}</div>

            <div class="px-6 py-4 flex justify-center items-center">
              <span :class="['h-5 w-5 rounded-full flex items-center justify-center', row.mangrove ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-charcoal/5 text-brand-charcoal/20']">
                <svg v-if="row.mangrove" xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </span>
            </div>

            <div class="px-6 py-4 flex justify-center items-center bg-brand-green/5">
              <span :class="['h-5 w-5 rounded-full flex items-center justify-center', row.danau ? 'bg-brand-green text-white' : 'bg-brand-charcoal/5 text-brand-charcoal/20']">
                <svg v-if="row.danau" xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </span>
            </div>

            <div class="px-6 py-4 flex justify-center items-center">
              <span :class="['h-5 w-5 rounded-full flex items-center justify-center', row.mataAir ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-charcoal/5 text-brand-charcoal/20']">
                <svg v-if="row.mataAir" xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FAQ ── -->
    <section class="px-6 py-10 pt-6">
      <div class="mx-auto max-w-3xl">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-black text-brand-green-dark tracking-tight">Pertanyaan Umum</h2>
          <p class="mt-3 text-sm font-medium text-brand-charcoal/50">Informasi yang sering ditanyakan tentang layanan kami</p>
        </div>

        <div class="flex flex-col gap-3">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="glass-card overflow-hidden cursor-default"
          >
            <button
              class="flex w-full items-center justify-between px-6 py-4 text-left"
              @click="toggleFaq(i)"
            >
              <span class="text-sm font-bold text-brand-green-dark pr-4">{{ faq.q }}</span>
              <span :class="['flex-shrink-0 text-brand-charcoal/40 transition-transform duration-300', openFaq === i ? 'rotate-180' : '']">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </button>
            <div v-show="openFaq === i" class="border-t border-brand-green/8 px-6 py-4">
              <p class="text-sm font-medium leading-relaxed text-brand-charcoal/60">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="px-6 py-10 text-center relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute top-[-30%] left-[20%] w-[60%] h-[160%] rounded-full bg-brand-green/5 blur-[100px]" />
      </div>
      <div class="relative mx-auto max-w-2xl">
        <p class="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-4">Mulai Berkolaborasi</p>
        <h2 class="text-4xl font-black tracking-tight mb-4">
          <span class="gradient-text">Siap Berkolaborasi?</span>
        </h2>
        <p class="text-base font-medium text-brand-charcoal/60 mb-10 max-w-lg mx-auto leading-relaxed">
          Hubungi tim kami untuk memulai kerja sama atau mengakses data ekosistem perairan darat Indonesia.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-5">
          <NuxtLink
            to="/hubungi"
            class="group relative px-10 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-[0_10px_30px_rgba(13,61,48,0.2)] overflow-hidden"
          >
            <div class="absolute inset-[2px] bg-brand-green-dark rounded-[calc(0.75rem-2px)] z-0 overflow-hidden">
              <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </div>
            <span class="relative z-10 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
              Hubungi Kami
            </span>
          </NuxtLink>
          <NuxtLink
            to="/data"
            class="px-10 py-4 rounded-xl border-2 border-brand-green/20 text-brand-green text-xs font-black uppercase tracking-widest hover:border-brand-green hover:bg-brand-green hover:text-white transition-all duration-300"
          >
            Jelajahi Data
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>
