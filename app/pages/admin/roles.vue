<script setup lang="ts">
import { MANAGEMENT_PERMISSIONS, type ManagedRole, type Permission } from '#shared/management'
definePageMeta({ middleware: 'management' })
useSeoMeta({ title: 'Roles & Hak Akses | PPEPD', robots: 'noindex' })
const { user, fetchMe } = useAuth()
const requestFetch = useRequestFetch()
const { data, error: loadError, refresh, status } = await useAsyncData('management-roles', () => requestFetch<{ data: ManagedRole[] }>('/api/management/roles'))
const drafts = ref<ManagedRole[]>([])
watch(data, value => { drafts.value = (value?.data ?? []).map(role => ({ ...role, permissions: [...role.permissions] })) }, { immediate: true })
const editable = computed(() => user.value?.roles.includes('admin') ?? false)
const saving = ref('')
const error = ref('')
const notice = ref('')
function dirty(role: ManagedRole) {
  const saved = data.value?.data.find(item => item.id === role.id)
  return !!saved && MANAGEMENT_PERMISSIONS.some(p => saved.permissions.includes(p.id) !== role.permissions.includes(p.id))
}
function toggle(role: ManagedRole, permission: Permission) {
  if (!editable.value || role.id === 'admin' || saving.value) return
  role.permissions = role.permissions.includes(permission) ? role.permissions.filter(p => p !== permission) : [...role.permissions, permission]
}
function reset(role: ManagedRole) {
  role.permissions = [...(data.value?.data.find(item => item.id === role.id)?.permissions ?? [])]
}
async function save(role: ManagedRole) {
  if (saving.value || !dirty(role)) return
  saving.value = role.id; error.value = ''; notice.value = ''
  try {
    await $fetch(`/api/management/roles/${role.id}`, { method: 'PATCH', body: { permissions: role.permissions } })
    await refresh()
    notice.value = `Hak akses ${role.name} disimpan. Pengguna dengan role ini perlu masuk kembali.`
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Hak akses belum dapat disimpan. Coba kembali.'
    if (err?.statusCode === 401) { await fetchMe(); await navigateTo('/login?redirect=/admin/roles') }
  } finally { saving.value = '' }
}
</script>

<template>
  <div class="space-y-6">
    <AccountNavigation />
    <header><p class="text-sm font-semibold text-klh-green-700">Administrasi PPEPD</p><h1 class="mt-2 font-display text-3xl font-bold">Roles &amp; hak akses</h1><p class="mt-3 max-w-prose text-ink-500">Atur izin untuk role Administrator, Pengelola, dan Publik. Izin berlaku untuk seluruh akun dengan role yang sama.</p></header>
    <p class="rounded-xl border border-info-line bg-info-bg p-4 text-info">{{ editable ? 'Hanya administrator dapat menyimpan perubahan. Setiap perubahan izin mencabut sesi pengguna role tersebut.' : 'Anda dapat melihat hak akses. Hubungi administrator untuk mengubahnya.' }}</p>
    <p v-if="error" role="alert" class="rounded-xl bg-danger-bg p-4 text-danger">{{ error }}</p>
    <p v-if="notice" role="status" class="rounded-xl bg-success-bg p-4 text-success">{{ notice }}</p>
    <div v-if="loadError" role="alert" class="klh-card p-6"><p>Daftar role belum dapat dimuat.</p><button class="btn btn-outline mt-3" @click="refresh()">Coba kembali</button></div>
    <p v-else-if="status === 'pending'" role="status">Memuat roles…</p>
    <section v-else class="space-y-5" aria-label="Daftar role">
      <article v-for="role in drafts" :key="role.id" class="klh-card p-4 sm:p-6">
        <div class="flex flex-wrap items-center justify-between gap-2"><h2 class="font-display text-xl font-bold">{{ role.name }}</h2><span class="text-sm text-ink-500">{{ role.permissions.length }} dari {{ MANAGEMENT_PERMISSIONS.length }} izin</span></div>
        <p v-if="role.id === 'admin'" class="mt-2 text-sm text-ink-500">Hak akses administrator selalu lengkap dan tidak dapat diubah.</p>
        <div class="mt-4 grid gap-3 md:grid-cols-2">
          <label v-for="permission in MANAGEMENT_PERMISSIONS" :key="permission.id" class="flex min-h-[44px] items-start gap-3 rounded-xl border border-line p-3">
            <input type="checkbox" :checked="role.permissions.includes(permission.id)" :disabled="!editable || role.id === 'admin' || !!saving" class="mt-1 h-5 w-5 shrink-0 accent-klh-green-600" @change="toggle(role, permission.id)">
            <span><span class="block font-semibold">{{ permission.label }}</span><span class="text-sm text-ink-500">{{ permission.description }}</span></span>
          </label>
        </div>
        <div v-if="editable && role.id !== 'admin'" class="mt-4 flex flex-wrap gap-3"><button class="btn btn-primary" :disabled="!!saving || !dirty(role)" @click="save(role)">{{ saving === role.id ? 'Menyimpan…' : `Simpan hak akses ${role.name}` }}</button><button class="btn btn-outline" :disabled="!!saving || !dirty(role)" @click="reset(role)">Batalkan perubahan</button></div>
      </article>
    </section>
    <NuxtLink to="/dokumentasi#roles" class="inline-flex min-h-[44px] items-center font-semibold text-klh-green-700 underline">Baca panduan pengaturan roles</NuxtLink>
  </div>
</template>
