<script setup lang="ts">
const props = defineProps<{
  item: {
    id: number
    title: string
    year: number
    image: string
    author: string
    views: number
    metadata: {
      format: string
      category: string
      size: string
      tags: string[]
    }
  }
}>()

function formatViews(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return n.toString()
}
</script>

<template>
  <div class="group bg-white rounded-md border border-line hover:border-klh-green-200 hover:shadow-klh-3 transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer">
    <!-- Illustration / Image -->
    <div class="relative aspect-[16/8] overflow-hidden bg-surface-bg/50">
      <img 
        :src="item.image" 
        :alt="item.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-klh-green-800/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-4">
        <div class="flex items-center gap-2">
          <span class="text-white text-[11px] font-bold uppercase tracking-widest">
            Tahun {{ item.year }}
          </span>
          <span class="flex items-center gap-1 text-white/80 text-[11px] font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            {{ formatViews(item.views) }}
          </span>
        </div>
        <span class="text-on-orange text-[11px] font-bold uppercase tracking-widest bg-klh-orange-500 px-3 py-1.5 rounded-lg shadow-klh-3">
          Lihat Detail
        </span>
      </div>
      <div class="absolute top-4 right-4 flex gap-2">
        <span class="px-3 py-1.5 rounded-lg bg-surface text-klh-green-600 text-[11px] font-bold uppercase tracking-wider shadow-klh-2">
          {{ item.metadata.format }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-grow">
      <!-- Header Row -->
      <div class="flex justify-between items-start mb-2">
        <span class="text-[11px] font-bold text-klh-green-600 uppercase tracking-tight">{{ item.metadata.category }}</span>
        <span class="text-ink-500 text-[11px] font-bold">{{ item.year }}</span>
      </div>

      <!-- Title -->
      <h3 class="text-sm font-bold text-klh-green-800 mb-2 group-hover:text-klh-green-600 transition-colors leading-snug line-clamp-2">
        {{ item.title }}
      </h3>
      
      <!-- Author -->
      <p class="text-[11px] text-ink-500 font-medium mb-3 line-clamp-1">
        Oleh: <span class="text-ink-700 font-semibold">{{ item.author }}</span>
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1">
        <span 
          v-for="tag in item.metadata.tags.slice(0, 3)" 
          :key="tag"
          class="px-2 py-0.5 rounded-full bg-surface-bg border border-line text-ink-500 text-[11px] font-bold"
        >
          #{{ tag }}
        </span>
        <span 
          v-if="item.metadata.tags.length > 3"
          class="px-2 py-0.5 rounded-full bg-klh-green-600/5 text-klh-green-600 text-[11px] font-bold"
        >
          +{{ item.metadata.tags.length - 3 }}
        </span>
      </div>
    </div>
  </div>
</template>
