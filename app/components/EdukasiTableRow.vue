<script setup lang="ts">
defineProps<{
  item: {
    id: string
    type: 'edukasi' | 'campaign'
    title: string
    excerpt: string
    category: string
    image: string
    author: string
    tags: string[]
  }
  index: number
}>()
</script>

<template>
  <NuxtLink :to="`/edukasi/${item.id}`" as="tr" class="group border-b border-brand-green/5 hover:bg-brand-green/5 transition-colors duration-200 cursor-pointer">
    <td class="py-4 px-4 text-brand-charcoal/40 text-xs font-bold w-10">{{ index + 1 }}</td>
    <td class="py-4 px-4 w-16">
      <div class="w-14 h-10 rounded overflow-hidden border border-brand-green/10 flex-shrink-0 bg-brand-cream/50">
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
      </div>
    </td>
    <td class="py-4 px-4">
      <span class="text-sm font-bold text-brand-green-dark group-hover:text-brand-green transition-colors line-clamp-1">{{ item.title }}</span>
    </td>
    <td class="py-4 px-4 text-xs font-bold text-brand-charcoal/50 line-clamp-1">{{ item.author }}</td>
    <td class="py-4 px-4">
      <span class="px-2.5 py-1 rounded-md bg-brand-green/8 text-brand-green text-[10px] font-black uppercase tracking-wider">{{ item.category }}</span>
    </td>
    <td class="py-4 px-4">
      <span :class="[
        'px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider',
        item.type === 'edukasi' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-orange/10 text-brand-orange'
      ]">
        {{ item.type === 'edukasi' ? 'Edukasi' : 'Campaign' }}
      </span>
    </td>
    <td class="py-4 px-4">
      <div class="flex gap-1 flex-wrap">
        <span
          v-for="tag in item.tags.slice(0, 2)"
          :key="tag"
          class="px-2 py-0.5 rounded-full bg-brand-cream border border-brand-green/10 text-brand-charcoal/60 text-[8px] font-bold"
        >
          #{{ tag }}
        </span>
      </div>
    </td>
    <td class="py-4 px-4">
      <div class="w-8 h-8 rounded-full bg-brand-green/8 flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all duration-300 group-hover:shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </div>
    </td>
  </NuxtLink>
</template>
