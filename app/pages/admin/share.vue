<script setup lang="ts">
definePageMeta({ layout: 'data' })

useSeoMeta({ title: 'Kelola Link Share | PPEPD' })

interface LinkItem {
  id: string
  url: string
  title: string
  created: string
  hits: number
}

const links = ref<LinkItem[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)

const form = reactive({ url: '', title: '', customId: '' })
const result = ref<{ id: string; shortUrl: string } | null>(null)
const error = ref('')
const copied = ref(false)

async function loadLinks() {
  isLoading.value = true
  try {
    links.value = await $fetch<LinkItem[]>('/api/s')
  } finally {
    isLoading.value = false
  }
}

async function submit() {
  if (!form.url.trim()) return
  isSubmitting.value = true
  error.value = ''
  result.value = null
  try {
    const data = await $fetch<{ id: string; shortPath: string }>('/api/s', {
      method: 'POST',
      body: {
        url: form.url.trim(),
        title: form.title.trim(),
        customId: form.customId.trim() || undefined,
      },
    })
    result.value = { id: data.id, shortUrl: `${window.location.origin}${data.shortPath}` }
    form.url = ''
    form.title = ''
    form.customId = ''
    await loadLinks()
  } catch (e: any) {
    error.value = e?.data?.statusMessage ?? 'Terjadi kesalahan'
  } finally {
    isSubmitting.value = false
  }
}

async function copyUrl(url: string) {
  await navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function shortUrl(id: string) {
  if (import.meta.client) return `${window.location.origin}/s/${id}`
  return `/s/${id}`
}

onMounted(loadLinks)
</script>

<template>
  <div class="min-h-screen bg-surface-bg/40">
    <div class="max-w-4xl mx-auto px-6 py-12">

      <!-- Header -->
      <div class="mb-10">
        <p class="text-xs font-bold text-ink-500 uppercase tracking-widest mb-2">Admin</p>
        <h1 class="text-2xl font-bold text-klh-green-800">Kelola Link Share</h1>
        <p class="text-sm text-ink-500 mt-1">Buat tautan pendek <code class="bg-surface-bg border border-line px-1.5 py-0.5 rounded text-[11px] font-mono">/s/{id}</code> yang meredirect ke halaman tujuan.</p>
      </div>

      <!-- Create form -->
      <div class="bg-white border border-line rounded-2xl p-6 mb-8">
        <h2 class="text-xs font-bold text-ink-500 uppercase tracking-widest mb-5">Buat Link Baru</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-1.5">URL Tujuan <span class="text-danger">*</span></label>
            <input
              v-model="form.url"
              type="text"
              placeholder="https://ppepd.go.id/berita-events/… atau /danau"
              class="w-full px-4 py-2.5 rounded-xl border border-line bg-surface-bg/40 text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:border-klh-green-200 focus:bg-white transition-all"
              @keyup.enter="submit"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-1.5">Judul / Keterangan</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="contoh: Link Rapat Mangrove Mei 2026"
                class="w-full px-4 py-2.5 rounded-xl border border-line bg-surface-bg/40 text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:border-klh-green-200 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-1.5">ID Kustom <span class="text-ink-400 normal-case font-medium">(opsional)</span></label>
              <div class="flex">
                <span class="px-3 py-2.5 rounded-l-xl border border-r-0 border-line bg-surface-bg/60 text-[11px] font-bold text-ink-500 shrink-0">/s/</span>
                <input
                  v-model="form.customId"
                  type="text"
                  placeholder="rapat-mangrove"
                  class="flex-1 px-3 py-2.5 rounded-r-xl border border-line bg-surface-bg/40 text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:border-klh-green-200 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <div v-if="error" class="text-sm text-danger font-medium bg-danger-bg border border-danger-line rounded-xl px-4 py-2.5">
            {{ error }}
          </div>

          <div v-if="result" class="flex items-center gap-3 bg-klh-green-600/5 border border-line rounded-xl px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-klh-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <code class="flex-1 text-sm font-mono text-klh-green-800 font-bold">{{ result.shortUrl }}</code>
            <button @click="copyUrl(result.shortUrl)"
              class="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-klh-green-600 text-white hover:bg-klh-green-800 transition-colors">
              {{ copied ? 'Tersalin!' : 'Salin' }}
            </button>
          </div>

          <div class="flex justify-end">
            <button
              @click="submit"
              :disabled="isSubmitting || !form.url.trim()"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-klh-green-600 text-white text-sm font-bold hover:bg-klh-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
              Buat Link
            </button>
          </div>
        </div>
      </div>

      <!-- Links table -->
      <div class="bg-white border border-line rounded-2xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-line">
          <p class="text-xs font-bold text-ink-500 uppercase tracking-widest">Semua Link</p>
          <span class="text-[11px] font-bold text-ink-400">{{ links.length }} link</span>
        </div>

        <div v-if="isLoading" class="p-8 flex justify-center">
          <div class="w-6 h-6 rounded-full border-2 border-line border-t-klh-green-600 animate-spin"></div>
        </div>

        <div v-else-if="links.length === 0" class="px-6 py-12 text-center">
          <p class="text-sm text-ink-500">Belum ada link. Buat link pertama di atas.</p>
        </div>

        <div v-else class="divide-y divide-line">
          <div v-for="link in links" :key="link.id"
            class="flex items-center gap-4 px-6 py-4 hover:bg-surface-bg/30 transition-colors group">

            <div class="shrink-0 w-28">
              <code class="text-sm font-mono font-bold text-klh-green-600">/s/{{ link.id }}</code>
            </div>

            <div class="flex-1 min-w-0">
              <p v-if="link.title" class="text-sm font-bold text-ink-900 truncate leading-none">{{ link.title }}</p>
              <p class="text-[11px] text-ink-500 truncate mt-0.5">{{ link.url }}</p>
            </div>

            <div class="shrink-0 text-right hidden sm:block">
              <p class="text-[11px] font-bold text-ink-500">{{ link.hits }} klik</p>
              <p class="text-[11px] text-ink-400">{{ link.created }}</p>
            </div>

            <!-- Actions: salin + buka saja -->
            <div class="shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="copyUrl(shortUrl(link.id))"
                title="Salin URL"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:text-klh-green-600 hover:bg-klh-green-600/8 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              </button>
              <a :href="link.url" target="_blank"
                title="Buka tujuan"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:text-klh-blue-600 hover:bg-klh-blue-500/8 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.8s linear infinite; }
</style>
