<script setup>
import { formatMangroveDensity } from '~/utils/mangrove-catalog'
const { data, error, status, refresh } = await useFetch('/api/mangrove/catalog', { key: 'mangrove-sippem-catalog' })
const editions = computed(() => (data.value?.layers || []).filter(layer => layer.kind === 'mangrove'))
const selectedId = ref('')
const selectedLayer = computed(() => editions.value.find(layer => layer.id === selectedId.value) || editions.value[0] || null)
const feature = ref(null)
const mapVersion = ref(0)
watch(editions, rows => { if (!rows.some(layer => layer.id === selectedId.value)) selectedId.value = rows[0]?.id || '' }, { immediate: true })
watch(selectedLayer, () => { feature.value = null })
async function reload() { await refresh(); if (!error.value) mapVersion.value++ }
</script>

<template>
  <div class="h-full min-h-0 relative bg-surface-3">
    <MangroveSippemMap v-if="selectedLayer" :key="mapVersion" :layer="selectedLayer" @feature="feature = $event">
      <div class="absolute top-16 left-3 max-w-[calc(100%-5rem)]">
        <label for="map-mangrove-edition" class="sr-only">Edisi mangrove</label>
        <select id="map-mangrove-edition" v-model="selectedId" class="rounded-lg border border-line bg-surface text-ink-700 text-sm min-h-11 px-2 shadow-klh-1" aria-label="Edisi mangrove">
          <option value="" disabled>Pilih edisi</option>
          <option v-for="layer in editions" :key="layer.id" :value="layer.id">{{ layer.title }}</option>
        </select>
      </div>
      <div v-if="feature" class="absolute top-28 left-3 right-16 sm:right-auto sm:max-w-xs max-h-[45%] overflow-y-auto rounded-lg border border-line bg-surface p-3 shadow-klh-1 text-xs text-ink-700">
        <div class="flex justify-between items-start gap-3"><p class="font-semibold">{{ formatMangroveDensity(feature.KTTJ) || 'Objek mangrove' }}</p><button type="button" class="min-w-11 min-h-11 -mt-2 -mr-2" aria-label="Tutup detail objek" @click="feature = null">×</button></div>
        <p v-if="feature.WADMPR || feature.PROV">{{ feature.WADMPR || feature.PROV }}</p>
        <p v-if="feature.SMBDT" class="mt-1">{{ feature.SMBDT }}</p>
        <p v-if="feature.THNBUAT" class="mt-1">Tahun pembuatan: {{ feature.THNBUAT }}</p>
      </div>
    </MangroveSippemMap>
    <div v-else class="absolute inset-0 flex items-center justify-center p-4 text-sm text-ink-700" role="status">
      <p v-if="status === 'pending'">Memuat katalog SI-PPEM…</p>
      <div v-else><p>{{ error ? 'Katalog SI-PPEM belum dapat dimuat.' : 'Belum ada edisi mangrove yang tersedia.' }}</p><button class="btn btn-outline mt-3" type="button" @click="reload">Coba lagi</button></div>
    </div>
  </div>
</template>
