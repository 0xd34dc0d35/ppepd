<script setup lang="ts">
defineProps<{
  item: {
    id: number
    title: string
    year: number
    image: string
    author: string
    metadata: {
      format: string
      category: string
      size: string
      tags: string[]
    }
  }
  index: number
}>()
</script>

<template>
  <tr class="group border-b border-brand-green/5 hover:bg-brand-green/5 transition-colors duration-200">
    <td class="py-4 px-4 text-brand-charcoal/40 text-xs font-bold w-10">{{ index + 1 }}</td>
    <td class="py-4 px-4 w-16">
      <div class="w-14 h-10 rounded overflow-hidden border border-brand-green/10 flex-shrink-0 bg-brand-cream/50">
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
      </div>
    </td>
    <td class="py-4 px-4">
      <span class="text-sm font-bold text-brand-green-dark group-hover:text-brand-green transition-colors line-clamp-1">{{ item.title }}</span>
    </td>
    <td class="py-4 px-4 text-xs font-bold text-brand-charcoal/50 w-16">{{ item.year }}</td>
    <td class="py-4 px-4 text-xs font-bold text-brand-charcoal/50 line-clamp-1">{{ item.author }}</td>
    <td class="py-4 px-4">
      <span class="px-2.5 py-1 rounded-md bg-brand-green/8 text-brand-green text-[10px] font-black uppercase tracking-wider">{{ item.metadata.category }}</span>
    </td>
    <td class="py-4 px-4 text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-tighter w-16">{{ item.metadata.format }}</td>
    <td class="py-4 px-4 text-xs font-bold text-brand-charcoal/50 w-20">{{ item.metadata.size }}</td>
    <td class="py-4 px-4">
      <button class="w-8 h-8 rounded-full bg-brand-green/8 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-all duration-300 group-hover:shadow-lg" title="Download">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </button>
    </td>
  </tr>
</template>
