<script setup lang="ts">
defineProps<{ dark?: boolean }>()
const { can } = useAuth()
const config = useRuntimeConfig()
const route = useRoute()
const links = computed(() => [
  { to: '/apps', label: 'Aplikasi' },
  { to: '/my-profiles', label: 'Profil saya' },
  ...(config.public.localManagement && (can('users.manage') || can('audit.view')) ? [{ to: '/admin/system', label: 'Manajemen akun' }] : []),
  ...(config.public.localManagement && can('roles.manage') ? [{ to: '/admin/roles', label: 'Roles & hak akses' }] : []),
  { to: '/dokumentasi', label: 'Dokumentasi' },
])
</script>

<template>
  <nav class="account-navigation flex w-full flex-wrap gap-2" :class="{ dark }" aria-label="Navigasi akun">
    <NuxtLink v-for="link in links" :key="link.to" :to="link.to" :aria-current="route.path === link.to ? 'page' : undefined">{{ link.label }}</NuxtLink>
  </nav>
</template>

<style scoped>
.account-navigation a { display: inline-flex; align-items: center; min-height: 44px; padding: .5rem .875rem; border: 1px solid #d1d5db; border-radius: .75rem; font-size: .875rem; font-weight: 600; }
.account-navigation a[aria-current="page"] { background: #166534; color: white; border-color: #166534; }
.account-navigation a:focus-visible { outline: 3px solid #3b82f6; outline-offset: 3px; }
.dark a { border-color: rgba(255,255,255,.25); color: rgba(255,255,255,.85); }
.dark a[aria-current="page"] { background: rgba(255,255,255,.18); border-color: rgba(255,255,255,.4); }
</style>
