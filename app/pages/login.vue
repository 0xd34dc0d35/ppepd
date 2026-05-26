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
  <div class="min-h-screen flex flex-col relative overflow-hidden bg-brand-cream">
    <!-- Background gradients -->
    <div class="fixed inset-0 -z-10">
      <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-green/5 blur-[150px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/5 blur-[150px] animate-pulse" style="animation-delay: 3s"></div>
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
        <!-- Card -->
        <div class="bg-white/80 backdrop-blur-xl border border-brand-green/10 rounded-[28px] shadow-xl shadow-brand-green/5 p-8">
          <!-- Title -->
          <div class="mb-8">
            <h1 class="text-2xl font-black text-brand-green-dark tracking-tight">Masuk</h1>
            <p class="text-sm text-brand-charcoal/50 font-medium mt-1">Akses fitur khusus pengguna terdaftar</p>
          </div>

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
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Username -->
            <div class="space-y-1.5">
              <label class="text-xs font-black uppercase tracking-widest text-brand-charcoal/50">Username</label>
              <input
                v-model="username"
                type="text"
                autocomplete="username"
                placeholder="Masukkan username"
                :disabled="loading"
                class="w-full px-4 py-3 rounded-xl border border-brand-green/15 bg-white text-brand-charcoal text-sm font-medium placeholder:text-brand-charcoal/30 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/40 transition-all disabled:opacity-50"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label class="text-xs font-black uppercase tracking-widest text-brand-charcoal/50">Password</label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Masukkan password"
                  :disabled="loading"
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

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading || !username || !password"
              class="w-full mt-2 py-3 px-6 rounded-xl bg-brand-green-dark text-white text-sm font-black uppercase tracking-widest hover:bg-brand-green transition-all shadow-lg shadow-brand-green/15 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="loading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              {{ loading ? 'Memproses...' : 'Masuk' }}
            </button>
          </form>
        </div>

        <!-- Links -->
        <div class="flex items-center justify-between mt-6 text-sm font-medium">
          <NuxtLink to="/" class="text-brand-charcoal/40 hover:text-brand-green transition-colors">← Beranda</NuxtLink>
          <p class="text-brand-charcoal/40 space-x-1">
            <span>Belum punya akun?</span>
            <NuxtLink to="/register" class="text-brand-green-dark font-bold hover:text-brand-green transition-colors">Daftar</NuxtLink>
          </p>
        </div>
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
