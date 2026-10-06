<script setup lang="ts">
import { type ManagedUser, type ManagedRole, type AuditEntry } from '#shared/management'

definePageMeta({ middleware: 'management' })
useSeoMeta({ title: 'Manajemen Sistem | PPEPD', robots: 'noindex' })
const { user, fetchMe, can } = useAuth()
const requestFetch = useRequestFetch()
const { data: setupStatus } = await useAsyncData('management-status', () => requestFetch<{ initialized: boolean; storage: string }>('/api/management/status'))
const initialized = computed(() => setupStatus.value?.initialized ?? false)
const busy = ref(false)
const error = ref('')
const notice = ref('')
const search = ref('')
const roleFilter = ref('')
const tab = ref<'users' | 'audit'>('users')
const users = ref<ManagedUser[]>([])
const roles = ref<ManagedRole[]>([])
const logs = ref<AuditEntry[]>([])
const stats = ref({ users: 0, active: 0, sessions: 0 })
const editing = ref<string | null>(null)
const editorOpen = ref(false)
const resetTarget = ref<ManagedUser | null>(null)
const resetPassword = ref('')
const pendingRevoke = ref<ManagedUser | null>(null)
const setup = reactive({ username: '', display_name: '', email: '', password: '', confirmation: '' })
const form = reactive({ username: '', display_name: '', email: '', role: 'publik', active: true, password: '' })
const filteredUsers = computed(() => users.value.filter(u => (!roleFilter.value || u.role === roleFilter.value) && `${u.username} ${u.display_name} ${u.email}`.toLowerCase().includes(search.value.toLowerCase())))
const formatDate = (value: string | null) => value ? new Date(value).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }) : 'Belum pernah'
const roleName = (id: string) => roles.value.find(r => r.id === id)?.name ?? id
const actionNames: Record<string, string> = { setup: 'Admin pertama dibuat', login: 'Masuk', 'login.failed': 'Login gagal', logout: 'Keluar', 'user.create': 'Akun dibuat', 'user.update': 'Akun diperbarui', 'profile.update': 'Profil diperbarui', 'password.reset': 'Password direset', 'password.change': 'Password diubah', 'sessions.revoke': 'Sesi dicabut', 'role.update': 'Hak akses role diubah' }
async function load() {
  if (!initialized.value) return
  const overview = await $fetch<typeof stats.value & { roles: ManagedRole[] }>('/api/management/overview')
  stats.value = { users: overview.users, active: overview.active, sessions: overview.sessions }
  roles.value = overview.roles
  if (can('users.manage')) users.value = (await $fetch<{ data: ManagedUser[] }>('/api/management/users')).data
  if (can('audit.view')) logs.value = (await $fetch<{ data: AuditEntry[] }>('/api/management/audit')).data
  if (!can('users.manage')) {
    if (!can('audit.view') && can('roles.manage')) { await navigateTo('/admin/roles'); return }
    tab.value = 'audit'
  }
}
async function perform(action: () => Promise<void>) {
  if (busy.value) return
  busy.value = true; error.value = ''; notice.value = ''
  try { await action() }
  catch (err: any) {
    error.value = err?.data?.statusMessage || 'Tidak dapat menyimpan perubahan. Coba kembali.'
    if (err?.statusCode === 401 || err?.status === 401) {
      await fetchMe()
      await navigateTo('/login?redirect=/admin/system')
    }
  } finally { busy.value = false }
}
async function createAdmin() {
  await perform(async () => {
    if (setup.password !== setup.confirmation) throw { data: { statusMessage: 'Konfirmasi password tidak sesuai' } }
    await $fetch('/api/management/setup', { method: 'POST', body: setup })
    setup.password = ''; setup.confirmation = ''
    await fetchMe()
    setupStatus.value = { initialized: true, storage: setupStatus.value?.storage ?? 'postgres' }
    await load()
    notice.value = 'Administrator pertama berhasil dibuat. Anda sudah masuk.'
  })
}
function openEditor(account?: ManagedUser) {
  editing.value = account?.id ?? null
  Object.assign(form, { username: account?.username ?? '', display_name: account?.display_name ?? '', email: account?.email ?? '', role: account?.role ?? 'publik', active: account?.active ?? true, password: '' })
  editorOpen.value = true; resetTarget.value = null; error.value = ''; notice.value = ''
}
async function saveUser() {
  await perform(async () => {
    await $fetch(editing.value ? `/api/management/users/${editing.value}` : '/api/management/users', { method: editing.value ? 'PATCH' : 'POST', body: form })
    editorOpen.value = false; form.password = ''
    await load(); notice.value = 'Akun berhasil disimpan.'
  })
}
async function doReset() {
  await perform(async () => {
    await $fetch(`/api/management/users/${resetTarget.value!.id}/password`, { method: 'POST', body: { password: resetPassword.value } })
    const own = resetTarget.value!.id === user.value?.id
    resetPassword.value = ''; resetTarget.value = null
    if (own) { await fetchMe(); await navigateTo('/login'); return }
    await load(); notice.value = 'Password diganti dan seluruh sesi akun dicabut.'
  })
}
async function doRevoke() {
  await perform(async () => {
    const own = pendingRevoke.value!.id === user.value?.id
    await $fetch(`/api/management/users/${pendingRevoke.value!.id}/sessions`, { method: 'POST', body: {} })
    pendingRevoke.value = null
    if (own) { await fetchMe(); await navigateTo('/login'); return }
    await load(); notice.value = 'Seluruh sesi akun dicabut.'
  })
}
onMounted(() => perform(load))
</script>

<template>
  <div class="space-y-8">
    <AccountNavigation v-if="initialized" />
    <header class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p class="mb-2 text-sm font-semibold text-klh-green-700">Administrasi PPEPD</p>
        <h1 class="font-display text-[2rem] font-bold text-ink-900">Manajemen sistem</h1>
        <p class="mt-2 max-w-prose text-ink-500">Kelola akun, role, dan hak akses dalam satu tempat.</p>
        <p v-if="setupStatus?.storage === 'postgres'" class="mt-2 text-sm text-klh-green-700">Penyimpanan akun: PostgreSQL</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="rounded-full border border-info-line bg-info-bg px-3 py-2 text-sm text-info">Lingkungan development</span>
        <NuxtLink v-if="initialized" to="/account/security" class="btn btn-outline">Keamanan akun</NuxtLink>
      </div>
    </header>
    <p v-if="error" role="alert" class="rounded-xl border border-danger-line bg-danger-bg p-4 text-danger">{{ error }}</p>
    <p v-if="notice" role="status" class="rounded-xl border border-success-line bg-success-bg p-4 text-success">{{ notice }}</p>

    <section v-if="!initialized" class="klh-card mx-auto max-w-xl p-6 md:p-8">
      <h2 class="font-display text-2xl font-bold text-ink-900">Buat administrator pertama</h2>
      <p class="mt-2 mb-6 text-ink-500">Tentukan akun Anda untuk mulai mengelola sistem. Pengaturan ini hanya tersedia dari komputer yang menjalankan server.</p>
      <form class="space-y-4" @submit.prevent="createAdmin">
        <div><label for="setup-name" class="mb-1 block text-sm font-semibold">Nama lengkap</label><input id="setup-name" v-model="setup.display_name" required maxlength="100" autocomplete="name" class="klh-input" :disabled="busy"></div>
        <div><label for="setup-username" class="mb-1 block text-sm font-semibold">Username</label><input id="setup-username" v-model="setup.username" required minlength="3" maxlength="50" pattern="[a-zA-Z0-9][a-zA-Z0-9._-]{2,49}" autocomplete="username" class="klh-input" :disabled="busy"></div>
        <div><label for="setup-email" class="mb-1 block text-sm font-semibold">Email (opsional)</label><input id="setup-email" v-model="setup.email" type="email" maxlength="254" autocomplete="email" class="klh-input" :disabled="busy"></div>
        <div><label for="setup-password" class="mb-1 block text-sm font-semibold">Password</label><input id="setup-password" v-model="setup.password" type="password" required minlength="12" maxlength="128" autocomplete="new-password" class="klh-input" aria-describedby="password-help" :disabled="busy"><p id="password-help" class="mt-1 text-sm text-ink-500">Gunakan 12–128 karakter. Frasa panjang mudah diingat.</p></div>
        <div><label for="setup-confirm" class="mb-1 block text-sm font-semibold">Konfirmasi password</label><input id="setup-confirm" v-model="setup.confirmation" type="password" required minlength="12" maxlength="128" autocomplete="new-password" class="klh-input" :disabled="busy"></div>
        <button class="btn btn-primary w-full" :disabled="busy">{{ busy ? 'Menyiapkan…' : 'Buat admin dan masuk' }}</button>
      </form>
    </section>

    <template v-else>
      <div class="grid gap-4 md:grid-cols-3">
        <article v-for="item in [{ label: 'Total akun', value: stats.users }, { label: 'Akun aktif', value: stats.active }, { label: 'Sesi aktif', value: stats.sessions }]" :key="item.label" class="klh-card p-6">
          <p class="text-sm text-ink-500">{{ item.label }}</p><p class="mt-2 font-display text-3xl font-bold text-klh-green-700">{{ item.value }}</p>
        </article>
      </div>
      <nav class="flex flex-wrap gap-2 border-b border-line pb-4" aria-label="Bagian manajemen">
        <button v-if="can('users.manage')" class="btn" :class="tab === 'users' ? 'btn-primary' : 'btn-outline'" :aria-pressed="tab === 'users'" @click="tab = 'users'">Akun pengguna</button>
        <NuxtLink v-if="can('roles.manage')" to="/admin/roles" class="btn btn-outline">Roles &amp; hak akses</NuxtLink>
        <button v-if="can('audit.view')" class="btn" :class="tab === 'audit' ? 'btn-primary' : 'btn-outline'" :aria-pressed="tab === 'audit'" @click="tab = 'audit'">Log aktivitas</button>
      </nav>

      <section v-if="tab === 'users' && can('users.manage')" class="space-y-6">
        <div class="flex flex-col gap-3 md:flex-row md:items-end">
          <div class="flex-grow"><label for="user-search" class="mb-1 block text-sm font-semibold">Cari akun</label><input id="user-search" v-model="search" type="search" placeholder="Nama, username, atau email" class="klh-input"></div>
          <div><label for="role-filter" class="mb-1 block text-sm font-semibold">Role</label><select id="role-filter" v-model="roleFilter" class="klh-input"><option value="">Semua role</option><option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option></select></div>
          <button class="btn btn-primary" :disabled="busy" @click="openEditor()">Tambah akun</button>
        </div>

        <section v-if="editorOpen" class="klh-card p-6" aria-labelledby="editor-title">
          <h2 id="editor-title" class="mb-5 font-display text-xl font-bold">{{ editing ? 'Ubah akun' : 'Tambah akun baru' }}</h2>
          <form @submit.prevent="saveUser">
            <fieldset :disabled="busy" class="grid gap-4 md:grid-cols-2">
              <div><label for="user-name" class="mb-1 block text-sm font-semibold">Nama lengkap</label><input id="user-name" v-model="form.display_name" required maxlength="100" class="klh-input"></div>
              <div><label for="user-username" class="mb-1 block text-sm font-semibold">Username</label><input id="user-username" v-model="form.username" required minlength="3" maxlength="50" class="klh-input"></div>
              <div><label for="user-email" class="mb-1 block text-sm font-semibold">Email (opsional)</label><input id="user-email" v-model="form.email" type="email" maxlength="254" class="klh-input"></div>
              <div><label for="user-role" class="mb-1 block text-sm font-semibold">Role</label><select id="user-role" v-model="form.role" class="klh-input" :disabled="editing === user?.id"><option v-for="role in roles.filter(r => user?.roles.includes('admin') || r.id !== 'admin')" :key="role.id" :value="role.id">{{ role.name }}</option></select></div>
              <div v-if="!editing"><label for="user-password" class="mb-1 block text-sm font-semibold">Password awal (minimal 12 karakter)</label><input id="user-password" v-model="form.password" required type="password" minlength="12" maxlength="128" autocomplete="new-password" class="klh-input"></div>
              <label class="flex min-h-[44px] items-center gap-3"><input v-model="form.active" type="checkbox" :disabled="editing === user?.id" class="h-5 w-5 accent-klh-green-600">Akun aktif</label>
              <div class="flex gap-3 md:col-span-2"><button class="btn btn-primary">Simpan akun</button><button type="button" class="btn btn-outline" @click="editorOpen = false; form.password = ''">Batal</button></div>
            </fieldset>
          </form>
        </section>

        <section v-if="resetTarget" class="klh-card border-warning-line p-6" aria-labelledby="reset-title">
          <h2 id="reset-title" class="text-xl font-bold">Reset password: {{ resetTarget.username }}</h2>
          <p class="mt-2 text-ink-500">Seluruh sesi akun akan dicabut. Sampaikan password baru kepada pengguna melalui saluran pribadi.</p>
          <form class="mt-4 space-y-4" @submit.prevent="doReset"><label for="reset-password" class="block text-sm font-semibold">Password baru</label><input id="reset-password" v-model="resetPassword" required type="password" minlength="12" maxlength="128" autocomplete="new-password" class="klh-input max-w-md" :disabled="busy"><div class="flex gap-3"><button class="btn btn-primary" :disabled="busy">Ganti password</button><button type="button" class="btn btn-outline" :disabled="busy" @click="resetTarget = null; resetPassword = ''">Batal</button></div></form>
        </section>

        <section v-if="pendingRevoke" class="klh-card p-6" aria-labelledby="revoke-title"><h2 id="revoke-title" class="text-xl font-bold">Cabut semua sesi {{ pendingRevoke.username }}?</h2><p class="mt-2 text-ink-500">Pengguna perlu masuk kembali pada semua perangkat.</p><div class="mt-4 flex gap-3"><button class="btn btn-danger" :disabled="busy" @click="doRevoke">Cabut sesi</button><button class="btn btn-outline" :disabled="busy" @click="pendingRevoke = null">Batal</button></div></section>

        <div class="space-y-3">
          <article v-for="account in filteredUsers" :key="account.id" class="klh-card flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div class="min-w-0"><h3 class="break-words text-lg font-bold text-ink-900">{{ account.display_name }} <span v-if="account.id === user?.id" class="text-sm font-normal text-ink-500">(Anda)</span></h3><p class="break-words text-sm text-ink-500">{{ account.username }}<template v-if="account.email"> · {{ account.email }}</template></p><p class="mt-2 text-xs text-ink-500">Terakhir masuk: {{ formatDate(account.last_login) }}</p></div>
            <div class="flex flex-wrap items-center gap-2"><span class="rounded-full bg-surface-2 px-3 py-1 text-sm text-ink-700">{{ roleName(account.role) }}</span><span class="rounded-full px-3 py-1 text-sm" :class="account.active ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'">{{ account.active ? 'Aktif' : 'Nonaktif' }}</span><template v-if="account.role !== 'admin' || user?.roles.includes('admin')"><button class="btn btn-outline" :disabled="busy" @click="openEditor(account)">Ubah</button><button class="btn btn-outline" :disabled="busy" @click="resetTarget = account; resetPassword = ''; editorOpen = false">Reset password</button><button class="btn btn-ghost" :disabled="busy" @click="pendingRevoke = account">Cabut sesi</button></template></div>
          </article>
          <p v-if="!filteredUsers.length && !busy" class="py-8 text-center text-ink-500">Tidak ada akun yang sesuai pencarian.</p>
        </div>
      </section>

      <section v-if="tab === 'audit' && can('audit.view')" class="space-y-4">
        <div class="flex items-center justify-between gap-3"><h2 class="font-display text-xl font-bold">Aktivitas terbaru</h2><button class="btn btn-outline" :disabled="busy" @click="perform(load)">Muat ulang</button></div>
        <p class="text-sm text-ink-500">Menampilkan hingga 200 aktivitas terbaru. Waktu ditampilkan dalam WIB.</p>
        <ol class="space-y-3"><li v-for="entry in logs" :key="entry.id" class="klh-card flex flex-col gap-2 p-4 md:flex-row md:justify-between"><div><p class="font-semibold">{{ actionNames[entry.action] ?? entry.action }}</p><p class="break-words text-sm text-ink-500">{{ entry.actor }} → {{ entry.target }}</p></div><time class="shrink-0 text-sm text-ink-500" :datetime="entry.at">{{ formatDate(entry.at) }}</time></li></ol>
        <p v-if="!logs.length" class="py-8 text-center text-ink-500">Belum ada aktivitas.</p>
      </section>
    </template>
  </div>
</template>
