<script setup>
const props = defineProps({ to: { type: String, default: '' }, name: { type: String, default: '' } })
const icons = {
  '/': { tone: 'green', paths: ['M3 10 12 3l9 7', 'M5 9v12h14V9', 'M9 21v-7h6v7'] },
  '/account/security': { tone: 'blue', paths: ['M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z', 'm8 12 3 3 5-6'] },
  '/my-profiles': { tone: 'blue', paths: ['M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z', 'M4 21v-2a8 8 0 0 1 16 0v2'] },
  '/admin/system': { tone: 'green', paths: ['M13 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', 'M3 21v-3a7 7 0 0 1 11-5', 'M18 13v8', 'M14 17h8', 'M17 4a3 3 0 0 1 0 6'] },
  '/admin/roles': { tone: 'blue', paths: ['M10 8a5 5 0 1 1 0 8 5 5 0 0 1 0-8Z', 'M15 12h7', 'M19 12v4', 'M22 12v3'] },
  '/dokumentasi': { tone: 'orange', paths: ['M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z', 'M12 5v15', 'M5 8h4', 'M15 8h4', 'M5 12h4', 'M15 12h4'] },
  '/danau/manajemen': { tone: 'blue', paths: ['m3 10 5-7 5 7', 'm11 10 4-5 6 5', 'M3 14c3-2 6 2 9 0s6 2 9 0', 'M3 19c3-2 6 2 9 0s6 2 9 0'] },
  '/mataair/manajemen': { tone: 'green', paths: ['M12 2s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z', 'M9 13a3 3 0 0 0 3 3', 'M3 21h18'] },
  '/danau/profil': { tone: 'blue', paths: ['M5 2h10l4 4v16H5V2Z', 'M14 2v5h5', 'm8 12 2-3 3 3', 'M8 16c2-2 4 2 8 0', 'M8 19h8'] },
  '/mataair/profil': { tone: 'green', paths: ['M5 2h10l4 4v16H5V2Z', 'M14 2v5h5', 'M12 9s-3 4-3 6a3 3 0 0 0 6 0c0-2-3-6-3-6Z', 'M9 20h6'] },
  '/danau/dashboard': { tone: 'blue', paths: ['M3 3h18v13H3V3Z', 'M7 12V8', 'M12 12V6', 'M17 12v-3', 'M12 16v5', 'M8 21h8'] },
  '/mataair/dashboard': { tone: 'green', paths: ['M3 3h18v13H3V3Z', 'M12 5s-3 3-3 5a3 3 0 0 0 6 0c0-2-3-5-3-5Z', 'M12 16v5', 'M8 21h8'] },
  '/permata': { tone: 'green', paths: ['M12 3 3 9l9 12 9-12-9-6Z', 'M3 9h18', 'M12 3 8 9l4 12 4-12-4-6'] },
}
const avatar = computed(() => {
  let path = props.to
  try { path = new URL(props.to, 'https://ppepd.kemenlh.go.id').pathname } catch {}
  if (icons[path]) return icons[path]
  // Ikon deterministik untuk aplikasi baru yang belum memiliki ilustrasi khusus.
  const hash = [...(props.to + props.name)].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 0)
  return { tone: ['green', 'blue', 'orange'][hash % 3], paths: ['M5 3h14v18H5V3Z', ...Array.from({ length: 5 }, (_, i) => `M8 ${7 + i * 2}h${2 + ((hash >>> (i * 3)) % 8)}`)] }
})
</script>

<template>
  <span class="app-avatar" :class="'app-avatar-' + avatar.tone" aria-hidden="true">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path v-for="(path, index) in avatar.paths" :key="index" :d="path" /></svg>
  </span>
</template>

<style scoped>
.app-avatar { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0; }
.app-avatar-green { background: rgb(var(--klh-g-100)); color: rgb(var(--klh-g-700)); }
.app-avatar-blue { background: rgb(var(--klh-b-100)); color: rgb(var(--klh-b-700)); }
.app-avatar-orange { background: rgb(var(--klh-o-100)); color: rgb(var(--klh-o-800)); }
</style>
