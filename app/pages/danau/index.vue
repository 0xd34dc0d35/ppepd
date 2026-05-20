<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Ekosistem Danau | PPEPD',
  description: 'Portal data, informasi, dan layanan perlindungan ekosistem danau Indonesia – Direktorat PPEPD KLH/BPLH.',
})

const menu = [
  {
    to: '/danau/dashboard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
    label: 'Dashboard',
    desc: 'Pantau status ekosistem, kualitas air, tutupan lahan, dan ancaman prioritas seluruh danau Indonesia secara real-time.',
    tag: 'Data & Peta',
    color: 'brand-green',
  },
  {
    to: '/danau/profil-danau',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12c1.5-3 3-5 4.5-5s3 3.5 4.5 3.5S15 8 16.5 8 19.5 9 21 12"/><path stroke-linecap="round" stroke-linejoin="round" d="M3 18c1.5-3 3-5 4.5-5s3 3.5 4.5 3.5S15 14 16.5 14 19.5 15 21 18"/><circle cx="12" cy="5" r="1.5"/></svg>`,
    label: 'Profil Danau',
    desc: 'Jelajahi profil lengkap 15 Danau Prioritas Nasional mencakup karakteristik, kondisi ekosistem, dan dokumen pengelolaan.',
    tag: 'Profil & Dokumen',
    color: 'brand-blue',
  },
]

const stats = [
  { value: '840+', label: 'Danau Tercatat', sub: 'seluruh Indonesia' },
  { value: '15',   label: 'Danau Prioritas', sub: 'nasional' },
  { value: '5,7 jt', label: 'Hektar', sub: 'total area danau' },
  { value: '52,4', label: 'IKA Rata-rata', sub: 'indeks kualitas air' },
]
</script>

<template>
  <div class="min-h-screen bg-brand-cream/40">

    <!-- Hero -->
    <div class="relative overflow-hidden bg-brand-green-dark">
      <!-- Decorative blobs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-30%] left-[-8%] w-[50%] h-[250%] rounded-full bg-white/5 blur-[90px]"></div>
        <div class="absolute bottom-[-20%] right-[-5%] w-[35%] h-[150%] rounded-full bg-brand-blue/10 blur-[80px]"></div>
      </div>

      <div class="relative max-w-5xl mx-auto px-8 pt-16 pb-14">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 mb-6 text-white/40 text-xs font-bold uppercase tracking-widest">
          <NuxtLink to="/" class="hover:text-white/70 transition-colors">Beranda</NuxtLink>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          <span class="text-white/60">Ekosistem Danau</span>
        </div>

        <!-- Title -->
        <div class="flex items-start gap-5">
          <div class="shrink-0 w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12c1.5-3 3-5 4.5-5s3 3.5 4.5 3.5S15 8 16.5 8 19.5 9 21 12"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 18c1.5-3 3-5 4.5-5s3 3.5 4.5 3.5S15 14 16.5 14 19.5 15 21 18"/>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl md:text-4xl font-black text-white leading-tight">Ekosistem Danau</h1>
            <p class="text-white/50 text-sm mt-2 max-w-xl leading-relaxed">
              Portal data, pemantauan, dan pengelolaan ekosistem danau Indonesia. Direktorat PPEPD, Kementerian Lingkungan Hidup/BPLH.
            </p>
          </div>
        </div>

        <!-- Stats strip -->
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
          class="group bg-white border border-brand-green/10 rounded-2xl p-6 flex items-start gap-5 hover:border-brand-green/30 hover:shadow-lg hover:shadow-brand-green/5 transition-all duration-300"
        >
          <!-- Icon -->
          <div class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            :class="m.color === 'brand-blue' ? 'bg-brand-blue/10 text-brand-blue' : 'bg-brand-green/10 text-brand-green'">
            <span class="w-6 h-6" v-html="m.icon"></span>
          </div>

          <!-- Text -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1.5">
              <h2 class="text-base font-black text-brand-charcoal group-hover:text-brand-green-dark transition-colors">{{ m.label }}</h2>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                :class="m.color === 'brand-blue' ? 'border-brand-blue/20 text-brand-blue/60 bg-brand-blue/5' : 'border-brand-green/20 text-brand-green/60 bg-brand-green/5'">
                {{ m.tag }}
              </span>
            </div>
            <p class="text-sm text-brand-charcoal/55 leading-relaxed">{{ m.desc }}</p>
          </div>

          <!-- Arrow -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-brand-charcoal/20 group-hover:text-brand-green group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- About section -->
      <div class="mt-10 bg-white border border-brand-green/10 rounded-2xl p-8">
        <h2 class="text-xs font-black text-brand-charcoal/35 uppercase tracking-widest mb-4">Tentang Ekosistem Danau</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-brand-charcoal/65 leading-relaxed">
          <div>
            <p class="font-bold text-brand-charcoal/80 mb-2">Pengelolaan Berkelanjutan</p>
            <p>Direktorat PPEPD melaksanakan perlindungan dan pengelolaan ekosistem danau melalui pemantauan kondisi, penyusunan kebijakan, dan koordinasi lintas sektor untuk menjaga fungsi ekologis danau secara berkelanjutan.</p>
          </div>
          <div>
            <p class="font-bold text-brand-charcoal/80 mb-2">15 Danau Prioritas Nasional</p>
            <p>Indonesia menetapkan 15 Danau Prioritas Nasional (DPN) yang memerlukan penanganan khusus akibat tekanan ekologis tinggi. Setiap DPN dilengkapi dokumen Rencana Perlindungan dan Pengelolaan Ekosistem (RPPE).</p>
          </div>
          <div>
            <p class="font-bold text-brand-charcoal/80 mb-2">Data dan Pemantauan</p>
            <p>Pemantauan dilakukan secara berkala mencakup parameter kualitas air, luas tutupan vegetasi, kondisi Daerah Tangkapan Air (DTA), serta sebaran dan intensitas gangguan ekosistem danau.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
