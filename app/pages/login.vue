<script setup lang="ts">
definePageMeta({ layout: false })

const { login, isLoggedIn } = useAuth()
const router = useRouter()
const route = useRoute()

if (isLoggedIn.value) {
  await navigateTo((route.query.redirect as string) || '/')
}

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await login(username.value, password.value)
    await navigateTo((route.query.redirect as string) || '/my-profiles')
  } catch (err: any) {
    errorMsg.value = err?.data?.message || err?.message || 'Login gagal. Periksa kembali username dan password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <KlhAuthShell>
    <div class="w-full max-w-sm">
      <div class="rounded-2xl border border-line bg-surface p-8 shadow-klh-2">
        <div class="mb-6">
          <h1 class="text-[2rem] font-bold leading-tight text-ink-900">Masuk</h1>
          <p class="mt-1 text-sm text-ink-500">Akses fitur khusus pengguna terdaftar</p>
        </div>

        <Transition name="fade">
          <div
            v-if="errorMsg"
            role="alert"
            class="mb-5 flex items-start gap-2 rounded-xl border border-danger-line bg-danger-bg px-4 py-3 text-sm text-danger"
          >
            <svg class="icon--sm mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <span><b class="block font-semibold">Gagal masuk</b>{{ errorMsg }}</span>
          </div>
        </Transition>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-1.5">
            <label for="login-username" class="text-sm font-semibold text-ink-700">Username</label>
            <input
              id="login-username"
              v-model="username"
              type="text"
              autocomplete="username"
              placeholder="Masukkan username"
              :disabled="loading"
              class="klh-input"
            />
          </div>

          <div class="space-y-1.5">
            <label for="login-password" class="text-sm font-semibold text-ink-700">Password</label>
            <div class="relative">
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Masukkan password"
                :disabled="loading"
                class="klh-input pr-12"
              />
              <button
                type="button"
                class="absolute right-1 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-ink-500 hover:text-klh-green-700"
                :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="M2 2l20 20"/></svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !username || !password"
            class="btn btn-primary mt-2 w-full"
          >
            <svg v-if="loading" class="icon--sm animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            {{ loading ? 'Memproses…' : 'Masuk' }}
          </button>
        </form>
      </div>

      <p class="mt-6 text-center text-sm text-ink-500">
        Belum punya akun?
        <NuxtLink to="/register" class="font-semibold text-klh-blue-600 hover:underline">Daftar</NuxtLink>
      </p>
    </div>
  </KlhAuthShell>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
