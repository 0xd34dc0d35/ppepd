<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolledPast100vh = ref(false)

const handleScroll = () => {
  // Check if scrolled past 100vh
  if (window.scrollY > window.innerHeight) {
    isScrolledPast100vh.value = true
  } else {
    isScrolledPast100vh.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen flex flex-col relative overflow-x-hidden">
    <!-- Animated Background Gradients -->
    <div class="fixed inset-0 -z-10">
      <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-green/5 blur-[150px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/5 blur-[150px] animate-pulse" style="animation-delay: 3s"></div>
    </div>

    <!-- Navigation -->
    <nav 
      :class="[
        'z-50 h-[50px] w-full transition-colors duration-300',
        isScrolledPast100vh 
          ? 'fixed top-0 animate-slideDown backdrop-blur-xl bg-white/90 border-b border-brand-green/10 shadow-sm' 
          : 'absolute top-0 bg-transparent'
      ]"
    >
      <div class="container mx-auto px-6 h-full flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter gradient-text leading-none">
          PPEPD
        </NuxtLink>
        <div class="flex gap-10 text-sm font-bold tracking-wide uppercase text-brand-charcoal/60">
          <NuxtLink to="/" class="hover:text-brand-green transition-all duration-300">Beranda</NuxtLink>
          <NuxtLink to="/about" class="hover:text-brand-green transition-all duration-300">Tentang</NuxtLink>
          <NuxtLink to="/zona-integritas" class="hover:text-brand-green transition-all duration-300">Zona Integritas</NuxtLink>
          <NuxtLink to="/hubungi" class="hover:text-brand-green transition-all duration-300">Hubungi</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-6 py-12 relative">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-brand-green/5 bg-white/50 py-16">
      <div class="container mx-auto px-6 text-center text-brand-charcoal/40 text-sm font-medium">
        <p class="mb-4">&copy; 2024 Sistem Informasi PPPED. Direktorat Jenderal PPKL - KLHK.</p>
        <div class="flex justify-center gap-6 opacity-60">
          <a href="#" class="hover:text-brand-green transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-brand-green transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply text-brand-green;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
