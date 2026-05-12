<template>
  <div class="container mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6">Sitemap</h1>
    <ul class="space-y-2">
      <li v-for="page in pages" :key="page._path">
        <NuxtLink :to="page._path" class="text-blue-600 hover:underline">
          {{ page.title || page._path }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData } from '#app'
import { queryContent } from '@nuxt/content'

const { data: pages } = await useAsyncData('sitemap', () =>
  queryContent()
    .where({ _extension: 'md' })
    .sort({ order: 1 })
    .fetch()
)
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
