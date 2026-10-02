<script setup lang="ts">
defineProps<{
  item: {
    slug: string
    type: 'berita' | 'events'
    title: string
    summary: string
    date: string
    hero_image: string
    category: string
    author: string
    tags: string[]
  }
}>()
</script>

<template>
  <NuxtLink :to="`/berita-events/${item.slug}`" class="group block bg-white rounded-md border border-line hover:border-klh-green-200 hover:shadow-klh-3 transition-all duration-500 overflow-hidden flex flex-col h-full">
    <!-- Image -->
    <div class="relative aspect-[16/8] overflow-hidden bg-surface-bg/50">
      <img
        :src="item.hero_image"
        :alt="item.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-klh-green-800/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
        <span class="text-white text-[11px] font-bold uppercase tracking-widest">Baca Selengkapnya →</span>
      </div>
      <div class="absolute top-4 left-4">
        <span :class="[
          'px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-klh-2',
          item.type === 'berita'
            ? 'bg-klh-blue-500/90 backdrop-blur-md text-white'
            : 'bg-klh-orange-500/90 backdrop-blur-md text-on-orange'
        ]">
          {{ item.type === 'berita' ? 'Berita' : 'Event' }}
        </span>
      </div>
      <div class="absolute top-4 right-4">
        <span class="px-2.5 py-1 rounded-lg bg-surface text-klh-green-600 text-[11px] font-bold uppercase tracking-wider shadow-klh-2">
          {{ item.category }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-grow">
      <div class="flex justify-between items-start mb-2">
        <span class="text-[11px] font-bold text-klh-green-600 uppercase tracking-tight">{{ item.category }}</span>
        <span class="text-ink-500 text-[11px] font-bold">{{ item.date }}</span>
      </div>

      <h3 class="text-sm font-bold text-klh-green-800 mb-2 group-hover:text-klh-green-600 transition-colors leading-snug line-clamp-2">
        {{ item.title }}
      </h3>

      <p class="text-[11px] text-ink-500 font-medium mb-3 line-clamp-2 flex-grow">
        {{ item.summary }}
      </p>

      <div class="flex items-center justify-between mt-auto pt-3 border-t border-line">
        <p class="text-[11px] text-ink-500 font-medium line-clamp-1">
          Oleh: <span class="text-ink-700 font-semibold">{{ item.author }}</span>
        </p>
        <div class="flex flex-wrap gap-1 justify-end">
          <span
            v-for="tag in item.tags.slice(0, 2)"
            :key="tag"
            class="px-2 py-0.5 rounded-full bg-surface-bg border border-line text-ink-500 text-[11px] font-bold"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
