<script setup>
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Profil Saya | PPEPD', robots: 'noindex' })
</script>
<template>
  <section class="mx-auto max-w-prose">
    <h1 class="text-[2rem] font-bold">Profil saya</h1>
    <p class="mb-8 mt-3 text-ink-500">Kelola informasi profil dan keamanan akun Anda.</p>
    <AccountSettings />
    <NuxtLink to="/apps" class="btn btn-outline mt-6">Buka aplikasi PPEPD →</NuxtLink>
  </section>
</template>
