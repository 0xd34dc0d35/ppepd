<script setup lang="ts">
// Toolbar aksesibilitas — DS KLH/BPLH v2.1 §07 (UU 25/2009, WCAG 2.1 AA).
// Preferensi disimpan antar-kunjungan dan berlaku global (atribut pada <html>).
const STORAGE_KEY = 'klh-a11y'
const SIZES = [100, 120, 140]

const highContrast = ref(false)
const fontSize = ref(100)

const apply = () => {
  const root = document.documentElement
  if (highContrast.value) root.dataset.contrast = 'high'
  else delete root.dataset.contrast
  root.style.fontSize = fontSize.value === 100 ? '' : `${fontSize.value}%`
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ c: highContrast.value, f: fontSize.value }))
  } catch {}
}

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved) {
      highContrast.value = !!saved.c
      fontSize.value = SIZES.includes(saved.f) ? saved.f : 100
    }
  } catch {}
  apply()
})

const toggleContrast = () => { highContrast.value = !highContrast.value; apply() }
const biggerText = () => { fontSize.value = SIZES[(SIZES.indexOf(fontSize.value) + 1) % SIZES.length]; apply() }
const reset = () => { highContrast.value = false; fontSize.value = 100; apply() }
</script>

<template>
  <div class="flex items-center gap-1" role="group" aria-label="Aksesibilitas">
    <button
      type="button"
      class="a11y-btn"
      :aria-pressed="highContrast"
      @click="toggleContrast"
    >
      <svg class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>
      <span class="hidden md:inline">Kontras Tinggi</span>
      <span class="md:hidden sr-only">Kontras Tinggi</span>
    </button>
    <button
      type="button"
      class="a11y-btn"
      :aria-label="`Perbesar teks (saat ini ${fontSize}%)`"
      @click="biggerText"
    >
      <svg class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19 9 5l5 14M5.8 14h6.4"/><path d="M17 9v6M14 12h6"/></svg>
      <span class="hidden md:inline">Perbesar Teks</span>
      <span v-if="fontSize !== 100" class="font-mono text-[11px]">{{ fontSize }}%</span>
    </button>
    <button
      v-if="highContrast || fontSize !== 100"
      type="button"
      class="a11y-btn"
      @click="reset"
    >
      <svg class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6"/><path d="M4 4v4.6h4.6"/></svg>
      <span class="hidden md:inline">Reset</span>
      <span class="md:hidden sr-only">Reset tampilan</span>
    </button>
  </div>
</template>

<style scoped>
.a11y-btn {
  @apply inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-klh-green-100 transition-colors hover:bg-white/10 hover:text-white;
}
.a11y-btn[aria-pressed='true'] {
  @apply bg-white/15 text-white;
}
</style>
