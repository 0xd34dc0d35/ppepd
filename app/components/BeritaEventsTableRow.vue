<script setup lang="ts">
defineProps<{
  item: {
    slug: string
    type: 'berita' | 'events'
    title: string
    date: string
    hero_image: string
    category: string
    author: string
  }
}>()
</script>

<template>
  <NuxtLink
    :to="`/berita-events/${item.slug}`"
    class="group flex items-center px-4 py-3 border-b border-line hover:bg-klh-green-600/5 transition-colors duration-200"
  >
    <!-- Image -->
    <div class="w-20 flex-shrink-0">
      <div class="w-16 h-11 rounded overflow-hidden border border-line bg-surface-bg/50">
        <img :src="item.hero_image" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
      </div>
    </div>

    <!-- Title + author -->
    <div class="flex-1 min-w-0 px-4">
      <p class="text-sm font-bold text-klh-green-800 group-hover:text-klh-green-600 transition-colors line-clamp-1 leading-snug">
        {{ item.title }}
      </p>
      <p class="text-[11px] text-ink-500 font-medium mt-0.5">
        <span :class="[
          'inline-block mr-2 px-1.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider text-white',
          item.type === 'berita' ? 'bg-klh-blue-500/80' : 'bg-klh-orange-500/80'
        ]">{{ item.type === 'berita' ? 'Berita' : 'Event' }}</span>
        {{ item.category }} · {{ item.author }}
      </p>
    </div>

    <!-- Date -->
    <div class="w-32 flex-shrink-0 px-2 text-[11px] font-bold text-ink-500 group-hover:text-klh-green-600 transition-colors">
      {{ item.date }}
    </div>

    <!-- Action -->
    <div class="w-10 flex-shrink-0 flex justify-end">
      <div class="w-8 h-8 rounded-full bg-klh-green-600/8 flex items-center justify-center text-klh-green-600 group-hover:bg-klh-green-600 group-hover:text-white transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </div>
    </div>
  </NuxtLink>
</template>
