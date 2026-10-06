<script setup>
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Aplikasi | PPEPD', robots: 'noindex' })
const { apiFetch } = useApi()
const apps = ref([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const page = ref(1)
const pageSize = 12
const filtered = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('id')
  return apps.value.filter(app => [app.name, app.description, app.meta?.description].filter(Boolean).join(' ').toLocaleLowerCase('id').includes(query))
})
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const visible = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))
watch(search, () => { page.value = 1 })
function appUrl(app) {
  const raw = app.meta?.url || app.meta?.link || app.meta?.href
  if (!raw) return null
  try {
    const url = new URL(raw, 'https://ppepd.kemenlh.go.id')
    if (!['http:', 'https:'].includes(url.protocol)) return null
    if (url.hostname === 'permata.kemenlh.go.id') return '/permata'
    return raw.startsWith('/') && !raw.startsWith('//') ? raw : url.href
  } catch { return null }
}
async function loadApps() {
  if (!loading.value) loading.value = true
  error.value = ''
  try {
    const response = await apiFetch('/app')
    // Normalisasi katalog API lama agar pintu masuk tetap menuju induk manajemen.
    apps.value = (Array.isArray(response) ? response : response?.data ?? []).map(app => {
      const raw = app.meta?.url || app.meta?.link || app.meta?.href
      let path
      try { path = new URL(raw, 'https://ppepd.kemenlh.go.id').pathname } catch { return app }
      const domains = {
        '/danau/dashboard': { name: 'Manajemen Data Danau', url: '/danau/manajemen' },
        '/mataair/dashboard': { name: 'Manajemen Data Mata Air', url: '/mataair/manajemen' },
      }
      if (path === '/mangrove/dashboard') return null
      const domain = domains[path]
      return domain ? { ...app, name: domain.name, meta: { ...app.meta, url: domain.url } } : app
    }).filter(Boolean)
    page.value = Math.min(page.value, pages.value)
  } catch {
    error.value = 'Daftar aplikasi belum dapat dimuat. Silakan coba kembali.'
  } finally { loading.value = false }
}
onMounted(loadApps)
</script>

<template>
  <section aria-labelledby="apps-title">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 id="apps-title" class="text-[2rem] font-bold">Aplikasi</h1>
        <p class="mt-2 text-ink-500">Pilih aplikasi yang tersedia untuk akun Anda.</p>
      </div>
      <NuxtLink to="/my-profiles" class="btn btn-outline">Pengaturan profil</NuxtLink>
    </div>

    <div class="mb-6 max-w-prose">
      <label for="apps-search" class="mb-2 block text-sm font-semibold text-ink-700">Cari aplikasi</label>
      <input id="apps-search" v-model="search" type="search" placeholder="Nama atau deskripsi aplikasi" class="klh-input w-full" autocomplete="off">
    </div>

    <p v-if="loading" role="status" class="rounded-2xl border border-line bg-surface p-6 text-ink-500">Memuat aplikasi…</p>
    <div v-else-if="error" role="alert" class="rounded-2xl border border-danger-line bg-danger-bg p-6">
      <p class="text-danger">{{ error }}</p><button type="button" class="btn btn-outline mt-4" @click="loadApps">Coba kembali</button>
    </div>
    <p v-else-if="!apps.length" class="klh-card p-6 text-ink-500">Belum ada aplikasi yang tersedia untuk akun Anda.</p>
    <div v-else-if="!filtered.length" class="klh-card p-6">
      <p class="text-ink-500">Tidak ada aplikasi yang cocok dengan “{{ search }}”.</p>
      <button type="button" class="btn btn-ghost mt-3" @click="search = ''">Hapus pencarian</button>
    </div>
    <template v-else>
      <div class="apps-grid">
        <component :is="appUrl(app) ? 'a' : 'article'" v-for="app in visible" :key="app.id" :href="appUrl(app) || undefined" class="apps-card klh-card" :class="{ 'apps-card-link': appUrl(app) }">
          <AppAvatar :to="appUrl(app) || String(app.id)" :name="app.name" />
          <div class="min-w-0 flex-1">
            <h2 class="text-base font-bold text-ink-900">{{ app.name }}</h2>
            <p v-if="app.description || app.meta?.description" class="mt-1 text-sm text-ink-500">{{ app.description || app.meta.description }}</p>
            <p v-if="!appUrl(app)" class="mt-1 text-sm text-ink-500">Belum tersedia</p>
          </div>
          <svg v-if="appUrl(app)" aria-hidden="true" class="shrink-0 text-ink-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 5 7 7-7 7"/></svg>
        </component>
      </div>
      <nav v-if="pages > 1" aria-label="Halaman aplikasi" class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button type="button" class="btn btn-outline" :disabled="page === 1" @click="page--">Sebelumnya</button>
        <p role="status" class="text-sm text-ink-500">{{ page }} / {{ pages }}</p>
        <button type="button" class="btn btn-outline" :disabled="page === pages" @click="page++">Berikutnya</button>
      </nav>
    </template>
  </section>
</template>

<style scoped>
.apps-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; }
.apps-card { display: flex; align-items: center; gap: 16px; padding: 20px; min-width: 0; overflow-wrap: anywhere; }
.apps-card-link:hover { border-color: rgb(var(--klh-g-600)); }
@media (min-width: 768px) { .apps-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; } }
@media (min-width: 1024px) { .apps-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
</style>
