<script setup>
definePageMeta({ navigation: 'prodanau' })
useSeoMeta({ title: 'PRODANAU — Profil Danau Indonesia | PPEPD', description: 'Portal informasi danau: danau prioritas, peta sebaran, kebijakan, kelembagaan dan kontak Direktorat PPEPD.' })
const regions = ['Jawa', 'Kalimantan', 'Sumatera', 'Sulawesi', 'Papua', 'Bali & Nusa Tenggara', 'Maluku']
</script>

<template>
  <div>
    <nav aria-label="Breadcrumb" class="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-500"><NuxtLink to="/" class="inline-flex min-h-11 items-center text-klh-blue-600 hover:underline">Beranda PPEPD</NuxtLink><span aria-hidden="true">/</span><span aria-current="page">PRODANAU</span></nav>
    <section id="beranda" class="prodanau-section prodanau-hero relative overflow-hidden rounded-3xl text-white">
      <KlhLeafmark class="pointer-events-none absolute -right-12 -top-12 h-80 w-80 opacity-10" />
      <div class="relative grid items-center gap-8 p-6 md:p-12 lg:grid-cols-2">
        <div><p class="mb-4 text-sm font-semibold text-klh-green-200">PRODANAU · Profil Danau Indonesia</p><h1 class="prodanau-title font-display font-extrabold">Mengenal danau,<br>menjaga ekosistemnya.</h1><p class="mt-6 leading-relaxed text-klh-green-100">Jelajahi informasi danau Indonesia, upaya penyelamatan danau prioritas, dan peran kelembagaan dalam pengelolaan ekosistem perairan darat.</p><div class="mt-8 flex flex-wrap gap-3"><a href="#danau-prioritas" class="btn bg-surface text-klh-green-800 hover:bg-klh-green-100">Jelajahi danau</a><a href="#peta-sebaran" class="btn border border-klh-green-200 hover:bg-klh-green-700">Lihat peta sebaran</a></div></div>
        <img src="/images/ilu-danau.webp" alt="Ilustrasi danau dan lingkungan ekosistemnya" width="640" height="480" class="aspect-[4/3] w-full rounded-2xl object-cover">
      </div>
    </section>

    <section id="tentang" aria-labelledby="tentang-title" class="prodanau-section py-12 md:py-16"><p class="mb-2 text-sm font-semibold text-klh-green-700">Tentang portal</p><h2 id="tentang-title" class="text-2xl font-bold">Profil Danau Indonesia</h2><p class="mt-4 max-w-prose text-ink-500">PRODANAU menyajikan jalur informasi tentang profil danau, danau prioritas, sebaran, kebijakan, dan kelembagaan. Halaman ini menghubungkan layanan informasi danau yang tersedia di PPEPD.</p><NuxtLink to="/danau" class="btn btn-outline mt-6">Portal ekosistem danau →</NuxtLink></section>

    <section id="danau-prioritas" aria-labelledby="prioritas-title" class="prodanau-section rounded-2xl border border-line bg-surface p-6 md:p-8">
      <div class="mb-6"><p class="mb-2 text-sm font-semibold text-klh-green-700">Perlindungan ekosistem</p><h2 id="prioritas-title" class="text-2xl font-bold">Danau Prioritas</h2><p class="mt-4 max-w-prose text-ink-500">Telusuri data dan informasi danau melalui katalog PPEPD. Wilayah berikut mengikuti pengelompokan pada portal PRODANAU.</p></div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"><NuxtLink v-for="region in regions" :key="region" :to="{ path: '/data', query: { search: 'Danau ' + region } }" class="flex min-h-11 items-center gap-3 rounded-xl border border-line p-4 text-sm font-semibold hover:border-klh-green-600"><AppAvatar to="/danau/manajemen" :name="region" /><span>{{ region }}</span></NuxtLink></div>
      <p class="mt-6 text-sm text-ink-500">Daftar dan status danau prioritas dapat ditelusuri melalui katalog data dan regulasi PPEPD.</p>
    </section>

    <section id="peta-sebaran" aria-labelledby="peta-title" class="prodanau-section py-12 md:py-16"><div class="rounded-2xl border border-klh-blue-200 bg-klh-blue-50 p-6 md:p-8"><p class="mb-2 text-sm font-semibold text-klh-blue-700">Lokasi danau</p><h2 id="peta-title" class="text-2xl font-bold">Peta Sebaran</h2><p class="mt-4 max-w-prose text-ink-700">Akses peta profil danau pada layanan PPEPD. Layanan peta internal memerlukan login dan izin akses.</p><div class="mt-6 flex flex-wrap gap-3"><NuxtLink to="/danau/profil-danau" class="btn btn-blue">Buka peta profil danau →</NuxtLink><NuxtLink to="/data" class="btn btn-outline">Katalog data publik</NuxtLink></div></div></section>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
      <section id="kebijakan" aria-labelledby="kebijakan-title" class="prodanau-section klh-card p-6"><AppAvatar to="/admin/roles" name="Kebijakan" /><h2 id="kebijakan-title" class="mt-4 text-2xl font-bold">Kebijakan</h2><p class="mt-4 text-ink-500">Telusuri dasar kebijakan perlindungan dan pengelolaan ekosistem danau melalui katalog regulasi PPEPD.</p><NuxtLink to="/regulasi" class="btn btn-outline mt-6">Lihat regulasi →</NuxtLink></section>
      <section id="kelembagaan" aria-labelledby="kelembagaan-title" class="prodanau-section klh-card p-6"><AppAvatar to="/admin/system" name="Kelembagaan" /><h2 id="kelembagaan-title" class="mt-4 text-2xl font-bold">Kelembagaan</h2><p class="mt-4 text-ink-500">Bagian kelembagaan pada PRODANAU mencakup informasi tim koordinasi dan kelompok kerja pengelolaan danau. Dokumen kelembagaan belum terintegrasi ke halaman ini.</p><NuxtLink to="/hubungi" class="btn btn-outline mt-6">Hubungi PPEPD untuk informasi →</NuxtLink></section>
    </div>

    <section id="kontak" aria-labelledby="kontak-title" class="prodanau-section mt-12 rounded-2xl border border-line bg-surface p-6 md:mt-16 md:p-8"><h2 id="kontak-title" class="text-2xl font-bold">Kontak</h2><p class="mt-4 max-w-prose text-ink-500">Hubungi Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat untuk informasi dan layanan terkait danau.</p><NuxtLink to="/hubungi" class="btn btn-primary mt-6">Hubungi kami →</NuxtLink></section>
  </div>
</template>

<style scoped>
.prodanau-section { scroll-margin-top: calc(var(--klh-header-h) + 24px); }
.prodanau-hero { background: linear-gradient(135deg, rgb(var(--klh-g-700)), rgb(var(--klh-g-900))); }
.prodanau-title { font-size: clamp(2rem, 1.4rem + 2.6vw, 3rem); line-height: 1.18; }
</style>
