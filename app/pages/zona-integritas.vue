<script setup lang="ts">
const pillars = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    title: 'Manajemen Perubahan',
    description: 'Membangun komitmen dan budaya organisasi yang berintegritas melalui program transformasi birokrasi yang terencana dan berkelanjutan.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
    title: 'Penataan Tatalaksana',
    description: 'Meningkatkan efisiensi dan efektivitas sistem, proses, dan prosedur kerja melalui pemanfaatan teknologi informasi yang optimal.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    title: 'Penataan Sistem Manajemen SDM',
    description: 'Membangun sistem rekrutmen, pengembangan, dan penilaian kinerja pegawai yang transparan, objektif, dan berbasis kompetensi.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    title: 'Penguatan Akuntabilitas Kinerja',
    description: 'Meningkatkan kapasitas dan akuntabilitas kinerja birokrasi melalui sistem perencanaan, pengukuran, dan pelaporan yang transparan.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    title: 'Penguatan Pengawasan',
    description: 'Meningkatkan penyelenggaraan pemerintahan yang bersih dan bebas KKN melalui sistem pengendalian internal yang efektif.',
    color: 'from-red-500 to-rose-600',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>`,
    title: 'Peningkatan Kualitas Pelayanan Publik',
    description: 'Mewujudkan pelayanan publik yang prima, responsif, dan inovatif untuk meningkatkan kepuasan masyarakat pengguna layanan.',
    color: 'from-teal-500 to-green-600',
  },
]

const commitments = [
  'Tidak menerima gratifikasi dalam bentuk apapun',
  'Melayani dengan profesional, adil, dan tidak diskriminatif',
  'Melaporkan harta kekayaan (LHKPN) secara jujur dan tepat waktu',
  'Menolak segala bentuk korupsi, kolusi, dan nepotisme',
  'Menjaga kerahasiaan informasi negara yang bersifat rahasia',
  'Melaksanakan tugas dengan penuh tanggung jawab dan integritas',
]

const documents = [
  {
    title: 'Maklumat Pelayanan',
    desc: 'Pernyataan komitmen pelayanan publik PPEPD',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  },
  {
    title: 'Survei Kepuasan Masyarakat',
    desc: 'Hasil SKM tahun berjalan',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  },
  {
    title: 'Rencana Aksi ZI',
    desc: 'Dokumen rencana aksi menuju WBK/WBBM',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  },
  {
    title: 'Pakta Integritas',
    desc: 'Dokumen pakta integritas seluruh pegawai',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  },
]

useSeoMeta({
  title: 'Zona Integritas - PPEPD',
  description: 'Komitmen Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat, Deputi Bidang Tata Lingkungan dan Sumber Daya Alam Berkelanjutan menuju WBK dan WBBM.',
})
</script>

<template>
  <div class="relative -mx-6 -mt-12 overflow-hidden">

    <!-- Hero Banner -->
    <div class="relative px-6 pb-16 pt-28">
      <div class="mx-auto max-w-6xl">
        <nav class="mb-8 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-charcoal/45">
          <NuxtLink to="/" class="transition-colors hover:text-brand-green">Beranda</NuxtLink>
          <span>/</span>
          <span class="text-brand-green-dark">Zona Integritas</span>
        </nav>

        <div class="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-brand-green">
              <span class="h-2 w-2 rounded-full bg-brand-green animate-pulse"></span>
              Menuju WBK / WBBM
            </div>
            <h1 class="text-4xl font-black leading-tight text-brand-green-dark md:text-5xl">
              Zona Integritas
            </h1>
            <p class="mt-4 text-base font-medium leading-relaxed text-brand-charcoal/65">
              Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat, Deputi Bidang Tata Lingkungan dan Sumber Daya Alam Berkelanjutan berkomitmen membangun birokrasi yang bersih, transparan, dan melayani masyarakat dengan sepenuh hati.
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <a href="#komitmen" class="inline-flex items-center gap-2 rounded-xl bg-brand-green-dark px-6 py-3 text-sm font-black text-white transition-all hover:bg-brand-green hover:shadow-lg hover:shadow-brand-green/20 hover:-translate-y-0.5">
                Lihat Komitmen
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <a href="#dokumen" class="inline-flex items-center gap-2 rounded-xl border border-brand-green/20 bg-white px-6 py-3 text-sm font-black text-brand-green-dark transition-all hover:border-brand-green/40 hover:shadow-md">
                Unduh Dokumen
              </a>
            </div>
          </div>

          <!-- Status Cards -->
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-2xl bg-white border border-brand-green/10 p-6 shadow-sm">
              <div class="text-4xl font-black text-brand-green">WBK</div>
              <div class="mt-1 text-sm font-bold text-brand-charcoal/60">Wilayah Bebas dari Korupsi</div>
              <div class="mt-3 flex items-center gap-2">
                <div class="h-2 flex-1 rounded-full bg-brand-charcoal/10">
                  <div class="h-2 w-[78%] rounded-full bg-brand-green"></div>
                </div>
                <span class="text-xs font-black text-brand-green">78%</span>
              </div>
            </div>
            <div class="rounded-2xl bg-white border border-brand-green/10 p-6 shadow-sm">
              <div class="text-4xl font-black text-blue-500">WBBM</div>
              <div class="mt-1 text-sm font-bold text-brand-charcoal/60">Birokrasi Bersih Melayani</div>
              <div class="mt-3 flex items-center gap-2">
                <div class="h-2 flex-1 rounded-full bg-brand-charcoal/10">
                  <div class="h-2 w-[55%] rounded-full bg-blue-500"></div>
                </div>
                <span class="text-xs font-black text-blue-500">55%</span>
              </div>
            </div>
            <div class="col-span-2 rounded-2xl bg-white border border-brand-green/10 p-6 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-brand-charcoal/50">Indeks Integritas</div>
                  <div class="text-3xl font-black text-amber-500">82.4</div>
                </div>
                <div>
                  <div class="text-xs font-bold text-brand-charcoal/50">Survei Kepuasan</div>
                  <div class="text-3xl font-black text-teal-600">89.1%</div>
                </div>
                <div>
                  <div class="text-xs font-bold text-brand-charcoal/50">Pegawai Berkomitmen</div>
                  <div class="text-3xl font-black text-brand-green-dark">100%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-brand-cream px-6">
      <!-- About ZI Section -->
      <section class="mx-auto max-w-6xl py-20">
        <div class="grid gap-12 md:grid-cols-5 items-center">
          <div class="md:col-span-3">
            <div class="mb-3 text-xs font-black uppercase tracking-widest text-brand-green">Tentang Program</div>
            <h2 class="text-3xl font-black text-brand-green-dark">Apa itu Zona Integritas?</h2>
            <div class="mt-6 space-y-4 text-sm font-medium leading-relaxed text-brand-charcoal/70">
              <p>
                Zona Integritas (ZI) adalah predikat yang diberikan kepada instansi pemerintah yang pimpinan dan jajarannya mempunyai komitmen untuk mewujudkan WBK/WBBM melalui reformasi birokrasi, khususnya dalam hal pencegahan korupsi dan peningkatan kualitas pelayanan publik.
              </p>
              <p>
                Program ini merupakan implementasi dari Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 90 Tahun 2021 tentang Pembangunan dan Evaluasi Zona Integritas Menuju WBK dan WBBM di Instansi Pemerintah.
              </p>
              <p>
                Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat berkomitmen penuh untuk mewujudkan birokrasi yang bersih dari praktik korupsi, kolusi, dan nepotisme, serta meningkatkan kualitas pelayanan kepada masyarakat secara berkelanjutan.
              </p>
            </div>
          </div>
          <div class="md:col-span-2 space-y-4">
            <div class="rounded-2xl bg-white border border-brand-green/10 p-6 shadow-sm">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <div class="font-black text-brand-green-dark">WBK</div>
                  <div class="text-xs text-brand-charcoal/60 mt-1 font-medium">Wilayah Bebas dari Korupsi — predikat pertama yang menandai komitmen anti-korupsi unit kerja.</div>
                </div>
              </div>
            </div>
            <div class="rounded-2xl bg-white border border-brand-green/10 p-6 shadow-sm">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <div class="font-black text-brand-green-dark">WBBM</div>
                  <div class="text-xs text-brand-charcoal/60 mt-1 font-medium">Wilayah Birokrasi Bersih dan Melayani — predikat tertinggi yang menunjukkan pelayanan publik prima.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6 Pillars Section -->
      <section class="mx-auto max-w-6xl py-16">
        <div class="mb-12 text-center">
          <div class="mb-3 text-xs font-black uppercase tracking-widest text-brand-green">Enam Komponen</div>
          <h2 class="text-3xl font-black text-brand-green-dark">Pilar Pembangunan Zona Integritas</h2>
          <p class="mt-3 mx-auto max-w-xl text-sm font-medium text-brand-charcoal/60">
            Pembangunan Zona Integritas berlandaskan enam komponen utama yang menjadi tolok ukur penilaian WBK dan WBBM.
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(pillar, i) in pillars"
            :key="pillar.title"
            class="group relative overflow-hidden rounded-2xl bg-white border border-brand-green/10 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-xl hover:shadow-brand-green/10"
          >
            <div class="mb-4 flex items-center gap-3">
              <div :class="`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white shadow-lg`" v-html="pillar.icon"></div>
              <div class="text-xs font-black uppercase tracking-widest text-brand-charcoal/30">0{{ i + 1 }}</div>
            </div>
            <h3 class="font-black text-brand-green-dark text-base leading-snug">{{ pillar.title }}</h3>
            <p class="mt-2 text-xs font-medium leading-relaxed text-brand-charcoal/60">{{ pillar.description }}</p>
          </div>
        </div>
      </section>

      <!-- Commitment Section -->
      <section id="komitmen" class="scroll-mt-20 mx-auto max-w-6xl py-16">
        <div class="rounded-3xl bg-gradient-to-br from-brand-green-dark to-teal-700 p-8 md:p-12 relative overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-[120px]"></div>
          </div>
          <div class="relative">
            <div class="mb-3 text-xs font-black uppercase tracking-widest text-green-300">Pakta Integritas</div>
            <h2 class="text-2xl font-black text-white md:text-3xl">Komitmen Kami</h2>
            <p class="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-white/70">
              Seluruh pegawai Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat berkomitmen dan bersumpah untuk:
            </p>
            <div class="mt-8 grid gap-4 md:grid-cols-2">
              <div
                v-for="item in commitments"
                :key="item"
                class="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/10"
              >
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-green-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand-green-dark"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span class="text-sm font-medium text-white/85 leading-snug">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Documents Section -->
      <section id="dokumen" class="scroll-mt-20 mx-auto max-w-6xl py-16">
        <div class="mb-10">
          <div class="mb-3 text-xs font-black uppercase tracking-widest text-brand-green">Transparansi</div>
          <h2 class="text-3xl font-black text-brand-green-dark">Dokumen Zona Integritas</h2>
          <p class="mt-2 text-sm font-medium text-brand-charcoal/60">Dokumen publik terkait pembangunan Zona Integritas PPEPD.</p>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="doc in documents"
            :key="doc.title"
            class="group flex flex-col gap-4 rounded-2xl bg-white border border-brand-green/10 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-lg cursor-pointer"
          >
            <div class="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all duration-300" v-html="doc.icon"></div>
            <div>
              <div class="font-black text-brand-green-dark text-sm leading-snug">{{ doc.title }}</div>
              <div class="mt-1 text-xs font-medium text-brand-charcoal/50">{{ doc.desc }}</div>
            </div>
            <div class="mt-auto flex items-center gap-1 text-xs font-black text-brand-green/50 group-hover:text-brand-green transition-colors">
              Unduh
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Gratification Report CTA -->
      <section class="mx-auto max-w-6xl py-16">
        <div class="rounded-3xl bg-white border border-brand-green/10 shadow-sm p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="max-w-xl">
            <div class="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-100 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Anti-Gratifikasi
            </div>
            <h3 class="text-2xl font-black text-brand-green-dark">Laporkan Gratifikasi</h3>
            <p class="mt-3 text-sm font-medium leading-relaxed text-brand-charcoal/65">
              Jika Anda mengetahui atau mengalami dugaan gratifikasi, suap, atau pelanggaran integritas yang melibatkan pegawai PPEPD, segera laporkan melalui saluran pengaduan resmi kami.
            </p>
          </div>
          <div class="flex flex-col gap-3 shrink-0">
            <NuxtLink
              to="/hubungi"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green-dark px-8 py-4 text-sm font-black text-white transition-all hover:bg-brand-green hover:shadow-lg hover:shadow-brand-green/20 hover:-translate-y-0.5"
            >
              Laporkan Sekarang
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </NuxtLink>
            <p class="text-center text-xs font-medium text-brand-charcoal/40">Laporan dijamin kerahasiaannya</p>
          </div>
        </div>
      </section>
    </div>

  </div>
</template>
