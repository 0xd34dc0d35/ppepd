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
  <div class="min-h-screen flex flex-col relative overflow-hidden bg-brand-cream">
    <!-- Background glow -->
    <div class="fixed inset-0 -z-10">
      <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-green/5 blur-[150px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/5 blur-[150px] animate-pulse" style="animation-delay:3s"></div>
    </div>

    <!-- Header -->
    <header class="absolute top-0 left-0 right-0 z-10 h-[50px] flex items-center px-6">
      <NuxtLink to="/" class="text-2xl font-black tracking-tighter gradient-text leading-none">
        PPEPD
      </NuxtLink>
    </header>

    <!-- Main -->
    <main class="flex-grow flex items-center justify-center px-4 py-20">
      <div class="w-full max-w-sm">

        <!-- Loading token skeleton -->
        <div v-if="tokenLoading" class="bg-white/80 backdrop-blur-xl border border-brand-green/10 rounded-[28px] shadow-xl shadow-brand-green/5 p-8 flex flex-col items-center gap-4">
          <div class="w-8 h-8 rounded-full border-2 border-brand-green/30 border-t-brand-green animate-spin"></div>
          <p class="text-sm text-brand-charcoal/40 font-medium">Memuat formulir…</p>
        </div>

        <!-- Form card -->
        <div v-else class="bg-white/80 backdrop-blur-xl border border-brand-green/10 rounded-[28px] shadow-xl shadow-brand-green/5 p-8">

          <!-- Title -->
          <div class="mb-7">
            <h1 class="text-2xl font-black text-brand-green-dark tracking-tight">Daftar Akun</h1>
            <p class="text-sm text-brand-charcoal/50 font-medium mt-1">Buat akun untuk mengakses fitur pengguna terdaftar</p>
          </div>

          <!-- Success alert -->
          <Transition name="fade">
            <div
              v-if="successMsg"
              class="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-medium flex items-start gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {{ successMsg }}
            </div>
          </Transition>

          <!-- Error alert -->
          <Transition name="fade">
            <div
              v-if="errorMsg"
              class="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-start gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              {{ errorMsg }}
            </div>
          </Transition>

          <!-- Form -->
          <form @submit.prevent="handleRegister" class="space-y-4" :class="{ 'pointer-events-none opacity-50': !!successMsg }">

            <!-- Username -->
            <div class="space-y-1.5">
              <label class="text-xs font-black uppercase tracking-widest text-brand-charcoal/50">
                Username <span class="text-red-400">*</span>
              </label>
              <input
                v-model="username"
                type="text"
                autocomplete="username"
                placeholder="Masukkan username"
                :disabled="submitting"
                class="w-full px-4 py-3 rounded-xl border border-brand-green/15 bg-white text-brand-charcoal text-sm font-medium placeholder:text-brand-charcoal/30 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/40 transition-all disabled:opacity-50"
              />
            </div>

            <!-- Nama tampilan -->
            <div class="space-y-1.5">
              <label class="text-xs font-black uppercase tracking-widest text-brand-charcoal/50">
                Nama Lengkap
                <span class="text-brand-charcoal/30 normal-case font-normal tracking-normal">(opsional)</span>
              </label>
              <input
                v-model="displayName"
                type="text"
                autocomplete="name"
                placeholder="Nama yang ditampilkan"
                :disabled="submitting"
                class="w-full px-4 py-3 rounded-xl border border-brand-green/15 bg-white text-brand-charcoal text-sm font-medium placeholder:text-brand-charcoal/30 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/40 transition-all disabled:opacity-50"
              />
            </div>

            <!-- Email -->
            <div class="space-y-1.5">
              <label class="text-xs font-black uppercase tracking-widest text-brand-charcoal/50">
                Email
                <span class="text-brand-charcoal/30 normal-case font-normal tracking-normal">(opsional)</span>
              </label>
              <input
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="alamat@email.com"
                :disabled="submitting"
                class="w-full px-4 py-3 rounded-xl border border-brand-green/15 bg-white text-brand-charcoal text-sm font-medium placeholder:text-brand-charcoal/30 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/40 transition-all disabled:opacity-50"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label class="text-xs font-black uppercase tracking-widest text-brand-charcoal/50">
                Password <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Min. 6 karakter"
                  :disabled="submitting"
                  class="w-full px-4 py-3 pr-11 rounded-xl border border-brand-green/15 bg-white text-brand-charcoal text-sm font-medium placeholder:text-brand-charcoal/30 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/40 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  tabindex="-1"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-brand-charcoal/30 hover:text-brand-green transition-colors"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                </button>
              </div>
            </div>

            <!-- Konfirmasi password -->
            <div class="space-y-1.5">
              <label class="text-xs font-black uppercase tracking-widest text-brand-charcoal/50">
                Konfirmasi Password <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Ulangi password"
                  :disabled="submitting"
                  :class="[
                    'w-full px-4 py-3 pr-11 rounded-xl border bg-white text-brand-charcoal text-sm font-medium placeholder:text-brand-charcoal/30 focus:outline-none focus:ring-2 transition-all disabled:opacity-50',
                    passwordMismatch
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                      : 'border-brand-green/15 focus:ring-brand-green/20 focus:border-brand-green/40'
                  ]"
                />
                <button
                  type="button"
                  tabindex="-1"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-brand-charcoal/30 hover:text-brand-green transition-colors"
                >
                  <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                </button>
              </div>
              <Transition name="fade">
                <p v-if="passwordMismatch" class="text-xs text-red-500 font-medium px-1">
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
                      ? 'bg-brand-green-dark border-brand-green-dark'
                      : 'bg-white border-brand-green/20 group-hover:border-brand-green/40'
                  ]"
                >
                  <svg v-if="consent" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
              <span class="text-xs text-brand-charcoal/60 font-medium leading-relaxed">
                Saya menyetujui penggunaan data pribadi saya sesuai kebijakan privasi PPEPD dan bersedia mematuhi ketentuan penggunaan layanan.
              </span>
            </label>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="!isFormValid || submitting"
              class="w-full mt-1 py-3 px-6 rounded-xl bg-brand-green-dark text-white text-sm font-black uppercase tracking-widest hover:bg-brand-green transition-all shadow-lg shadow-brand-green/15 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="submitting" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              {{ submitting ? 'Mendaftarkan…' : 'Daftar Sekarang' }}
            </button>
          </form>
        </div>

        <!-- Login link -->
        <p class="text-center mt-6 text-sm text-brand-charcoal/40 font-medium space-x-1">
          <span>Sudah punya akun?</span>
          <NuxtLink to="/login" class="text-brand-green-dark font-bold hover:text-brand-green transition-colors">Masuk</NuxtLink>
        </p>
      </div>
    </main>
  </div>
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
