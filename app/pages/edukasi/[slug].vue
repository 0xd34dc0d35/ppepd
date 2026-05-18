<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: 'data' })

const route = useRoute()
const slug = route.params.slug as string

const item = ref<any>(null)
const rawMarkdown = ref('')
const isLoading = ref(true)
const notFound = ref(false)

function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let i = 0

  const formatInline = (text: string) =>
    text
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')

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
    } else if (line.trim() !== '') {
      out.push(`<p>${formatInline(line)}</p>`)
    }
    i++
  }

  return out.join('\n')
}

const renderedContent = computed(() => renderMarkdown(rawMarkdown.value))

onMounted(async () => {
  try {
    const [catalogRes, mdRes] = await Promise.all([
      fetch('/static/edukasi/catalog.json'),
      fetch(`/static/edukasi/${slug}.md`)
    ])

    if (!catalogRes.ok || !mdRes.ok) { notFound.value = true; return }

    const catalog = await catalogRes.json()
    item.value = catalog.find((c: any) => c.id === slug) ?? null
    if (!item.value) { notFound.value = true; return }

    rawMarkdown.value = await mdRes.text()
  } catch {
    notFound.value = true
  } finally {
    isLoading.value = false
  }
})

useSeoMeta({
  title: computed(() => item.value ? `${item.value.title} – PPEPD` : 'PPEPD'),
  description: computed(() => item.value?.excerpt ?? '')
})
</script>

<template>
  <div class="min-h-screen bg-brand-cream/30">

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <div class="w-10 h-10 rounded-full border-2 border-brand-green/20 border-t-brand-green animate-spin"></div>
        <p class="text-sm font-bold text-brand-charcoal/40">Memuat konten...</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="notFound" class="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <div class="w-24 h-24 bg-brand-green/5 rounded-full flex items-center justify-center mb-6 border-2 border-brand-green/10">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-brand-green/25"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
      </div>
      <h2 class="text-2xl font-black text-brand-green-dark mb-2">Konten Tidak Ditemukan</h2>
      <p class="text-sm text-brand-charcoal/50 mb-8">Halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
      <NuxtLink to="/edukasi" class="px-6 py-2.5 rounded-full bg-brand-green text-white text-xs font-black uppercase tracking-widest hover:bg-brand-green-dark transition-all">
        Kembali ke Katalog
      </NuxtLink>
    </div>

    <!-- Content -->
    <div v-else-if="item" class="pt-[50px]">

      <!-- Hero -->
      <div class="relative w-full h-[50vh] overflow-hidden bg-brand-charcoal/10">
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-charcoal/85 via-brand-charcoal/30 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 px-8 pb-10 max-w-4xl mx-auto">
          <div class="flex items-center gap-2 mb-4">
            <span :class="[
              'px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest',
              item.type === 'edukasi' ? 'bg-brand-green text-white' : 'bg-brand-orange text-white'
            ]">
              {{ item.type === 'edukasi' ? 'Edukasi' : 'Campaign' }}
            </span>
            <span class="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest">
              {{ item.category }}
            </span>
          </div>
          <h1 class="text-2xl md:text-4xl font-black text-white leading-tight max-w-3xl">{{ item.title }}</h1>
        </div>
      </div>

      <!-- Body -->
      <div class="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">

        <!-- Article -->
        <article
          class="prose prose-sm md:prose-base prose-headings:font-black prose-headings:text-brand-green-dark prose-h1:hidden prose-p:text-brand-charcoal/70 prose-p:leading-relaxed prose-strong:text-brand-charcoal prose-a:text-brand-green prose-li:text-brand-charcoal/70 prose-blockquote:border-brand-green prose-blockquote:text-brand-charcoal/60 prose-hr:border-brand-green/10 prose-code:text-brand-green prose-code:bg-brand-green/5 prose-code:px-1 prose-code:rounded max-w-none"
          v-html="renderedContent"
        ></article>

        <!-- Sidebar -->
        <aside class="space-y-6">

          <div class="bg-white rounded-2xl border border-brand-green/10 p-6 space-y-4">
            <h3 class="text-xs font-black text-brand-charcoal/40 uppercase tracking-widest">Informasi</h3>

            <div>
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-1">Tipe</p>
              <span :class="[
                'inline-block px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider',
                item.type === 'edukasi' ? 'bg-brand-green/8 text-brand-green' : 'bg-brand-orange/8 text-brand-orange'
              ]">{{ item.type === 'edukasi' ? 'Edukasi' : 'Campaign' }}</span>
            </div>

            <div>
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-1">Penulis / Penyelenggara</p>
              <p class="text-sm font-bold text-brand-charcoal">{{ item.author }}</p>
            </div>

            <div>
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-1">Kategori</p>
              <span class="inline-block px-3 py-1.5 rounded-lg bg-brand-green/8 text-brand-green text-xs font-black uppercase tracking-wider">
                {{ item.category }}
              </span>
            </div>

            <div>
              <p class="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mb-2">Tags</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="px-2.5 py-1 rounded-full bg-brand-cream border border-brand-green/10 text-brand-charcoal/60 text-[10px] font-bold"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/edukasi"
            class="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-brand-green/10 text-brand-charcoal/50 hover:border-brand-green hover:text-brand-green text-xs font-bold transition-all duration-300 group"
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
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.8s linear infinite; }
</style>
