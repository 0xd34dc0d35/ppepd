<template>
  <div class="alert" :style="{ 'border-color': color }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const { color } = defineProps({
  color: {
    type: String,
    default: 'orange'
  }
})
</script>

<style scoped>
.alert {
  @apply flex items-center p-4 border-l-4 rounded-r-xl shadow-klh-1 transition-all duration-300 bg-white/50 backdrop-blur-sm border-klh-green-600;
  font-weight: 500;
  color: rgb(var(--klh-ink-900));
}

.alert:hover {
  @apply -translate-y-0.5 shadow-klh-2 bg-white/80;
}
</style>