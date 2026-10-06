<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
if (!useRuntimeConfig().public.localManagement) throw createError({ statusCode: 404, statusMessage: 'Halaman tidak tersedia' })
useSeoMeta({ title: 'Keamanan Akun | PPEPD', robots: 'noindex' })
const form = reactive({ currentPassword: '', password: '', confirmation: '' })
const busy = ref(false)
const error = ref('')
const notice = ref('')
async function save() {
  if (busy.value) return
  busy.value = true; error.value = ''; notice.value = ''
  try {
    if (form.password !== form.confirmation) throw { data: { statusMessage: 'Konfirmasi password tidak sesuai' } }
    await $fetch('/api/management/auth/password', { method: 'POST', body: form })
    Object.assign(form, { currentPassword: '', password: '', confirmation: '' })
    notice.value = 'Password berhasil diubah. Sesi pada perangkat lain sudah dicabut.'
  } catch (err: any) { error.value = err?.data?.statusMessage || 'Password tidak dapat diubah.' }
  finally { busy.value = false }
}
</script>
<template>
  <section class="mx-auto max-w-xl">
    <NuxtLink to="/my-profiles" class="text-klh-blue-600 hover:underline">Kembali ke profil</NuxtLink>
    <h1 class="mt-6 font-display text-[2rem] font-bold">Keamanan akun</h1>
    <p class="mt-2 mb-6 text-ink-500">Ubah password Anda. Sesi pada perangkat lain akan dicabut.</p>
    <p v-if="error" role="alert" class="mb-4 rounded-xl bg-danger-bg p-4 text-danger">{{ error }}</p>
    <p v-if="notice" role="status" class="mb-4 rounded-xl bg-success-bg p-4 text-success">{{ notice }}</p>
    <form class="klh-card space-y-4 p-6" @submit.prevent="save"><fieldset :disabled="busy" class="space-y-4">
      <div><label for="current-password" class="mb-1 block text-sm font-semibold">Password saat ini</label><input id="current-password" v-model="form.currentPassword" required type="password" maxlength="128" autocomplete="current-password" class="klh-input"></div>
      <div><label for="new-password" class="mb-1 block text-sm font-semibold">Password baru (12–128 karakter)</label><input id="new-password" v-model="form.password" required type="password" minlength="12" maxlength="128" autocomplete="new-password" class="klh-input"></div>
      <div><label for="confirm-password" class="mb-1 block text-sm font-semibold">Konfirmasi password baru</label><input id="confirm-password" v-model="form.confirmation" required type="password" minlength="12" maxlength="128" autocomplete="new-password" class="klh-input"></div>
      <button class="btn btn-primary w-full">{{ busy ? 'Menyimpan…' : 'Simpan password' }}</button>
    </fieldset></form>
  </section>
</template>
