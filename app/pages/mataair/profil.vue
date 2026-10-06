<script setup>
definePageMeta({ middleware: ['auth', 'dashboard'] })
useSeoMeta({ title: 'Basis Data Profil Mata Air | PPEPD', robots: 'noindex' })
const search = ref('')
const page = ref(1)
const records = ref([])
const total = ref(0)
const canWrite = ref(false)
const loading = ref(true)
const error = ref('')
const notice = ref('')
const panelOpen = ref(false)
const editing = ref(false)
const busy = ref(false)
const formError = ref('')
const form = reactive({})
const editor = ref(null)
let returnFocus
let requestId = 0
let timer
const fields = [
  { key: 'name', label: 'Nama mata air', required: true, max: 150 },
  { key: 'province', label: 'Provinsi', required: true, max: 100 },
  { key: 'district', label: 'Kabupaten / kota', required: true, max: 100 },
  { key: 'village', label: 'Desa / kelurahan', max: 100 },
  { key: 'latitude', label: 'Latitude', type: 'number', min: -90, max: 90 },
  { key: 'longitude', label: 'Longitude', type: 'number', min: -180, max: 180 },
  { key: 'discharge', label: 'Debit (liter/detik)', type: 'number', min: 0, max: 1000000000 },
]
async function load() {
  const id = ++requestId
  loading.value = true; error.value = ''
  try {
    const result = await $fetch('/api/management/spring-profiles', { query: { search: search.value, page: page.value } })
    if (id !== requestId) return
    records.value = result.data; total.value = result.total; page.value = result.page; canWrite.value = result.canWrite
  } catch (err) { if (id === requestId) error.value = err.data?.statusMessage || 'Data belum dapat dimuat.' }
  finally { if (id === requestId) loading.value = false }
}
watch(search, () => { clearTimeout(timer); ++requestId; loading.value = true; timer = setTimeout(() => { page.value = 1; load() }, 300) })
async function changePage(value) { page.value = value; await load() }
async function open(record, edit = false) {
  returnFocus = document.activeElement
  for (const key of Object.keys(form)) delete form[key]
  Object.assign(form, record || { name: '', province: '', district: '', village: '', latitude: '', longitude: '', discharge: '', status: 'aktif', notes: '' })
  editing.value = edit; formError.value = ''; panelOpen.value = true
  await nextTick(); editor.value?.focus(); editor.value?.scrollIntoView({ block: 'start', behavior: 'instant' })
}
function close() { if (busy.value) return; panelOpen.value = false; returnFocus?.focus() }
async function save() {
  busy.value = true; formError.value = ''
  try {
    await $fetch('/api/management/spring-profiles', { method: form.id ? 'PATCH' : 'POST', body: { ...form } })
    notice.value = 'Profil mata air berhasil disimpan.'
    busy.value = false; close(); await load()
  } catch (err) { formError.value = err.data?.statusMessage || 'Profil belum tersimpan.' }
  finally { busy.value = false }
}
onMounted(load)
onUnmounted(() => { clearTimeout(timer); ++requestId })
</script>
<template>
  <section>
    <NuxtLink to="/mataair/manajemen" class="inline-flex min-h-11 items-center text-sm text-klh-blue-600 hover:underline">← Manajemen Data Mata Air</NuxtLink>
    <div class="my-6 flex flex-wrap items-start justify-between gap-4">
      <div><h1 class="text-[2rem] font-bold">Basis Data Profil Mata Air</h1><p class="mt-2 text-ink-500">Identitas dan informasi lokasi mata air.</p></div>
      <button v-if="canWrite" type="button" class="btn btn-primary" @click="open(null, true)">Tambah profil</button>
    </div>
    <p v-if="notice" role="status" class="mb-4 rounded-lg bg-success-bg p-4 text-success">{{ notice }}</p>
    <div class="mb-6 flex flex-wrap items-end gap-3">
      <div class="min-w-0 flex-1"><label for="spring-search" class="mb-2 block text-sm font-semibold">Cari nama atau lokasi</label><input id="spring-search" v-model="search" type="search" class="klh-input w-full" placeholder="Nama, provinsi, kabupaten, atau desa"></div>
      <button class="btn btn-outline" :disabled="loading" @click="load">Muat ulang</button>
    </div>
    <p v-if="loading" role="status" class="klh-card p-6">Memuat profil…</p>
    <div v-else-if="error" role="alert" class="rounded-xl bg-danger-bg p-6 text-danger"><p>{{ error }}</p><button class="btn btn-outline mt-4" @click="load">Coba kembali</button></div>
    <p v-else-if="!records.length" class="klh-card p-6 text-ink-500">{{ search ? 'Tidak ada profil yang cocok dengan pencarian.' : 'Belum ada profil mata air. Administrator dapat menambahkan profil baru.' }}</p>
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      <article v-for="record in records" :key="record.id" class="klh-card flex min-w-0 flex-col p-5">
        <h2 class="break-words text-xl font-bold">{{ record.name }}</h2>
        <p class="mt-2 text-sm text-ink-500">{{ [record.village, record.district, record.province].filter(Boolean).join(' · ') }}</p>
        <p class="mt-4 text-sm">Status: <strong>{{ record.status === 'aktif' ? 'Aktif' : 'Tidak aktif' }}</strong></p>
        <p class="mt-1 text-sm">Debit: {{ record.discharge === null ? 'Belum dicatat' : record.discharge + ' liter/detik' }}</p>
        <div class="mt-auto flex flex-wrap gap-2 pt-5"><button class="btn btn-outline" @click="open(record)">Detail</button><button v-if="canWrite" class="btn btn-secondary" @click="open(record, true)">Ubah</button></div>
      </article>
    </div>
    <nav v-if="!loading && !error && total" aria-label="Halaman profil" class="mt-8 flex flex-wrap items-center justify-between gap-3">
      <p role="status" class="text-sm text-ink-500">{{ total }} profil · Halaman {{ page }} / {{ Math.ceil(total / 15) }}</p>
      <div class="flex gap-2"><button class="btn btn-outline" :disabled="page <= 1" @click="changePage(page - 1)">Sebelumnya</button><button class="btn btn-outline" :disabled="page * 15 >= total" @click="changePage(page + 1)">Berikutnya</button></div>
    </nav>
    <section v-if="panelOpen" ref="editor" tabindex="-1" class="profile-editor klh-card mt-8" aria-labelledby="profile-editor-title">
      <div class="flex items-center justify-between gap-4 border-b border-line p-5"><h2 id="profile-editor-title" class="text-xl font-bold">{{ editing ? (form.id ? 'Ubah profil' : 'Tambah profil') : 'Detail profil' }}</h2><button class="btn btn-ghost" :disabled="busy" aria-label="Tutup bagian profil" @click="close">Tutup</button></div>
      <form v-if="editing" class="profile-content" @submit.prevent="save">
        <p v-if="formError" role="alert" class="mb-4 rounded-lg bg-danger-bg p-3 text-danger">{{ formError }}</p>
        <fieldset :disabled="busy" class="space-y-4">
          <div v-for="field in fields" :key="field.key"><label :for="'spring-' + field.key" class="mb-2 block text-sm font-semibold">{{ field.label }}{{ field.required ? ' *' : '' }}</label><input :id="'spring-' + field.key" v-model="form[field.key]" :type="field.type || 'text'" :required="field.required" :maxlength="field.max" :min="field.min" :max="field.max" :step="field.type ? 'any' : undefined" class="klh-input w-full"></div>
          <p class="text-sm text-ink-500">Koordinat bersifat opsional. Isi latitude dan longitude secara berpasangan dalam derajat desimal.</p>
          <div><label for="spring-status" class="mb-2 block text-sm font-semibold">Status</label><select id="spring-status" v-model="form.status" class="klh-input w-full"><option value="aktif">Aktif</option><option value="tidak-aktif">Tidak aktif</option></select></div>
          <div><label for="spring-notes" class="mb-2 block text-sm font-semibold">Catatan</label><textarea id="spring-notes" v-model="form.notes" maxlength="3000" rows="4" class="klh-input w-full"></textarea></div>
          <div class="flex flex-wrap gap-3 pt-4"><button class="btn btn-primary">{{ busy ? 'Menyimpan…' : 'Simpan profil' }}</button><button type="button" class="btn btn-outline" @click="close">Batal</button></div>
        </fieldset>
      </form>
      <div v-else class="profile-content"><dl class="space-y-4"><div v-for="field in fields" :key="field.key"><dt class="text-sm text-ink-500">{{ field.label }}</dt><dd class="break-words font-semibold">{{ form[field.key] ?? 'Belum dicatat' }}</dd></div><div><dt class="text-sm text-ink-500">Status</dt><dd>{{ form.status === 'aktif' ? 'Aktif' : 'Tidak aktif' }}</dd></div><div><dt class="text-sm text-ink-500">Catatan</dt><dd class="whitespace-pre-wrap break-words">{{ form.notes || 'Tidak ada catatan' }}</dd></div><div><dt class="text-sm text-ink-500">Terakhir diperbarui</dt><dd>{{ new Date(form.updated_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }} · {{ form.updated_by }}</dd></div></dl></div>
    </section>
  </section>
</template>
<style scoped>
.profile-editor { scroll-margin-top: calc(var(--klh-header-h) + 24px); }
.profile-content { padding: 24px; }
@media (max-width: 767px) { .profile-content { padding: 16px; } .profile-content input, .profile-content select, .profile-content textarea { font-size: 16px; } }
</style>
