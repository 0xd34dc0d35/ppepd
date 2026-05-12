<template>
  <div class="container mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6">Sitemap</h1>
    <ul class="space-y-2">
      <li v-for="page in pages" :key="page.path">
        <NuxtLink :to="page.path" class="text-blue-600 hover:underline">
          {{ page.title || page.path }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { data: pages } = await useAsyncData('sitemap', () =>
  queryCollection('content')
    .order('stem', 'ASC')
    .all()
)
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
