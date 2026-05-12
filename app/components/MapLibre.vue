<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  center?: [number, number]
  zoom?: number
  minZoom?: number
  maxZoom?: number
  bounds?: [[number, number], [number, number]]
}>(), {
  center: () => [118.0, -2.5],
  zoom: 5,
  minZoom: 3,
  maxZoom: 18,
  bounds: () => [[95.0, -11.0], [141.0, 6.0]],
})

const emit = defineEmits<{
  ready: [map: any]
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
let map: any = null

onMounted(async () => {
  const maplibregl = (await import('maplibre-gl')).default

  map = new maplibregl.Map({
    container: mapContainer.value!,
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        },
      },
      layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
    },
    center: props.center,
    zoom: props.zoom,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
  })

  map.fitBounds(props.bounds, { padding: 40, duration: 1200 })
  map.on('load', () => emit('ready', map))
})

onUnmounted(() => {
  if (map) map.remove()
})
</script>

<template>
  <div ref="mapContainer" class="w-full h-full" />
</template>
