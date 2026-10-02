<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const pathSegments = computed(() => route.path.split('/').filter(Boolean))

const pageTitle = computed(() => {
  const lastSegment = pathSegments.value[pathSegments.value.length - 1]
  return page.value?.title || lastSegment?.replace(/-/g, ' ') || 'Halaman'
})

const pageDescription = computed(() => {
  return page.value?.description || 'Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat, Kementerian Lingkungan Hidup/Badan Perlindungan Lingkungan Hidup.'
})

const sectionLabel = computed(() => {
  return pathSegments.value.length > 1 ? pathSegments.value[0].replace(/-/g, ' ') : 'Informasi'
})

useSeoMeta({
  title: () => `${pageTitle.value} - PPEPD`,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
})
</script>

<template>
  <div class="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-12 w-screen overflow-hidden px-6 pb-20 pt-16">
    <div class="absolute inset-x-0 top-0 -z-10 h-[540px] bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,89,82,0.16),transparent_42%),radial-gradient(ellipse_at_86%_18%,rgba(20,125,239,0.16),transparent_38%),linear-gradient(180deg,rgba(245,242,236,0.92),rgba(245,242,236,0))]"></div>

    <div v-if="page" class="mx-auto max-w-6xl">
      <nav class="mb-8 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-500">
        <NuxtLink to="/" class="transition-colors hover:text-klh-green-600">Beranda</NuxtLink>
        <span>/</span>
        <span class="capitalize text-klh-green-800">{{ sectionLabel }}</span>
      </nav>

      <header class="mb-10 max-w-4xl">
        <div class="mb-4 inline-flex items-center rounded-full border border-line bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-wide text-klh-green-600 shadow-klh-1 backdrop-blur">
          PPEPD
        </div>
        <h1 class="text-[33px] font-bold leading-tight tracking-tight text-klh-green-800 md:text-[57px]">
          {{ pageTitle }}
        </h1>
        <p class="mt-5 max-w-3xl text-base font-medium leading-relaxed text-ink-700 md:text-lg">
          {{ pageDescription }}
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article class="prose prose-klh max-w-none border-t border-line pt-8 prose-headings:text-klh-green-800 prose-headings:font-bold prose-headings:tracking-tight prose-h1:hidden prose-h2:mt-6 prose-h2:mb-4 prose-p:text-ink-700 prose-p:leading-snug prose-p:my-3 prose-a:font-bold prose-a:text-klh-green-600 hover:prose-a:text-klh-green-800 prose-strong:text-klh-green-800 prose-li:text-ink-700 prose-li:my-1 md:pt-10">
          <ContentRenderer :value="page" />
        </article>

        <aside class="hidden lg:block">
          <div class="sticky top-24 space-y-4">
            <div class="glass-card border-line bg-white/55 p-6">
              <p class="text-xs font-bold uppercase tracking-wide text-klh-green-600">Direktori</p>
              <p class="mt-2 text-lg font-bold capitalize leading-snug text-klh-green-800">{{ sectionLabel }}</p>
              <p class="mt-3 text-sm font-medium leading-relaxed text-ink-500">
                Informasi resmi disajikan dalam format ringkas agar mudah dibaca dan dirujuk kembali.
              </p>
            </div>

            <NuxtLink to="/" class="group flex items-center justify-between rounded-2xl border border-line bg-klh-green-800 px-5 py-4 text-sm font-bold text-white shadow-klh-3 transition-all hover:-translate-y-0.5 hover:shadow-klh-3">
              Kembali ke Beranda
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </NuxtLink>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
