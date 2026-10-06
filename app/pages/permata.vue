<script setup>
definePageMeta({ navigation: 'permata' })
useSeoMeta({
  title: 'PERMATA — Perlindungan Mata Air | PPEPD',
  description: 'Informasi perlindungan mata air, artikel, Desa Peduli Sumber Air, kebijakan, dan sebaran mata air dalam portal PERMATA.',
})

const articles = [
  { title: 'Pengertian Mata Air', description: 'Mengenal mata air sebagai sumber air alami dan bagian dari ekosistem perairan darat.' },
  { title: 'Proses Pembentukan Mata Air', description: 'Memahami bagaimana air dari dalam tanah muncul ke permukaan.' },
  { title: 'Pengertian Daerah Resapan Air', description: 'Mengenal peran daerah resapan dalam menjaga keberlanjutan sumber air.' },
]
</script>

<template>
  <div>
    <nav aria-label="Breadcrumb" class="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-500">
      <NuxtLink to="/" class="inline-flex min-h-11 items-center hover:text-klh-green-700">Beranda PPEPD</NuxtLink>
      <span aria-hidden="true">/</span><span aria-current="page" class="font-semibold text-klh-green-700">PERMATA</span>
    </nav>

    <section id="beranda" class="permata-hero permata-section relative overflow-hidden rounded-3xl bg-gradient-to-br from-klh-green-700 to-klh-green-900 text-white">
      <KlhLeafmark class="pointer-events-none absolute -right-12 -top-12 h-80 w-80 text-white opacity-10" />
      <div class="relative grid gap-8 p-6 md:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p class="mb-4 text-sm font-semibold text-klh-green-200">PERMATA · Perlindungan Mata Air</p>
          <h1 class="font-display text-[clamp(2rem,1.4rem+2.6vw,3rem)] font-extrabold leading-[1.18]">Menjaga mata air,<br>merawat kehidupan.</h1>
          <p class="mt-6 max-w-prose text-base leading-relaxed text-klh-green-100">Kenali sumber air kita, pahami upaya perlindungannya, dan temukan peran masyarakat dalam menjaga ekosistem mata air.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="#sebaran-mata-air" class="btn bg-surface text-klh-green-800 hover:bg-klh-green-100">Jelajahi sebaran mata air</a>
            <a href="#desa-peduli-sumber-air" class="btn border border-klh-green-200 text-white hover:bg-klh-green-700">Kenali program DPSA</a>
          </div>
        </div>
        <figure class="overflow-hidden rounded-2xl border border-klh-green-500/30 bg-klh-green-800">
          <img src="/images/ilu-mataair.webp" alt="Ilustrasi ekosistem mata air dan lingkungan sekitarnya" width="640" height="480" class="aspect-[4/3] w-full object-cover">
          <figcaption class="px-5 py-4 text-sm text-klh-green-100">Perlindungan dan pengelolaan ekosistem perairan darat</figcaption>
        </figure>
      </div>
    </section>


    <section id="artikel" aria-labelledby="artikel-title" class="permata-section py-12 md:py-16">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
        <div><p class="mb-2 text-sm font-semibold text-klh-green-700">Pengetahuan mata air</p><h2 id="artikel-title" class="text-2xl font-bold">Artikel</h2></div>
        <a href="/edukasi" class="btn btn-outline">Semua materi edukasi →</a>
      </div>
      <div class="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        <article v-for="(article, index) in articles" :key="article.title" class="klh-card flex flex-col p-6">
          <span class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-klh-green-100 font-mono text-klh-green-700" aria-hidden="true">0{{ index + 1 }}</span>
          <h3 class="text-xl font-bold">{{ article.title }}</h3>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-ink-500">{{ article.description }}</p>
          <a href="/edukasi" class="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-klh-blue-600 hover:underline" :aria-label="`Jelajahi materi edukasi tentang ${article.title}`">Jelajahi materi edukasi →</a>
        </article>
      </div>
    </section>

    <section id="desa-peduli-sumber-air" aria-labelledby="desa-title" class="permata-section rounded-2xl border border-line bg-surface p-6 md:p-12">
      <div class="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <span class="inline-flex rounded-full bg-klh-orange-100 px-3 py-1 text-xs font-semibold text-klh-orange-800">Partisipasi masyarakat</span>
          <h2 id="desa-title" class="mt-4 text-2xl font-bold">Desa Peduli Sumber Air</h2>
          <p class="mt-4 leading-relaxed text-ink-500">Mengenal keterlibatan desa dan masyarakat dalam menjaga sumber air. Temukan informasi dan kegiatan Desa Peduli Sumber Air melalui portal mata air PPEPD.</p>
          <a href="/mataair#dpsa" class="btn btn-primary mt-6">Jelajahi Desa Peduli Sumber Air →</a>
        </div>
        <div class="rounded-2xl bg-surface-2 p-6">
          <p class="text-lg font-semibold text-klh-green-800">Perlindungan dimulai dari lingkungan terdekat.</p>
          <p class="mt-4 text-sm leading-relaxed text-ink-700">Mata air, daerah resapan, dan masyarakat di sekitarnya saling terhubung. Menjaga lingkungan sumber air membantu mempertahankan manfaatnya bagi kehidupan sehari-hari.</p>
          <NuxtLink to="/mataair" class="mt-4 inline-flex min-h-11 items-center font-semibold text-klh-blue-600 hover:underline">Lihat portal ekosistem mata air →</NuxtLink>
        </div>
      </div>
    </section>

    <section id="kebijakan" aria-labelledby="kebijakan-title" class="permata-section py-12 md:py-16">
      <div class="klh-card flex flex-col justify-between gap-6 p-6 md:flex-row md:items-center md:p-8">
        <div class="max-w-prose"><p class="mb-2 text-sm font-semibold text-klh-green-700">Landasan perlindungan</p><h2 id="kebijakan-title" class="text-2xl font-bold">Kebijakan</h2><p class="mt-4 text-ink-500">Akses kebijakan perlindungan mata air melalui katalog regulasi Direktorat PPEPD.</p></div>
        <div class="flex shrink-0 flex-col gap-3"><NuxtLink to="/regulasi" class="btn btn-outline">Katalog regulasi PPEPD</NuxtLink></div>
      </div>
    </section>

    <section id="sebaran-mata-air" aria-labelledby="sebaran-title" class="permata-section rounded-3xl border border-klh-blue-200 bg-klh-blue-50 p-6 md:p-12">
      <div class="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div><p class="mb-2 text-sm font-semibold text-klh-blue-700">Eksplorasi sumber air</p><h2 id="sebaran-title" class="text-2xl font-bold">Sebaran Mata Air</h2><p class="mt-4 leading-relaxed text-ink-700">Temukan informasi ekosistem mata air melalui katalog data PPEPD. Peta sebaran publik belum tersedia pada halaman ini.</p><NuxtLink to="/data" class="btn btn-blue mt-6">Jelajahi katalog data →</NuxtLink></div>
        <div class="rounded-2xl border border-klh-blue-200 bg-surface p-6">
          <svg aria-hidden="true" class="mb-4 h-12 w-12 text-klh-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/></svg>
          <h3 class="text-xl font-bold">Temukan lokasi mata air</h3><p class="mt-3 text-sm leading-relaxed text-ink-500">Bagian ini akan menampilkan peta setelah data lokasi mata air terintegrasi. Untuk saat ini, informasi yang tersedia dapat ditelusuri melalui katalog data PPEPD.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.permata-section { scroll-margin-top: calc(var(--klh-header-h) + 24px); }
.permata-hero { background: linear-gradient(135deg, rgb(var(--klh-g-700)), rgb(var(--klh-g-900))); }
.permata-hero h1 { font-size: clamp(2rem, 1.4rem + 2.6vw, 3rem); font-weight: 800; line-height: 1.18; }
</style>
