<script setup lang="ts">
useSeoMeta({
  title: 'Tentang Kami – PPEPD',
  description: 'Profil, visi-misi, tugas dan fungsi Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat.',
})

const stats = [
  { value: '3,36 Jt', unit: 'Ha', label: 'Kawasan Mangrove' },
  { value: '15',       unit: '+',  label: 'Danau Prioritas' },
  { value: '1.200',    unit: '+',  label: 'Mata Air Terlindungi' },
  { value: '34',       unit: '',   label: 'Provinsi Terlayani' },
]

const functions = [
  {
    n: '01',
    title: 'Penyusunan Kebijakan',
    desc: 'Merumuskan norma, standar, prosedur, dan kriteria perlindungan ekosistem perairan darat.',
  },
  {
    n: '02',
    title: 'Inventarisasi & Identifikasi',
    desc: 'Melaksanakan inventarisasi dan identifikasi kondisi ekosistem mangrove, danau, dan mata air secara berkala.',
  },
  {
    n: '03',
    title: 'Pemantauan & Evaluasi',
    desc: 'Memantau status dan tren perubahan ekosistem untuk mendukung pengambilan keputusan berbasis data.',
  },
  {
    n: '04',
    title: 'Fasilitasi Rehabilitasi',
    desc: 'Mendukung pemulihan ekosistem yang terdegradasi melalui bimbingan teknis dan koordinasi multipihak.',
  },
  {
    n: '05',
    title: 'Koordinasi Lintas Sektor',
    desc: 'Membangun kerja sama dengan kementerian, pemda, akademisi, dan masyarakat sipil dalam pengelolaan ekosistem.',
  },
  {
    n: '06',
    title: 'Pembinaan & Pengawasan',
    desc: 'Memberikan pembinaan teknis dan pengawasan terhadap pelaksanaan perlindungan ekosistem di lapangan.',
  },
]

const values = [
  {
    title: 'Integritas',
    desc: 'Bekerja dengan kejujuran, transparansi, dan akuntabilitas dalam setiap tugas dan keputusan.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
  },
  {
    title: 'Kolaborasi',
    desc: 'Membangun kemitraan yang kuat lintas sektor demi tujuan konservasi yang lebih besar.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    title: 'Inovasi',
    desc: 'Mengembangkan solusi kreatif berbasis teknologi dan data untuk tantangan pengelolaan ekosistem.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>`,
  },
  {
    title: 'Keberlanjutan',
    desc: 'Setiap program dan kebijakan berorientasi pada manfaat jangka panjang bagi ekosistem dan generasi mendatang.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M12 8v4l3 3"/></svg>`,
  },
  {
    title: 'Profesionalisme',
    desc: 'Menjunjung standar kualitas tertinggi dalam setiap layanan, data, dan analisis yang dihasilkan.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  },
  {
    title: 'Responsif',
    desc: 'Tanggap terhadap kebutuhan masyarakat, mitra, dan dinamika perubahan ekosistem secara real-time.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  },
]

const milestones = [
  {
    year: '2015',
    title: 'Pembentukan Direktorat',
    desc: 'Direktorat PPEPD resmi dibentuk di bawah Kementerian Lingkungan Hidup sebagai unit khusus pengelolaan ekosistem perairan darat.',
    accent: 'bg-brand-green',
  },
  {
    year: '2017',
    title: 'Penetapan 15 Danau Prioritas',
    desc: 'Pemerintah menetapkan 15 danau prioritas nasional yang memerlukan penanganan segera akibat tekanan ekologis dan degradasi.',
    accent: 'bg-brand-blue',
  },
  {
    year: '2019',
    title: 'Program Rehabilitasi Mangrove',
    desc: 'Peluncuran program rehabilitasi mangrove skala besar dengan target pemulihan ratusan ribu hektare kawasan pesisir.',
    accent: 'bg-brand-green',
  },
  {
    year: '2021',
    title: 'Integrasi Data Nasional',
    desc: 'Sistem data ekosistem terintegrasi ke dalam platform informasi geospasial nasional untuk akses publik yang lebih luas.',
    accent: 'bg-brand-orange',
  },
  {
    year: '2023',
    title: 'Peluncuran Platform SIPPEM',
    desc: 'Portal SIPPEM diluncurkan sebagai wujud transparansi data dan keterbukaan informasi publik tentang kondisi ekosistem perairan darat.',
    accent: 'bg-brand-blue',
  },
  {
    year: '2024',
    title: 'Perlindungan 1.200+ Mata Air',
    desc: 'Pencapaian milestone proteksi lebih dari 1.200 titik mata air strategis di seluruh Indonesia melalui program terpadu.',
    accent: 'bg-brand-green',
  },
]
</script>

<template>
  <div class="relative -mx-6 -mt-12 overflow-hidden">

    <!-- ── HERO ── -->
    <section class="relative px-6 pt-28 pb-16 overflow-hidden">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-green/8 blur-[150px]" />
        <div class="absolute bottom-0 right-[-5%] w-[50%] h-[50%] rounded-full bg-brand-blue/6 blur-[150px]" />
        <div class="absolute top-[30%] left-[40%] w-[30%] h-[40%] rounded-full bg-brand-orange/5 blur-[100px]" />
      </div>

      <div class="relative mx-auto max-w-6xl">
        <!-- Headline block -->
        <div class="mb-12 max-w-4xl">
          <h3 class="text-2xl md:text-4xl font-black tracking-tighter mb-3 leading-[0.9] text-brand-orange">
            Perlindungan dan Pengelolaan
          </h3>
          <h1 class="text-5xl md:text-5xl lg:text-5xl font-black tracking-tighter mb-6 leading-[0.85]">
            <span class="gradient-text">Ekosistem Perairan Darat</span>
          </h1>
          <p class="text-base md:text-lg text-brand-charcoal/70 font-medium leading-relaxed max-w-2xl">
            Kami adalah direktorat teknis di bawah Kementerian Lingkungan Hidup yang bertugas melindungi dan mengelola ekosistem mangrove, danau, dan mata air sebagai aset vital bangsa.
          </p>
        </div>

        <!-- Bento stats grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="glass-card px-5 py-6 cursor-default group hover:-translate-y-1 transition-transform duration-300"
          >
            <p class="text-3xl font-black text-brand-green-dark tracking-tighter">
              {{ stat.value }}<span class="text-brand-green text-2xl">{{ stat.unit }}</span>
            </p>
            <p class="mt-2 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PROFIL SINGKAT ── -->
    <section class="px-6 py-8">
      <div class="mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

        <!-- Left: text -->
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-3">Profil Organisasi</p>
          <h2 class="text-4xl font-black text-brand-green-dark tracking-tight mb-6">
            Tentang Direktorat<br /><span class="gradient-text">PPEPD</span>
          </h2>
          <div class="space-y-4 text-base font-medium text-brand-charcoal/65 leading-relaxed">
            <p>
              Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat (PPEPD)
              merupakan unit kerja di bawah Deputi Tata Lingkungan dan Sumber Daya Alam Berkelanjutan
              yang melaksanakan mandat strategis untuk menjaga kelestarian ekosistem perairan darat Indonesia.
            </p>
            <p>
              Dengan cakupan tugas yang meliputi mangrove, danau, dan mata air, PPEPD menjadi ujung tombak penerapan kebijakan perlindungan ekosistem berbasis sains dan data.
            </p>
            <p>
              Melalui kolaborasi dengan pemerintah daerah, akademisi, lembaga swadaya masyarakat, dan sektor swasta, kami mendorong pendekatan pengelolaan ekosistem yang inklusif dan berkelanjutan.
            </p>
          </div>
          <div class="mt-8 flex gap-4">
            <NuxtLink
              to="/layanan"
              class="group px-6 py-3 rounded-xl bg-brand-green-dark text-white text-xs font-black uppercase tracking-widest transition-all hover:scale-105 hover:shadow-lg hover:shadow-brand-green/20"
            >
              Lihat Layanan
            </NuxtLink>
            <NuxtLink
              to="/data"
              class="px-6 py-3 rounded-xl border-2 border-brand-green/20 text-brand-green text-xs font-black uppercase tracking-widest hover:border-brand-green hover:bg-brand-green hover:text-white transition-all duration-300"
            >
              Jelajahi Data
            </NuxtLink>
          </div>
        </div>

        <!-- Right: visi-misi cards -->
        <div class="flex flex-col gap-4">
          <div class="glass-card p-8 cursor-default border-l-4 border-l-brand-green">
            <p class="text-[10px] font-black uppercase tracking-widest text-brand-green mb-3">Visi</p>
            <p class="text-lg font-black text-brand-green-dark leading-snug">
              Terwujudnya ekosistem perairan darat yang terlindungi, dikelola secara berkelanjutan, dan memberikan manfaat optimal bagi seluruh masyarakat Indonesia.
            </p>
          </div>
          <div class="glass-card p-8 cursor-default">
            <p class="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-3">Misi</p>
            <ul class="space-y-3">
              <li
                v-for="(misi, i) in [
                  'Melaksanakan inventarisasi ekosistem perairan darat secara berkala dan komprehensif',
                  'Mengembangkan kebijakan perlindungan berbasis data dan kearifan lokal',
                  'Mendorong rehabilitasi ekosistem yang terdegradasi secara sistematis',
                  'Membangun kemitraan multipihak yang inklusif dan berkelanjutan',
                ]"
                :key="i"
                class="flex items-start gap-3"
              >
                <span class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </span>
                <span class="text-sm font-medium text-brand-charcoal/65 leading-relaxed">{{ misi }}</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>

    <!-- ── TUGAS & FUNGSI ── -->
    <section class="px-6 py-8">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-14">
          <p class="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-3">Tugas & Fungsi</p>
          <h2 class="text-4xl font-black text-brand-green-dark tracking-tight">Apa yang Kami Kerjakan</h2>
          <p class="mt-3 text-sm font-medium text-brand-charcoal/50 max-w-xl mx-auto">Enam fungsi utama yang menjadi landasan operasional direktorat dalam menjalankan mandatnya.</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="fn in functions"
            :key="fn.n"
            class="glass-card group p-8 hover:-translate-y-2 transition-all duration-500 cursor-default relative overflow-hidden"
          >
            <!-- Neon border -->
            <div class="absolute top-1/2 left-1/2 w-[600px] h-[120px] bg-[linear-gradient(transparent,theme(colors.brand.green-dark),theme(colors.brand.green-dark),theme(colors.brand.green-dark),transparent)] animate-[spin_4s_linear_infinite] origin-top-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
            <div class="absolute inset-[3px] bg-brand-cream group-hover:bg-white rounded-[calc(1rem-3px)] z-[1] transition-colors duration-500" />

            <div class="relative z-10">
              <span class="text-5xl font-black text-brand-green/10 leading-none select-none block mb-4">{{ fn.n }}</span>
              <h3 class="text-xl font-black text-brand-green-dark mb-3 mt-1">{{ fn.title }}</h3>
              <p class="text-sm font-medium text-brand-charcoal/60 leading-relaxed">{{ fn.desc }}</p>
              <div class="mt-6 pt-6 border-t border-brand-green/8 flex items-center text-brand-green font-bold text-sm group-hover:gap-2 transition-all">
                Selengkapnya
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="ml-1 opacity-0 group-hover:opacity-100 transition-all"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── NILAI UTAMA ── -->
    <section class="px-6 py-8">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-14">
          <p class="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-3">Nilai-Nilai Organisasi</p>
          <h2 class="text-4xl font-black text-brand-green-dark tracking-tight">Yang Kami Pegang Teguh</h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="val in values"
            :key="val.title"
            class="glass-card p-6 cursor-default group hover:-translate-y-1 transition-transform duration-300"
          >
            <div class="w-12 h-12 rounded-2xl bg-brand-green/5 flex items-center justify-center mb-5 text-brand-green group-hover:scale-110 transition-transform duration-500 shadow-inner" v-html="val.svg" />
            <h3 class="text-base font-black text-brand-green-dark mb-2">{{ val.title }}</h3>
            <p class="text-sm font-medium text-brand-charcoal/55 leading-relaxed">{{ val.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── TIMELINE ── -->
    <section class="px-2 py-8">
      <div class="mx-auto max-w-4xl">
        <div class="text-center mb-14">
          <p class="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-3">Perjalanan Kami</p>
          <h2 class="text-4xl font-black text-brand-green-dark tracking-tight">Tonggak Pencapaian</h2>
          <p class="mt-3 text-sm font-medium text-brand-charcoal/50">Jejak langkah perlindungan ekosistem perairan darat dari tahun ke tahun.</p>
        </div>

        <div class="relative">
          <!-- Vertical line -->
          <div class="absolute left-[88px] top-0 bottom-0 w-px bg-brand-green/15 hidden md:block" />

          <div class="flex flex-col gap-8">
            <div
              v-for="(m, i) in milestones"
              :key="m.year"
              class="relative flex gap-6 md:gap-10 items-start group"
            >
              <!-- Year badge -->
              <div class="flex-shrink-0 w-[72px] text-right hidden md:block">
                <span class="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 leading-none">{{ m.year }}</span>
              </div>

              <!-- Dot -->
              <div class="hidden md:flex flex-shrink-0 w-8 items-center justify-center pt-0.5">
                <div :class="['w-3 h-3 rounded-full ring-4 ring-brand-cream group-hover:scale-125 transition-transform duration-300 z-10', m.accent]" />
              </div>

              <!-- Card -->
              <div class="glass-card flex-1 p-6 cursor-default group-hover:-translate-y-0.5 transition-transform duration-300">
                <div class="flex items-center gap-3 mb-2">
                  <span class="md:hidden text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">{{ m.year }}</span>
                  <h3 class="text-base font-black text-brand-green-dark">{{ m.title }}</h3>
                </div>
                <p class="text-sm font-medium text-brand-charcoal/60 leading-relaxed">{{ m.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
