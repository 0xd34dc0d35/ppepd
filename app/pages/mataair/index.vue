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
  <div class="min-h-screen bg-brand-cream/40">

    <!-- Hero -->
    <div class="relative overflow-hidden" style="background: linear-gradient(135deg, #0f766e 0%, #0d5c55 60%, #0a4a45 100%)">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-30%] left-[-8%] w-[50%] h-[250%] rounded-full bg-white/5 blur-[90px]"></div>
        <div class="absolute bottom-[-20%] right-[-5%] w-[35%] h-[150%] rounded-full bg-teal-300/10 blur-[80px]"></div>
      </div>

      <div class="relative max-w-5xl mx-auto px-8 pt-16 pb-14">
        <div class="flex items-center gap-2 mb-6 text-white/40 text-xs font-bold uppercase tracking-widest">
          <NuxtLink to="/" class="hover:text-white/70 transition-colors">Beranda</NuxtLink>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          <span class="text-white/60">Ekosistem Mata Air</span>
        </div>

        <div class="flex items-start gap-5">
          <div class="shrink-0 w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2C8.5 2 6 5 6 8c0 4 6 12 6 12s6-8 6-12c0-3-2.5-6-6-6z"/>
              <circle cx="12" cy="8" r="2" stroke-width="1.5"/>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl md:text-4xl font-black text-white leading-tight">Ekosistem Mata Air</h1>
            <p class="text-white/50 text-sm mt-2 max-w-xl leading-relaxed">
              Portal data, pemantauan, dan pengelolaan ekosistem mata air Indonesia. Direktorat PPEPD, Kementerian Lingkungan Hidup/BPLH.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 mt-10">
          <div v-for="s in stats" :key="s.label"
            class="bg-white/8 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
            <p class="text-white text-xl font-black leading-none tabular-nums">{{ s.value }}</p>
            <p class="text-white/60 text-[11px] font-bold mt-1 leading-none">{{ s.label }}</p>
            <p class="text-white/30 text-[10px] mt-0.5">{{ s.sub }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu cards -->
    <div class="max-w-5xl mx-auto px-8 py-12">
      <p class="text-xs font-black text-brand-charcoal/35 uppercase tracking-widest mb-6">Navigasi</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <NuxtLink
          v-for="m in menu" :key="m.to"
          :to="m.to"
          class="group bg-white border border-brand-green/10 rounded-2xl p-6 flex items-start gap-5 hover:border-teal-400/40 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300"
        >
          <div class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            :class="m.color === 'brand-blue' ? 'bg-brand-blue/10 text-brand-blue' : 'bg-teal-500/10 text-teal-600'">
            <span class="w-6 h-6" v-html="m.icon"></span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1.5">
              <h2 class="text-base font-black text-brand-charcoal group-hover:text-teal-700 transition-colors">{{ m.label }}</h2>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                :class="m.color === 'brand-blue' ? 'border-brand-blue/20 text-brand-blue/60 bg-brand-blue/5' : 'border-teal-400/30 text-teal-600/70 bg-teal-50'">
                {{ m.tag }}
              </span>
            </div>
            <p class="text-sm text-brand-charcoal/55 leading-relaxed">{{ m.desc }}</p>
          </div>

          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-brand-charcoal/20 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- ─── DPSA Section ─────────────────────────────────────── -->
      <div class="mt-10">
        <div class="flex items-end justify-between mb-6">
          <div>
            <p class="text-xs font-black text-brand-charcoal/35 uppercase tracking-widest mb-1.5">Program Unggulan</p>
            <h2 class="text-xl font-black leading-tight" style="color: #0f766e">Desa Peduli Sumber Air</h2>
            <p class="text-sm text-brand-charcoal/55 mt-1 max-w-lg">Program pemberdayaan masyarakat desa dalam perlindungan dan pengelolaan mata air secara partisipatif dan berkelanjutan.</p>
          </div>
          <span class="shrink-0 text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-widest"
            style="background: rgba(15,118,110,0.08); color: #0f766e; border-color: rgba(15,118,110,0.2)">DPSA</span>
        </div>

        <!-- Stats strip -->
        <div class="grid grid-cols-4 gap-3 mb-6">
          <div v-for="s in dpsaStats" :key="s.label"
            class="rounded-xl px-5 py-4 flex flex-col gap-1" style="background: #0d5c55">
            <p class="text-white text-2xl font-black leading-none tabular-nums">{{ s.value }}</p>
            <p class="text-white/55 text-[11px] font-bold">{{ s.label }}</p>
          </div>
        </div>

        <!-- Desa table -->
        <div class="bg-white border border-brand-green/10 rounded-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-brand-green/8">
            <p class="text-xs font-black text-brand-charcoal/40 uppercase tracking-widest">Desa Terdaftar — Sorotan</p>
            <div class="flex items-center gap-4 text-[10px] font-bold">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full" style="background: #0f766e"></span>
                <span class="text-brand-charcoal/40">Aktif</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-brand-orange"></span>
                <span class="text-brand-charcoal/40">Pembinaan</span>
              </div>
            </div>
          </div>
          <div class="divide-y divide-brand-green/5">
            <div v-for="d in dpsaDesa" :key="d.nama"
              class="flex items-center px-6 py-3.5 hover:bg-teal-50/40 transition-colors gap-4">
              <span class="shrink-0 w-2 h-2 rounded-full"
                :style="{ background: d.status === 'Aktif' ? '#0f766e' : '#D97B3A' }"></span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-brand-charcoal leading-none">{{ d.nama }}</p>
                <p class="text-[11px] text-brand-charcoal/40 mt-0.5">{{ d.kab }} · {{ d.prov }}</p>
              </div>
              <div class="shrink-0 text-right">
                <p class="text-[11px] font-bold" style="color: #0f766e">{{ d.titik }}</p>
                <p class="text-[10px] text-brand-charcoal/30">mata air</p>
              </div>
              <span class="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full"
                :style="d.status === 'Aktif'
                  ? { background: 'rgba(15,118,110,0.1)', color: '#0f766e' }
                  : { background: '#D97B3A18', color: '#D97B3A' }">
                {{ d.status }}
              </span>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-brand-green/8 bg-brand-cream/40 flex items-center justify-between">
            <p class="text-[11px] text-brand-charcoal/35">Menampilkan 8 dari 184 desa terdaftar · Diperbarui Mei 2026</p>
            <NuxtLink to="/berita-events" class="flex items-center gap-1.5 text-xs font-bold transition-colors hover:opacity-80" style="color: #0f766e">
              Lihat berita program
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Program description cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div class="bg-white border border-brand-green/10 rounded-2xl p-5">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style="background: rgba(15,118,110,0.1)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" style="color: #0f766e" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
            </div>
            <p class="text-sm font-black text-brand-charcoal mb-1">Partisipasi Komunitas</p>
            <p class="text-xs text-brand-charcoal/55 leading-relaxed">Masyarakat desa dilatih untuk memantau kondisi mata air, menjaga zona inti dan penyangga, serta melaporkan perubahan debit dan kualitas air secara berkala.</p>
          </div>
          <div class="bg-white border border-brand-green/10 rounded-2xl p-5">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style="background: rgba(15,118,110,0.1)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" style="color: #0f766e" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <p class="text-sm font-black text-brand-charcoal mb-1">Perlindungan Berbasis Desa</p>
            <p class="text-xs text-brand-charcoal/55 leading-relaxed">Desa menyusun Peraturan Desa (Perdes) dan rencana aksi perlindungan mata air yang diintegrasikan dalam perencanaan pembangunan desa jangka menengah.</p>
          </div>
          <div class="bg-white border border-brand-green/10 rounded-2xl p-5">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style="background: rgba(15,118,110,0.1)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" style="color: #0f766e" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            </div>
            <p class="text-sm font-black text-brand-charcoal mb-1">Pendampingan Teknis</p>
            <p class="text-xs text-brand-charcoal/55 leading-relaxed">Direktorat PPEPD memberikan pendampingan teknis, pelatihan pemantauan, dan fasilitasi akses ke program insentif bagi desa yang aktif melindungi sumber air.</p>
          </div>
        </div>
      </div>

      <div class="mt-10 bg-white border border-brand-green/10 rounded-2xl p-8">
        <h2 class="text-xs font-black text-brand-charcoal/35 uppercase tracking-widest mb-4">Tentang Ekosistem Mata Air</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-brand-charcoal/65 leading-relaxed">
          <div>
            <p class="font-bold text-brand-charcoal/80 mb-2">Sumber Air Strategis</p>
            <p>Mata air merupakan sumber air yang muncul secara alami dari dalam tanah dan menjadi tulang punggung kebutuhan air bersih bagi jutaan masyarakat, sistem irigasi, serta ekosistem perairan di sekitarnya.</p>
          </div>
          <div>
            <p class="font-bold text-brand-charcoal/80 mb-2">Pemantauan dan Penilaian</p>
            <p>Direktorat PPEPD melaksanakan penilaian kesehatan mata air secara berkala mencakup debit, kualitas air fisik-kimia, kondisi zona inti dan penyangga, serta tekanan dari aktivitas manusia di sekitarnya.</p>
          </div>
          <div>
            <p class="font-bold text-brand-charcoal/80 mb-2">Desa Peduli Sumber Air</p>
            <p>Program Desa Peduli Sumber Air (DPSA) mendorong keterlibatan masyarakat dan pemerintah desa dalam upaya perlindungan mata air berbasis komunitas yang berkelanjutan di seluruh Indonesia.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
