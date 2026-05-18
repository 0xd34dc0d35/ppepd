<script setup lang="ts">
defineProps<{
  item: {
    id: string
    type: 'berita' | 'events'
    title: string
    excerpt: string
    date: string
    image: string
    category: string
    author: string
    tags: string[]
  }
}>()
</script>

<template>
  <NuxtLink
    :to="`/berita-events/${item.id}`"
    class="group flex items-center px-4 py-3 border-b border-brand-green/5 hover:bg-brand-green/5 transition-colors duration-200"
  >
    <!-- Image -->
    <div class="w-20 flex-shrink-0">
      <div class="w-16 h-11 rounded overflow-hidden border border-brand-green/10 bg-brand-cream/50">
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
      </div>
    </div>

    <!-- Title -->
    <div class="flex-1 min-w-0 px-4">
      <p class="text-sm font-bold text-brand-green-dark group-hover:text-brand-green transition-colors line-clamp-2 leading-snug">
        {{ item.title }}
      </p>
    </div>

    <!-- Action -->
    <div class="w-10 flex-shrink-0 flex justify-end">
      <div class="w-8 h-8 rounded-full bg-brand-green/8 flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </div>
    </div>
  </NuxtLink>
</template>
