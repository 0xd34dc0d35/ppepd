<script setup>
definePageMeta({ middleware: ['auth', 'dashboard'] })
useSeoMeta({ title: 'Manajemen Data Danau | PPEPD', robots: 'noindex' })
</script>
<template>
  <DataManagementHub title="Manajemen Data Danau" ecosystem="danau" dashboard="/danau/dashboard" />
</template>
