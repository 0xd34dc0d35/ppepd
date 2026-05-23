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
    <div class="relative overflow-hidden bg-brand-cream border-b border-brand-green/8">
      <!-- Radial orbs -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full"
          style="background: radial-gradient(circle, rgba(30,92,75,0.12) 0%, transparent 65%)"></div>
        <div class="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full"
          style="background: radial-gradient(circle, rgba(91,172,214,0.10) 0%, transparent 65%)"></div>
      </div>

      <div class="relative w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-10 pb-12">
        <!-- Eyebrow + breadcrumb -->
        <div class="flex items-center gap-2 mb-8 text-brand-charcoal/35 text-xs font-bold uppercase tracking-widest">
          <NuxtLink to="/" class="hover:text-brand-charcoal/60 transition-colors">Beranda</NuxtLink>
          <span class="text-brand-charcoal/20">/</span>
          <span>Ekosistem Danau</span>
        </div>

        <!-- Two-column layout -->
        <div class="flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-20">
          <!-- Left: title + CTA -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-4">
              <span class="h-px w-6 bg-brand-green"></span>
              <span class="text-xs font-bold text-brand-green uppercase tracking-widest">Direktorat PPEPD · KLH/BPLH</span>
            </div>
            <h1 class="text-5xl md:text-6xl xl:text-7xl font-black text-brand-green-dark leading-[0.92] tracking-tight">
              Ekosistem<br>Danau
            </h1>
            <p class="text-brand-charcoal/50 text-base mt-5 max-w-sm leading-relaxed">
              Portal data, pemantauan, dan pengelolaan ekosistem danau Indonesia — 840+ danau, 15 Prioritas Nasional.
            </p>
            <div class="flex items-center gap-3 mt-7">
              <NuxtLink to="/danau/dashboard"
                class="flex items-center gap-2 bg-brand-green-dark text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-brand-green transition-colors">
                Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </NuxtLink>
              <NuxtLink to="/danau/profil-danau"
                class="flex items-center gap-2 border border-brand-green/25 text-brand-green text-sm font-bold px-5 py-2.5 rounded-full hover:bg-brand-green/5 transition-colors">
                Profil Danau
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
