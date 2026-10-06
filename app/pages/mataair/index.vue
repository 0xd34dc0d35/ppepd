<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Ekosistem Mata Air | PPEPD',
  description: 'Portal data, informasi, dan layanan perlindungan ekosistem mata air Indonesia – Direktorat PPEPD KLH/BPLH.',
})

const menu = [
  {
    to: '/mataair/dashboard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
    label: 'Dashboard',
    desc: 'Pantau status ekosistem, debit air, tutupan lahan, dan ancaman prioritas titik mata air Indonesia secara real-time.',
    tag: 'Data & Peta',
    color: 'teal',
  },
  {
    to: '/mataair/profil-mataair',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2C8.5 2 6 5 6 8c0 4 6 12 6 12s6-8 6-12c0-3-2.5-6-6-6z"/><circle cx="12" cy="8" r="2" stroke-width="1.5"/></svg>`,
    label: 'Profil Mata Air',
    desc: 'Jelajahi profil lengkap mata air prioritas nasional mencakup karakteristik, hasil penilaian kesehatan, dan dokumen DPSA.',
    tag: 'Profil & Dokumen',
    color: 'brand-blue',
  },
]

const stats = [
  { value: '4.200+', label: 'Mata Air Tercatat', sub: 'seluruh Indonesia' },
  { value: '20',     label: 'Mata Air Prioritas', sub: 'nasional' },
  { value: '38,6',   label: 'l/dt Debit Rerata', sub: 'indeks debit' },
  { value: '44%',    label: 'Kawasan Terlindungi', sub: 'dari total titik' },
]

const dpsaStats = [
  { value: '184',   label: 'Desa Terdaftar' },
  { value: '18',    label: 'Provinsi' },
  { value: '920+',  label: 'Titik Terlindungi' },
  { value: '3.800+', label: 'Anggota Aktif' },
]

const dpsaDesa = [
  { nama: 'Umbulharjo',     kab: 'Kab. Sleman',       prov: 'D.I. Yogyakarta',  titik: '3 titik',  status: 'Aktif'      },
  { nama: 'Ngrancah',       kab: 'Kab. Kulon Progo',  prov: 'D.I. Yogyakarta',  titik: '2 titik',  status: 'Aktif'      },
  { nama: 'Karanganyar',    kab: 'Kab. Purbalingga',  prov: 'Jawa Tengah',      titik: '4 titik',  status: 'Aktif'      },
  { nama: 'Sumber Brantas', kab: 'Kota Batu',         prov: 'Jawa Timur',       titik: '1 titik',  status: 'Aktif'      },
  { nama: 'Sidomulyo',      kab: 'Kab. Pasuruan',     prov: 'Jawa Timur',       titik: '3 titik',  status: 'Pembinaan'  },
  { nama: 'Wanayasa',       kab: 'Kab. Purwakarta',   prov: 'Jawa Barat',       titik: '2 titik',  status: 'Pembinaan'  },
  { nama: 'Girimulyo',      kab: 'Kab. Magelang',     prov: 'Jawa Tengah',      titik: '5 titik',  status: 'Aktif'      },
  { nama: 'Toya Anyar',     kab: 'Kab. Bangli',       prov: 'Bali',             titik: '2 titik',  status: 'Aktif'      },
]
</script>

<template>
  <div class="min-h-screen bg-surface-bg/40">

    <!-- Hero -->
    <div class="relative overflow-hidden bg-surface-bg border-b border-line">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full"
          style="background: radial-gradient(circle, rgba(15,118,110,0.11) 0%, transparent 65%)"></div>
        <div class="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full"
          style="background: radial-gradient(circle, rgba(45,212,191,0.09) 0%, transparent 65%)"></div>
      </div>

      <div class="relative w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-10 pb-12">
        <div class="flex items-center gap-2 mb-8 text-ink-500 text-xs font-bold uppercase tracking-widest">
          <NuxtLink to="/" class="hover:text-ink-500 transition-colors">Beranda</NuxtLink>
          <span class="text-ink-400">/</span>
          <span>Ekosistem Mata Air</span>
        </div>

        <div class="flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-20">
          <!-- Left -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-4">
              <span class="h-px w-6" style="background: #07887D"></span>
              <span class="text-xs font-bold uppercase tracking-widest" style="color: #07887D">Direktorat PPEPD · KLH/BPLH</span>
            </div>
            <h1 class="text-5xl md:text-6xl xl:text-7xl font-bold text-klh-green-800 leading-[0.92] tracking-tight">
              Ekosistem<br>Mata Air
            </h1>
            <p class="text-ink-500 text-base mt-5 max-w-sm leading-relaxed">
              Portal data, pemantauan, dan pengelolaan mata air Indonesia — 4.200+ titik, 20 Prioritas Nasional.
            </p>
            <div class="flex items-center gap-3 mt-7">
              <NuxtLink to="/mataair/dashboard"
                class="flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors"
                style="background: #005952">
                Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </NuxtLink>
              <NuxtLink to="/mataair/profil-mataair"
                class="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full border transition-colors hover:opacity-80"
                style="border-color: rgba(15,118,110,0.25); color: #07887D">
                Profil Mata Air
              </NuxtLink>
            </div>
          </div>

          <!-- Right: stats -->
          <div class="shrink-0 w-full lg:w-auto">
            <div class="grid grid-cols-2 gap-3 lg:min-w-[300px]">
              <div v-for="s in stats" :key="s.label"
                class="bg-white border border-line rounded-2xl px-5 py-4 shadow-klh-1 ">
                <p class="text-klh-green-800 text-2xl font-bold leading-none tabular-nums">{{ s.value }}</p>
                <p class="text-ink-500 text-[11px] font-bold mt-2 leading-none">{{ s.label }}</p>
                <p class="text-ink-500 text-[11px] mt-1">{{ s.sub }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu cards -->
    <div class="max-w-5xl mx-auto px-8 py-12">
      <p class="text-xs font-bold text-ink-500 uppercase tracking-widest mb-6">Navigasi</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <NuxtLink
          v-for="m in menu" :key="m.to"
          :to="m.to"
          class="group bg-white border border-line rounded-2xl p-6 flex items-start gap-5 hover:border-klh-green-400/40 hover:shadow-klh-3 hover:shadow-klh-green-500/5 transition-all duration-300"
        >
          <div class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            :class="m.color === 'brand-blue' ? 'bg-klh-blue-500/10 text-klh-blue-600' : 'bg-klh-green-500/10 text-klh-green-600'">
            <span class="w-6 h-6" v-html="m.icon"></span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1.5">
              <h2 class="text-base font-bold text-ink-900 group-hover:text-klh-green-700 transition-colors">{{ m.label }}</h2>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-full border"
                :class="m.color === 'brand-blue' ? 'border-klh-blue-200 text-klh-blue-600/60 bg-klh-blue-500/5' : 'border-klh-green-400/30 text-klh-green-600/70 bg-klh-green-50'">
                {{ m.tag }}
              </span>
            </div>
            <p class="text-sm text-ink-500 leading-relaxed">{{ m.desc }}</p>
          </div>

          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-ink-400 group-hover:text-klh-green-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- ─── DPSA Section ─────────────────────────────────────── -->
      <div id="dpsa" class="mt-10" style="scroll-margin-top: calc(var(--klh-header-h) + 24px)">
        <div class="flex items-end justify-between mb-6">
          <div>
            <p class="text-xs font-bold text-ink-500 uppercase tracking-widest mb-1.5">Program Unggulan</p>
            <h2 class="text-xl font-bold leading-tight" style="color: #07887D">Desa Peduli Sumber Air</h2>
            <p class="text-sm text-ink-500 mt-1 max-w-lg">Program pemberdayaan masyarakat desa dalam perlindungan dan pengelolaan mata air secara partisipatif dan berkelanjutan.</p>
          </div>
          <span class="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full border uppercase tracking-widest"
            style="background: rgba(15,118,110,0.08); color: #07887D; border-color: rgba(15,118,110,0.2)">DPSA</span>
        </div>

        <!-- Stats strip -->
        <div class="grid grid-cols-4 gap-3 mb-6">
          <div v-for="s in dpsaStats" :key="s.label"
            class="rounded-xl px-5 py-4 flex flex-col gap-1" style="background: #005952">
            <p class="text-white text-2xl font-bold leading-none tabular-nums">{{ s.value }}</p>
            <p class="text-white/55 text-[11px] font-bold">{{ s.label }}</p>
          </div>
        </div>

        <!-- Desa table -->
        <div class="bg-white border border-line rounded-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-line">
            <p class="text-xs font-bold text-ink-500 uppercase tracking-widest">Desa Terdaftar — Sorotan</p>
            <div class="flex items-center gap-4 text-[11px] font-bold">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full" style="background: #07887D"></span>
                <span class="text-ink-500">Aktif</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-klh-orange-500"></span>
                <span class="text-ink-500">Pembinaan</span>
              </div>
            </div>
          </div>
          <div class="divide-y divide-line">
            <div v-for="d in dpsaDesa" :key="d.nama"
              class="flex items-center px-6 py-3.5 hover:bg-klh-green-50/40 transition-colors gap-4">
              <span class="shrink-0 w-2 h-2 rounded-full"
                :style="{ background: d.status === 'Aktif' ? '#07887D' : '#F97910' }"></span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-ink-900 leading-none">{{ d.nama }}</p>
                <p class="text-[11px] text-ink-500 mt-0.5">{{ d.kab }} · {{ d.prov }}</p>
              </div>
              <div class="shrink-0 text-right">
                <p class="text-[11px] font-bold" style="color: #07887D">{{ d.titik }}</p>
                <p class="text-[11px] text-ink-400">mata air</p>
              </div>
              <span class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full"
                :style="d.status === 'Aktif'
                  ? { background: '#DCF3E7', color: '#0E7A4E' }
                  : { background: '#F9E4D2', color: '#AE5104' }">
                {{ d.status }}
              </span>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-line bg-surface-bg/40 flex items-center justify-between">
            <p class="text-[11px] text-ink-500">Menampilkan 8 dari 184 desa terdaftar · Diperbarui Mei 2026</p>
            <NuxtLink to="/berita-events" class="flex items-center gap-1.5 text-xs font-bold transition-colors hover:opacity-80" style="color: #07887D">
              Lihat berita program
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Program description cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div class="bg-white border border-line rounded-2xl p-5">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style="background: rgba(15,118,110,0.1)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" style="color: #07887D" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
            </div>
            <p class="text-sm font-bold text-ink-900 mb-1">Partisipasi Komunitas</p>
            <p class="text-xs text-ink-500 leading-relaxed">Masyarakat desa dilatih untuk memantau kondisi mata air, menjaga zona inti dan penyangga, serta melaporkan perubahan debit dan kualitas air secara berkala.</p>
          </div>
          <div class="bg-white border border-line rounded-2xl p-5">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style="background: rgba(15,118,110,0.1)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" style="color: #07887D" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <p class="text-sm font-bold text-ink-900 mb-1">Perlindungan Berbasis Desa</p>
            <p class="text-xs text-ink-500 leading-relaxed">Desa menyusun Peraturan Desa (Perdes) dan rencana aksi perlindungan mata air yang diintegrasikan dalam perencanaan pembangunan desa jangka menengah.</p>
          </div>
          <div class="bg-white border border-line rounded-2xl p-5">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style="background: rgba(15,118,110,0.1)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" style="color: #07887D" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            </div>
            <p class="text-sm font-bold text-ink-900 mb-1">Pendampingan Teknis</p>
            <p class="text-xs text-ink-500 leading-relaxed">Direktorat PPEPD memberikan pendampingan teknis, pelatihan pemantauan, dan fasilitasi akses ke program insentif bagi desa yang aktif melindungi sumber air.</p>
          </div>
        </div>
      </div>

      <div class="mt-10 bg-white border border-line rounded-2xl p-8">
        <h2 class="text-xs font-bold text-ink-500 uppercase tracking-widest mb-4">Tentang Ekosistem Mata Air</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-ink-700 leading-relaxed">
          <div>
            <p class="font-bold text-ink-700 mb-2">Sumber Air Strategis</p>
            <p>Mata air merupakan sumber air yang muncul secara alami dari dalam tanah dan menjadi tulang punggung kebutuhan air bersih bagi jutaan masyarakat, sistem irigasi, serta ekosistem perairan di sekitarnya.</p>
          </div>
          <div>
            <p class="font-bold text-ink-700 mb-2">Pemantauan dan Penilaian</p>
            <p>Direktorat PPEPD melaksanakan penilaian kesehatan mata air secara berkala mencakup debit, kualitas air fisik-kimia, kondisi zona inti dan penyangga, serta tekanan dari aktivitas manusia di sekitarnya.</p>
          </div>
          <div>
            <p class="font-bold text-ink-700 mb-2">Desa Peduli Sumber Air</p>
            <p>Program Desa Peduli Sumber Air (DPSA) mendorong keterlibatan masyarakat dan pemerintah desa dalam upaya perlindungan mata air berbasis komunitas yang berkelanjutan di seluruh Indonesia.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
