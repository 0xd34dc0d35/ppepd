<script setup lang="ts">
const { user, fetchMe } = useAuth()
const { apiFetch } = useApi()
const localManagement = useRuntimeConfig().public.localManagement
const tab = ref<'profile' | 'password'>('profile')
const profile = reactive({ display_name: user.value?.display_name ?? '', institution: user.value?.institution ?? '', organisation_name: user.value?.organisation_name ?? '' })
const passwords = reactive({ currentPassword: '', password: '', confirmation: '' })
const busy = ref(false)
const error = ref('')
const notice = ref('')
const showPassword = ref(false)
watch(tab, () => { error.value = ''; notice.value = ''; showPassword.value = false; Object.assign(passwords, { currentPassword: '', password: '', confirmation: '' }) })
async function submit() {
  if (busy.value || !localManagement) return
  busy.value = true; error.value = ''; notice.value = ''
  try {
    if (tab.value === 'profile') {
      const response = await apiFetch<{ user: AuthUser }>('/auth/profile', { method: 'PATCH', body: profile })
      user.value = response.user
      Object.assign(profile, { display_name: response.user.display_name ?? '', institution: response.user.institution ?? '', organisation_name: response.user.organisation_name ?? '' })
      notice.value = 'Profil berhasil diperbarui.'
    } else {
      if (passwords.password !== passwords.confirmation) throw { data: { statusMessage: 'Konfirmasi password tidak sesuai' } }
      await apiFetch('/auth/password', { method: 'POST', body: { currentPassword: passwords.currentPassword, password: passwords.password } })
      Object.assign(passwords, { currentPassword: '', password: '', confirmation: '' })
      showPassword.value = false
      notice.value = 'Password berhasil diubah. Sesi pada perangkat lain telah dicabut.'
    }
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Perubahan belum tersimpan. Silakan coba kembali.'
    if ([401, 403].includes(err?.statusCode ?? err?.status)) { await fetchMe(); await navigateTo('/login?redirect=/my-profiles') }
  } finally { busy.value = false }
}
</script>
<template>
  <section class="klh-card w-full min-w-0 p-4 text-ink-900 sm:p-6" aria-labelledby="account-settings-title">
    <h2 id="account-settings-title" class="font-display text-2xl font-bold">Pengaturan akun</h2>
    <div class="my-5 grid grid-cols-2 gap-2" role="group" aria-label="Pengaturan akun">
      <button type="button" class="btn min-h-[44px]" :class="tab === 'profile' ? 'btn-primary' : 'btn-outline'" :aria-pressed="tab === 'profile'" :disabled="busy" @click="tab = 'profile'">Profil</button>
      <button type="button" class="btn min-h-[44px]" :class="tab === 'password' ? 'btn-primary' : 'btn-outline'" :aria-pressed="tab === 'password'" :disabled="busy" @click="tab = 'password'">Password</button>
    </div>
    <p v-if="error" role="alert" class="mb-4 rounded-lg bg-danger-bg p-3 text-sm text-danger">{{ error }}</p>
    <p v-if="notice" role="status" class="mb-4 rounded-lg bg-success-bg p-3 text-sm text-success">{{ notice }}</p>
    <p v-if="!localManagement" class="mb-4 text-sm text-ink-500">Pengaturan akun tersedia pada sistem manajemen PPEPD.</p>
    <form @submit.prevent="submit">
      <fieldset :disabled="busy || !localManagement" class="min-w-0 space-y-4">
        <template v-if="tab === 'profile'">
          <div><label for="profile-username" class="mb-1 block text-sm font-semibold">Username</label><input id="profile-username" :value="user?.username" readonly class="klh-input bg-surface-2" aria-describedby="username-help"><p id="username-help" class="mt-1 text-sm text-ink-500">Username akun tidak dapat diubah.</p></div>
          <div><label for="profile-email" class="mb-1 block text-sm font-semibold">Email</label><input id="profile-email" :value="user?.email ?? ''" readonly placeholder="Belum tercatat" class="klh-input bg-surface-2" aria-describedby="email-help"><p id="email-help" class="mt-1 text-sm text-ink-500">Email tidak dapat diubah dari halaman profil.</p></div>
          <div><label for="profile-name" class="mb-1 block text-sm font-semibold">Nama lengkap</label><input id="profile-name" v-model="profile.display_name" required maxlength="100" autocomplete="name" class="klh-input"></div>
          <div><label for="profile-institution" class="mb-1 block text-sm font-semibold">Instansi (opsional)</label><input id="profile-institution" v-model="profile.institution" maxlength="150" autocomplete="organization" class="klh-input"></div>
          <div><label for="profile-organisation" class="mb-1 block text-sm font-semibold">Organisasi (opsional)</label><input id="profile-organisation" v-model="profile.organisation_name" maxlength="150" class="klh-input"></div>
        </template>
        <template v-else>
          <p class="text-sm text-ink-500">Masukkan password saat ini untuk menggantinya. Gunakan password baru sepanjang 12–128 karakter.</p>
          <div><label for="account-current-password" class="mb-1 block text-sm font-semibold">Password saat ini</label><input id="account-current-password" v-model="passwords.currentPassword" :type="showPassword ? 'text' : 'password'" required maxlength="128" autocomplete="current-password" class="klh-input"></div>
          <div><label for="account-new-password" class="mb-1 block text-sm font-semibold">Password baru</label><input id="account-new-password" v-model="passwords.password" :type="showPassword ? 'text' : 'password'" required minlength="12" maxlength="128" autocomplete="new-password" class="klh-input"></div>
          <div><label for="account-confirm-password" class="mb-1 block text-sm font-semibold">Konfirmasi password baru</label><input id="account-confirm-password" v-model="passwords.confirmation" :type="showPassword ? 'text' : 'password'" required minlength="12" maxlength="128" autocomplete="new-password" class="klh-input" :aria-invalid="!!passwords.confirmation && passwords.password !== passwords.confirmation"></div>
          <label class="flex min-h-[44px] items-center gap-3 text-sm"><input v-model="showPassword" type="checkbox" class="h-5 w-5">Tampilkan password</label>
        </template>
        <button type="submit" class="btn btn-primary min-h-[44px] w-full">{{ busy ? 'Menyimpan…' : tab === 'profile' ? 'Simpan profil' : 'Simpan password' }}</button>
      </fieldset>
    </form>
  </section>
</template>
