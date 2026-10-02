<script setup lang="ts">
definePageMeta({ layout: 'data' })

const route = useRoute()
const slug = route.params.slug as string
const { public: { siteUrl, apiBase } } = useRuntimeConfig()

const { data, status } = await useAsyncData(`berita-${slug}`, () =>
  $fetch<{ data: any }>(`${apiBase}/berita-events/public/${slug}`).catch(() => null)
)

const item = computed(() => data.value?.data ?? null)
const isLoading = computed(() => status.value === 'pending')
const notFound = computed(() => status.value !== 'pending' && !item.value)

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  return `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

// Markdown → HTML (field body dari API)
function renderMarkdown(md: string): string {
  if (!md) return ''
  const lines = md.split('\n')
  const out: string[] = []
  let i = 0

  const escapeHtml = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const formatInline = (text: string) =>
    escapeHtml(text)
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('### ')) {
      out.push(`<h3>${formatInline(line.slice(4))}</h3>`)
    } else if (line.startsWith('## ')) {
      out.push(`<h2>${formatInline(line.slice(3))}</h2>`)
    } else if (line.startsWith('# ')) {
      out.push(`<h1>${formatInline(line.slice(2))}</h1>`)
    } else if (line.startsWith('> ')) {
      out.push(`<blockquote><p>${formatInline(line.slice(2))}</p></blockquote>`)
    } else if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(`<li>${formatInline(lines[i].slice(2))}</li>`)
        i++
      }
      out.push(`<ul>${items.join('')}</ul>`)
      continue
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${formatInline(lines[i].replace(/^\d+\. /, ''))}</li>`)
        i++
      }
      out.push(`<ol>${items.join('')}</ol>`)
      continue
    } else if (line.trim() === '---') {
      out.push('<hr>')
    } else if (line.trim() === '') {
      // skip blank lines
    } else {
      out.push(`<p>${formatInline(line)}</p>`)
    }

    i++
  }

  return out.join('\n')
}

const renderedContent = computed(() => renderMarkdown(item.value?.body ?? ''))

const ogImage = computed(() => {
  const img = item.value?.hero_image
  if (!img) return ''
  return img.startsWith('http') ? img : `${siteUrl}${img}`
})

useSeoMeta({
  title: computed(() => item.value ? `${item.value.title} – PPEPD` : 'PPEPD'),
  description: computed(() => item.value?.summary ?? ''),
  ogTitle: computed(() => item.value?.title ?? ''),
  ogDescription: computed(() => item.value?.summary ?? ''),
  ogImage: ogImage,
  ogUrl: computed(() => `${siteUrl}/berita-events/${slug}`),
  ogType: 'article',
  ogSiteName: 'PPEPD – Direktorat Perlindungan dan Pengelolaan Ekosistem Perairan Darat',
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => item.value?.title ?? ''),
  twitterDescription: computed(() => item.value?.summary ?? ''),
  twitterImage: ogImage,
})
</script>

<template>
  <div class="min-h-screen bg-surface-bg/30">

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <div class="w-10 h-10 rounded-full border-2 border-line border-t-klh-green-600 animate-spin"></div>
        <p class="text-sm font-bold text-ink-500">Memuat artikel...</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="notFound" class="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <div class="w-24 h-24 bg-klh-green-600/5 rounded-full flex items-center justify-center mb-6 border-2 border-line">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-klh-green-600/25"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
      </div>
      <h2 class="text-2xl font-bold text-klh-green-800 mb-2">Artikel Tidak Ditemukan</h2>
      <p class="text-sm text-ink-500 mb-8">Konten yang Anda cari tidak tersedia atau telah dipindahkan.</p>
      <NuxtLink to="/berita-events" class="px-6 py-2.5 rounded-full bg-klh-green-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-klh-green-800 transition-all">
        Kembali ke Katalog
      </NuxtLink>
    </div>

    <!-- Article -->
    <div v-else-if="item">

      <!-- Hero Image -->
      <div class="relative w-full h-[50vh] overflow-hidden bg-ink-900/10">
        <img :src="item.hero_image" :alt="item.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-klh-green-800/80 via-klh-green-800/30 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 px-8 pb-10 max-w-4xl mx-auto">
          <div class="flex items-center gap-2 mb-4">
            <span :class="[
              'px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest',
              item.type === 'berita' ? 'bg-klh-blue-600 text-white' : 'bg-klh-orange-500 text-on-orange'
            ]">
              {{ item.type === 'berita' ? 'Berita' : 'Event' }}
            </span>
            <span class="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur text-white text-[11px] font-bold uppercase tracking-widest">
              {{ item.category }}
            </span>
          </div>
          <h1 class="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl">{{ item.title }}</h1>
        </div>
      </div>

      <!-- Content Layout -->
      <div class="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">

        <!-- Article Body -->
        <article
          class="prose prose-sm md:prose-base prose-headings:font-bold prose-headings:text-klh-green-800 prose-h1:hidden prose-p:text-ink-700 prose-p:leading-relaxed prose-strong:text-ink-900 prose-a:text-klh-green-600 prose-li:text-ink-700 prose-blockquote:border-klh-green-600 prose-blockquote:text-ink-500 prose-hr:border-line prose-code:text-klh-green-600 prose-code:bg-klh-green-600/5 prose-code:px-1 prose-code:rounded max-w-none"
          v-html="renderedContent"
        ></article>

        <!-- Sidebar -->
        <aside class="space-y-6">

          <!-- Meta Card -->
          <div class="bg-white rounded-2xl border border-line p-6 space-y-4">
            <h3 class="text-xs font-bold text-ink-500 uppercase tracking-widest">Informasi</h3>

            <div>
              <p class="text-[11px] font-bold text-ink-400 uppercase tracking-widest mb-1">Tanggal</p>
              <p class="text-sm font-bold text-klh-green-800">{{ formatDate(item.published_at) }}</p>
            </div>

            <div>
              <p class="text-[11px] font-bold text-ink-400 uppercase tracking-widest mb-1">Penulis / Penyelenggara</p>
              <p class="text-sm font-bold text-ink-900">{{ item.author }}</p>
            </div>

            <div>
              <p class="text-[11px] font-bold text-ink-400 uppercase tracking-widest mb-1">Kategori</p>
              <span class="inline-block px-3 py-1.5 rounded-lg bg-klh-green-600/8 text-klh-green-600 text-xs font-bold uppercase tracking-wider">
                {{ item.category }}
              </span>
            </div>

            <div v-if="item.tags?.length">
              <p class="text-[11px] font-bold text-ink-400 uppercase tracking-widest mb-2">Tags</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="px-2.5 py-1 rounded-full bg-surface-bg border border-line text-ink-500 text-[11px] font-bold"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Back Button -->
          <NuxtLink
            to="/berita-events"
            class="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-line text-ink-500 hover:border-klh-green-600 hover:text-klh-green-600 text-xs font-bold transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
            Kembali ke Katalog
          </NuxtLink>

        </aside>
      </div>
    </div>

  </div>
</template>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 0.8s linear infinite; }
</style>
