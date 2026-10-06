<script setup>
defineProps({ title: { type: String, required: true }, ecosystem: { type: String, required: true }, dashboard: { type: String, required: true } })
</script>

<template>
  <section>
    <NuxtLink to="/apps" class="inline-flex min-h-11 items-center text-sm font-semibold text-klh-blue-600 hover:underline">← Semua aplikasi</NuxtLink>
    <h1 class="mt-4 text-[2rem] font-bold">{{ title }}</h1>
    <p class="mt-3 text-ink-500">Pilih subaplikasi untuk mengelola dan meninjau data {{ ecosystem }}.</p>
    <h2 class="mb-6 mt-8 text-xl font-bold">Subaplikasi</h2>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      <NuxtLink v-if="ecosystem === 'danau'" to="/danau/profil" class="klh-card flex items-start gap-4 p-6 hover:border-klh-green-600">
        <AppAvatar to="/danau/profil" name="Basis Data Profil Danau" />
        <div><h3 class="text-lg font-bold">Basis Data Profil Danau</h3><p class="mt-2 text-sm text-ink-500">Kelola identitas, lokasi, koordinat, luas, kedalaman, volume, dan status danau.</p></div>
      </NuxtLink>
      <NuxtLink v-if="ecosystem === 'mata air'" to="/mataair/profil" class="klh-card flex items-start gap-4 p-6 hover:border-klh-green-600">
        <AppAvatar to="/mataair/profil" name="Basis Data Profil Mata Air" />
        <div><h3 class="text-lg font-bold">Basis Data Profil Mata Air</h3><p class="mt-2 text-sm text-ink-500">Kelola identitas, lokasi, koordinat, debit, dan status mata air.</p></div>
      </NuxtLink>
      <NuxtLink :to="dashboard" class="klh-card flex items-start gap-4 p-6 hover:border-klh-green-600">
        <AppAvatar :to="dashboard" name="Dashboard" />
        <div class="min-w-0"><h3 class="text-lg font-bold">Dashboard</h3><p class="mt-2 text-sm text-ink-500">Tinjau ringkasan dan visualisasi data {{ ecosystem }}.</p></div>
      </NuxtLink>
    </div>
    <p class="mt-6 text-sm text-ink-500">Subaplikasi manajemen lainnya akan ditambahkan pada halaman ini sesuai fitur yang tersedia.</p>
  </section>
</template>
