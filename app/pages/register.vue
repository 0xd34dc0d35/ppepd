<script setup lang="ts">
definePageMeta({ layout: false })

const { isLoggedIn, login } = useAuth()
const { apiFetch } = useApi()
const router = useRouter()

if (isLoggedIn.value) {
  await navigateTo('/')
}

const formToken = ref('')
const tokenLoading = ref(true)
const submitting = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const username = ref('')
const email = ref('')
const displayName = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const consent = ref(false)

const passwordMismatch = computed(
  () => !!confirmPassword.value && password.value !== confirmPassword.value
)

const isFormValid = computed(
  () =>
    username.value.trim() &&
    password.value.length >= 6 &&
    password.value === confirmPassword.value &&
    consent.value &&
    formToken.value
)

const fetchFormToken = async () => {
  try {
    const res = await apiFetch<{ success: boolean; token: string }>('/auth/formtoken')
    formToken.value = res.token
  } catch {
    errorMsg.value = 'Gagal memuat formulir. Coba muat ulang halaman.'
  }
}

onMounted(async () => {
  await fetchFormToken()
  tokenLoading.value = false
})

const handleRegister = async () => {
  if (!isFormValid.value || submitting.value) return
  submitting.value = true
  errorMsg.value = ''

  try {
    await apiFetch<{ ok: boolean }>('/auth/register-visitor', {
      method: 'POST',
      body: {
        username: username.value.trim(),
        password: password.value,
        ...(email.value.trim() ? { email: email.value.trim() } : {}),
        ...(displayName.value.trim() ? { display_name: displayName.value.trim() } : {}),
        persetujuan: true,
        formToken: formToken.value,
        role: 'user',
      },
    })
    successMsg.value = 'Registrasi berhasil! Sedang masuk ke akun Anda…'
    await login(username.value.trim(), password.value)
    await navigateTo('/my-profiles')
  } catch (err: any) {
    errorMsg.value =
      err?.data?.message || err?.message || 'Registrasi gagal. Silakan coba kembali.'
    if (err?.data?.statusCode === 401) {
      await fetchFormToken()
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <KlhAuthShell title="Bergabung dengan PPEPD" message="Daftarkan akun untuk mengakses data dan fitur khusus pengguna terdaftar.">
      <div class="w-full max-w-sm">

        <!-- Loading token skeleton -->
        <div v-if="tokenLoading" class="rounded-2xl border border-line bg-surface shadow-klh-2 p-8 flex flex-col items-center gap-4">
          <div class="w-8 h-8 rounded-full border-2 border-klh-green-200 border-t-klh-green-600 animate-spin"></div>
          <p class="text-sm text-ink-500 font-medium">Memuat formulir…</p>
        </div>

        <!-- Form card -->
        <div v-else class="rounded-2xl border border-line bg-surface shadow-klh-2 p-8">

          <!-- Title -->
          <div class="mb-7">
            <h1 class="text-2xl font-bold text-klh-green-800 tracking-tight">Daftar Akun</h1>
            <p class="text-sm text-ink-500 font-medium mt-1">Buat akun untuk mengakses fitur pengguna terdaftar</p>
          </div>

          <!-- Success alert -->
          <Transition name="fade">
            <div
              v-if="successMsg"
              class="mb-5 px-4 py-3 rounded-xl bg-klh-green-50 border border-klh-green-100 text-klh-green-700 text-sm font-medium flex items-start gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {{ successMsg }}
            </div>
          </Transition>

          <!-- Error alert -->
          <Transition name="fade">
            <div
              v-if="errorMsg"
              class="mb-5 px-4 py-3 rounded-xl bg-danger-bg border border-danger-bg text-danger text-sm font-medium flex items-start gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              {{ errorMsg }}
            </div>
          </Transition>

          <!-- Form -->
          <form @submit.prevent="handleRegister" class="space-y-4" :class="{ 'pointer-events-none opacity-50': !!successMsg }">

            <!-- Username -->
            <div class="space-y-1.5">
              <label for="reg-username" class="text-sm font-semibold text-ink-700">
                Username <span class="text-danger">*</span>
              </label>
              <input
                id="reg-username"
                  v-model="username"
                type="text"
                autocomplete="username"
                placeholder="Masukkan username"
                :disabled="submitting"
                class="klh-input"
              />
            </div>

            <!-- Nama tampilan -->
            <div class="space-y-1.5">
              <label for="reg-name" class="text-sm font-semibold text-ink-700">
                Nama Lengkap
                <span class="font-normal text-ink-500">(opsional)</span>
              </label>
              <input
                id="reg-name"
                  v-model="displayName"
                type="text"
                autocomplete="name"
                placeholder="Nama yang ditampilkan"
                :disabled="submitting"
                class="klh-input"
              />
            </div>

            <!-- Email -->
            <div class="space-y-1.5">
              <label for="reg-email" class="text-sm font-semibold text-ink-700">
                Email
                <span class="font-normal text-ink-500">(opsional)</span>
              </label>
              <input
                id="reg-email"
                  v-model="email"
                type="email"
                autocomplete="email"
                placeholder="alamat@email.com"
                :disabled="submitting"
                class="klh-input"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label for="reg-password" class="text-sm font-semibold text-ink-700">
                Password <span class="text-danger">*</span>
              </label>
              <div class="relative">
                <input
                  id="reg-password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Min. 6 karakter"
                  :disabled="submitting"
                  class="klh-input pr-12"
                />
                <button
                  type="button"
                  class="absolute right-1 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-ink-500 hover:text-klh-green-700"
                  :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                  :aria-pressed="showPassword"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                </button>
              </div>
            </div>

            <!-- Konfirmasi password -->
            <div class="space-y-1.5">
              <label for="reg-confirm" class="text-sm font-semibold text-ink-700">
                Konfirmasi Password <span class="text-danger">*</span>
              </label>
              <div class="relative">
                <input
                  id="reg-confirm"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Ulangi password"
                  :disabled="submitting"
                  class="klh-input pr-12"
                  :aria-invalid="passwordMismatch"
                  aria-describedby="reg-confirm-err"
                />
                <button
                  type="button"
                  class="absolute right-1 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-ink-500 hover:text-klh-green-700"
                  :aria-label="showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                  :aria-pressed="showConfirmPassword"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                </button>
              </div>
              <Transition name="fade">
                <p v-if="passwordMismatch" id="reg-confirm-err" class="text-xs text-danger font-medium px-1">
                  Password tidak cocok
                </p>
              </Transition>
            </div>

            <!-- Persetujuan -->
            <label class="flex items-start gap-3 cursor-pointer group pt-1">
              <div class="relative mt-0.5 shrink-0">
                <input
                  v-model="consent"
                  type="checkbox"
                  class="sr-only peer"
                  :disabled="submitting"
                />
                <div
                  :class="[
                    'w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center',
                    consent
                      ? 'bg-klh-green-800 border-klh-green-800'
                      : 'bg-white border-line group-hover:border-klh-green-200'
                  ]"
                >
                  <svg v-if="consent" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
              <span class="text-xs text-ink-500 font-medium leading-relaxed">
                Saya menyetujui penggunaan data pribadi saya sesuai kebijakan privasi PPEPD dan bersedia mematuhi ketentuan penggunaan layanan.
              </span>
            </label>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="!isFormValid || submitting"
              class="btn btn-primary mt-1 w-full"
            >
              <svg v-if="submitting" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              {{ submitting ? 'Mendaftarkan…' : 'Daftar Sekarang' }}
            </button>
          </form>
        </div>

        <!-- Login link -->
        <p class="text-center mt-6 text-sm text-ink-500 font-medium space-x-1">
          <span>Sudah punya akun?</span>
          <NuxtLink to="/login" class="font-semibold text-klh-blue-600 hover:underline">Masuk</NuxtLink>
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
