<script setup>
definePageMeta({ middleware: ['auth', 'dashboard'] })
useSeoMeta({ title: 'Manajemen Data Mata Air | PPEPD', robots: 'noindex' })
</script>
<template>
  <DataManagementHub title="Manajemen Data Mata Air" ecosystem="mata air" dashboard="/mataair/dashboard" />
</template>
