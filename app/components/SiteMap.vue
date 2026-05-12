<script setup lang="ts">
import { ref } from 'vue'

const pages = [
  { name: 'Beranda', path: '/', category: 'Main' },
  { name: 'Katalog Data', path: '/data', category: 'Main' },
  { name: 'Layanan PPEPD', path: '/layanan', category: 'Main' },
  { name: 'Tentang Kami', path: '/about', category: 'Main' },
  { name: 'Zona Integritas', path: '/zona-integritas', category: 'Main' },
  { name: 'Hubungi Kami', path: '/hubungi', category: 'Main' },
]

const components = [
  { name: 'Hero', type: 'Banner' },
  { name: 'FeatureGrid', type: 'Layout' },
  { name: 'ServiceLinks', type: 'Navigation' },
  { name: 'DataCard', type: 'Card' },
  { name: 'DataSkeleton', type: 'Loader' },
  { name: 'DataTableRow', type: 'Table' },
  { name: 'EdukasiSection', type: 'Section' },
  { name: 'PengelolaanGrid', type: 'Layout' },
  { name: 'Counter', type: 'Stat' },
  { name: 'Alert', type: 'Message' },
]

</script>

<template>
  <div class="space-y-6">
    <!-- Sitemap Header -->
    <div class="flex items-center justify-between">
      <h4 class="text-brand-green-dark font-black uppercase tracking-widest text-xs">Peta Situs</h4>
      <button 
        @click="isExpanded = !isExpanded"
        class="text-brand-charcoal/40 hover:text-brand-green text-xs font-bold transition-colors"
        :aria-expanded="isExpanded"
      >
        {{ isExpanded ? '−' : '+' }}
      </button>
    </div>

    <!-- Sitemap Content -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[2000px]"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 max-h-[2000px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isExpanded" class="space-y-4 text-sm overflow-hidden">
        <!-- Pages Section -->
        <div>
          <p class="text-[10px] font-bold text-brand-green uppercase tracking-wider mb-2">Halaman</p>
          <ul class="space-y-1.5 pl-3 border-l border-brand-green/20">
            <li v-for="page in pages" :key="page.path">
              <NuxtLink 
                :to="page.path"
                class="text-brand-charcoal/60 hover:text-brand-green text-[11px] font-medium transition-colors"
              >
                {{ page.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Components Section -->
        <div>
          <p class="text-[10px] font-bold text-brand-green uppercase tracking-wider mb-2">Komponen ({{ components.length }})</p>
          <ul class="space-y-1 pl-3 border-l border-brand-green/20">
            <li v-for="comp in components" :key="comp.name" class="text-[10px] text-brand-charcoal/50">
              <span class="font-medium text-brand-charcoal/70">{{ comp.name }}</span>
              <span class="text-brand-charcoal/40 ml-1">— {{ comp.type }}</span>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </div>
</template>
