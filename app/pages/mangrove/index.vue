<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Ekosistem Mangrove | PPEPD',
  description: 'Portal data, informasi, dan layanan perlindungan ekosistem mangrove Indonesia – Direktorat PPEPD KLH/BPLH.',
})

const menu = [
  {
    to: '/mangrove/dashboard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
    label: 'Dashboard',
    desc: 'Pantau kerapatan, sebaran, tren luas, dan ancaman ekosistem mangrove Indonesia dengan data dan peta interaktif.',
    tag: 'Data & Peta',
    color: 'green',
  },
  {
    to: '/berita-events',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 2v6h6M9 15h6M9 11h3"/></svg>`,
    label: 'Berita & Kegiatan',
    desc: 'Ikuti perkembangan terbaru program perlindungan mangrove, kegiatan restorasi, regulasi, dan kolaborasi nasional.',
    tag: 'Berita',
    color: 'brand-orange',
  },
  {
    to: '/regulasi',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
    label: 'Regulasi',
    desc: 'Akses peraturan perundangan terkait perlindungan dan pengelolaan ekosistem mangrove dari UU hingga Permen.',
    tag: 'Dokumen Hukum',
    color: 'brand-blue',
  },
]

const stats = [
  { value: '3,36 jt', label: 'Hektare Mangrove', sub: 'terluas kedua di dunia' },
  { value: '37',      label: 'Kawasan Prioritas', sub: 'penanganan khusus' },
  { value: '34%',     label: 'Penurunan Deforestasi', sub: 'capaian 2025' },
  { value: '202',     label: 'Jenis Mangrove', sub: 'sejati & ikutan' },
]

const dmpmStats = [
  { value: '312', label: 'Desa Terdaftar' },
  { value: '22',  label: 'Provinsi' },
  { value: '1.840', label: 'Hektare Dipulihkan' },
  { value: '6.200+', label: 'Anggota Aktif' },
]

const dmpmDesa = [
  { nama: 'Tanjung Pasir',    kab: 'Kab. Tangerang',      prov: 'Banten',              luas: '42 ha',  status: 'Mandiri'   },
  { nama: 'Bedono',           kab: 'Kab. Demak',          prov: 'Jawa Tengah',          luas: '78 ha',  status: 'Mandiri'   },
  { nama: 'Pagatan Besar',    kab: 'Kab. Tanah Bumbu',    prov: 'Kalimantan Selatan',   luas: '120 ha', status: 'Mandiri'   },
  { nama: 'Pantai Bahagia',   kab: 'Kab. Karawang',       prov: 'Jawa Barat',           luas: '35 ha',  status: 'Berkembang' },
  { nama: 'Timbulsloko',      kab: 'Kab. Demak',          prov: 'Jawa Tengah',          luas: '56 ha',  status: 'Berkembang' },
  { nama: 'Pabean Udik',      kab: 'Kab. Indramayu',      prov: 'Jawa Barat',           luas: '29 ha',  status: 'Berkembang' },
  { nama: 'Sungai Bakau',     kab: 'Kab. Pontianak',      prov: 'Kalimantan Barat',     luas: '91 ha',  status: 'Mandiri'   },
  { nama: 'Kampung Mapia',    kab: 'Kab. Teluk Bintuni',  prov: 'Papua Barat',          luas: '210 ha', status: 'Mandiri'   },
]
</script>

<template>
  <div class="min-h-screen bg-brand-cream/40">

    <!-- Hero -->
    <div class="relative overflow-hidden bg-brand-cream border-b border-brand-green/8">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full"
          style="background: radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)"></div>
        <div class="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full"
          style="background: radial-gradient(circle, rgba(30,92,75,0.10) 0%, transparent 65%)"></div>
      </div>

      <div class="relative w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-10 pb-12">
        <div class="flex items-center gap-2 mb-8 text-brand-charcoal/35 text-xs font-bold uppercase tracking-widest">
          <NuxtLink to="/" class="hover:text-brand-charcoal/60 transition-colors">Beranda</NuxtLink>
          <span class="text-brand-charcoal/20">/</span>
          <span>Ekosistem Mangrove</span>
        </div>

        <div class="flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-20">
          <!-- Left -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-4">
              <span class="h-px w-6 bg-brand-green"></span>
              <span class="text-xs font-bold text-brand-green uppercase tracking-widest">Direktorat PPEPD · KLH/BPLH</span>
            </div>
            <h1 class="text-5xl md:text-6xl xl:text-7xl font-black text-brand-green-dark leading-[0.92] tracking-tight">
              Ekosistem<br>Mangrove
            </h1>
            <p class="text-brand-charcoal/50 text-base mt-5 max-w-sm leading-relaxed">
              Portal data, pemantauan, dan pengelolaan mangrove Indonesia — hutan pesisir terluas kedua di dunia.
            </p>
            <div class="flex items-center gap-3 mt-7">
              <NuxtLink to="/mangrove/dashboard"
                class="flex items-center gap-2 bg-brand-green-dark text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-brand-green transition-colors">
                Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </NuxtLink>
              <NuxtLink to="/berita-events"
                class="flex items-center gap-2 border border-brand-green/25 text-brand-green text-sm font-bold px-5 py-2.5 rounded-full hover:bg-brand-green/5 transition-colors">
                Berita & Kegiatan
              </NuxtLink>
            </div>
          </div>

          <!-- Right: stats -->
          <div class="shrink-0 w-full lg:w-auto">
            <div class="grid grid-cols-2 gap-3 lg:min-w-[300px]">
              <div v-for="s in stats" :key="s.label"
                class="bg-white border border-brand-green/10 rounded-2xl px-5 py-4 shadow-sm shadow-brand-green/5">
                <p class="text-brand-green-dark text-2xl font-black leading-none tabular-nums">{{ s.value }}</p>
                <p class="text-brand-charcoal/60 text-[11px] font-bold mt-2 leading-none">{{ s.label }}</p>
                <p class="text-brand-charcoal/35 text-[10px] mt-1">{{ s.sub }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu cards -->
    <div class="max-w-5xl mx-auto px-8 py-12">
      <p class="text-xs font-black text-brand-charcoal/35 uppercase tracking-widest mb-6">Navigasi</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <NuxtLink v-for="m in menu" :key="m.to" :to="m.to"
          class="group bg-white border border-brand-green/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-brand-green/30 hover:shadow-lg hover:shadow-brand-green/5 transition-all duration-300">
          <div class="flex items-start gap-4">
            <div class="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              :class="{
                'bg-brand-green/10 text-brand-green': m.color === 'green',
                'bg-brand-orange/10 text-brand-orange': m.color === 'brand-orange',
                'bg-brand-blue/10 text-brand-blue': m.color === 'brand-blue',
              }">
              <span class="w-5 h-5" v-html="m.icon"></span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h2 class="text-sm font-black text-brand-charcoal group-hover:text-brand-green-dark transition-colors">{{ m.label }}</h2>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                :class="{
                  'border-brand-green/20 text-brand-green/60 bg-brand-green/5': m.color === 'green',
                  'border-brand-orange/20 text-brand-orange/60 bg-brand-orange/5': m.color === 'brand-orange',
                  'border-brand-blue/20 text-brand-blue/60 bg-brand-blue/5': m.color === 'brand-blue',
                }">
                {{ m.tag }}
              </span>
            </div>
          </div>
          <p class="text-sm text-brand-charcoal/55 leading-relaxed">{{ m.desc }}</p>
          <div class="flex items-center gap-1 text-brand-charcoal/25 group-hover:text-brand-green text-xs font-bold transition-colors">
            Buka
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </div>
        </NuxtLink>
      </div>

      <!-- ─── DMPM Section ─────────────────────────────────────── -->
      <div class="mt-10">
        <!-- Header -->
        <div class="flex items-end justify-between mb-6">
          <div>
            <p class="text-xs font-black text-brand-charcoal/35 uppercase tracking-widest mb-1.5">Program Unggulan</p>
            <h2 class="text-xl font-black text-brand-green-dark leading-tight">Desa Mandiri Peduli Mangrove</h2>
            <p class="text-sm text-brand-charcoal/55 mt-1 max-w-lg">Program pemberdayaan masyarakat desa pesisir dalam perlindungan dan pengelolaan ekosistem mangrove secara mandiri dan berkelanjutan.</p>
          </div>
          <span class="shrink-0 text-[10px] font-black px-3 py-1.5 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 uppercase tracking-widest">DMPM</span>
        </div>

        <!-- Stats strip -->
        <div class="grid grid-cols-4 gap-3 mb-6">
          <div v-for="s in dmpmStats" :key="s.label"
            class="bg-brand-green-dark rounded-xl px-5 py-4 flex flex-col gap-1">
            <p class="text-white text-2xl font-black leading-none tabular-nums">{{ s.value }}</p>
            <p class="text-white/55 text-[11px] font-bold">{{ s.label }}</p>
          </div>
        </div>

        <!-- Desa table card -->
        <div class="bg-white border border-brand-green/10 rounded-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-brand-green/8">
            <p class="text-xs font-black text-brand-charcoal/40 uppercase tracking-widest">Desa Terdaftar — Sorotan</p>
            <div class="flex items-center gap-4 text-[10px] font-bold">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-brand-green"></span>
                <span class="text-brand-charcoal/40">Mandiri</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-brand-orange"></span>
                <span class="text-brand-charcoal/40">Berkembang</span>
              </div>
            </div>
          </div>
          <div class="divide-y divide-brand-green/5">
            <div v-for="d in dmpmDesa" :key="d.nama"
              class="flex items-center px-6 py-3.5 hover:bg-brand-green/2 transition-colors gap-4">
              <!-- Status dot -->
              <span class="shrink-0 w-2 h-2 rounded-full"
                :style="{ background: d.status === 'Mandiri' ? '#1E5C4B' : '#D97B3A' }"></span>
              <!-- Nama desa -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-brand-charcoal leading-none">{{ d.nama }}</p>
                <p class="text-[11px] text-brand-charcoal/40 mt-0.5">{{ d.kab }} · {{ d.prov }}</p>
              </div>
              <!-- Luas -->
              <div class="shrink-0 text-right">
                <p class="text-[11px] font-bold text-brand-green">{{ d.luas }}</p>
                <p class="text-[10px] text-brand-charcoal/30">dipulihkan</p>
              </div>
              <!-- Badge status -->
              <span class="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full"
                :style="d.status === 'Mandiri'
                  ? { background: '#1E5C4B18', color: '#1E5C4B' }
                  : { background: '#D97B3A18', color: '#D97B3A' }">
                {{ d.status }}
              </span>
            </div>
          </div>
          <!-- Footer -->
          <div class="px-6 py-4 border-t border-brand-green/8 bg-brand-cream/40 flex items-center justify-between">
            <p class="text-[11px] text-brand-charcoal/35">Menampilkan 8 dari 312 desa terdaftar · Diperbarui Mei 2026</p>
            <NuxtLink to="/berita-events" class="flex items-center gap-1.5 text-xs font-bold text-brand-green hover:text-brand-green-dark transition-colors">
              Lihat berita program
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Program description cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div class="bg-white border border-brand-green/10 rounded-2xl p-5">
            <div class="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
            </div>
            <p class="text-sm font-black text-brand-charcoal mb-1">Pemberdayaan Masyarakat</p>
            <p class="text-xs text-brand-charcoal/55 leading-relaxed">Desa dibina untuk membentuk kelompok peduli mangrove, menyusun rencana pengelolaan, dan melaksanakan kegiatan rehabilitasi secara mandiri.</p>
          </div>
          <div class="bg-white border border-brand-green/10 rounded-2xl p-5">
            <div class="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <p class="text-sm font-black text-brand-charcoal mb-1">Sertifikasi Desa Mandiri</p>
            <p class="text-xs text-brand-charcoal/55 leading-relaxed">Desa yang memenuhi kriteria kapasitas, luasan rehabilitasi, dan keberlanjutan program mendapatkan status "Desa Mandiri" dari Direktorat PPEPD.</p>
          </div>
          <div class="bg-white border border-brand-green/10 rounded-2xl p-5">
            <div class="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg>
            </div>
            <p class="text-sm font-black text-brand-charcoal mb-1">Jaringan Nasional</p>
            <p class="text-xs text-brand-charcoal/55 leading-relaxed">Desa DMPM tergabung dalam jaringan nasional yang memfasilitasi pertukaran pengetahuan, pendampingan teknis, dan akses program insentif pemerintah.</p>
          </div>
        </div>
      </div>

      <div class="mt-10 bg-white border border-brand-green/10 rounded-2xl p-8">
        <h2 class="text-xs font-black text-brand-charcoal/35 uppercase tracking-widest mb-4">Tentang Ekosistem Mangrove</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-brand-charcoal/65 leading-relaxed">
          <div>
            <p class="font-bold text-brand-charcoal/80 mb-2">Hutan Pesisir Strategis</p>
            <p>Indonesia memiliki mangrove terluas kedua di dunia, mencapai 3,36 juta hektare. Ekosistem ini menjadi benteng alami dari abrasi, tempat pemijahan ikan, penyerap karbon, dan penopang ketahanan masyarakat pesisir.</p>
          </div>
          <div>
            <p class="font-bold text-brand-charcoal/80 mb-2">Inventarisasi dan Pemantauan</p>
            <p>Direktorat PPEPD melaksanakan inventarisasi mangrove secara nasional sesuai Peraturan Menteri LH/BPLH Nomor 26 Tahun 2026, mencakup kerapatan, tutupan kanopi, jenis, dan kondisi ekosistem pendukungnya.</p>
          </div>
          <div>
            <p class="font-bold text-brand-charcoal/80 mb-2">Restorasi dan Rehabilitasi</p>
            <p>Program rehabilitasi mangrove ditargetkan pada kawasan prioritas dengan tekanan ekologis tinggi. Pendekatan melibatkan komunitas, pemerintah daerah, dan mitra internasional untuk memastikan keberlanjutan jangka panjang.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
