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
  @apply flex items-center p-4 border-l-4 rounded-r-xl shadow-sm transition-all duration-300 bg-white/50 backdrop-blur-sm border-brand-green;
  font-weight: 500;
  color: theme('colors.brand.charcoal');
}

.alert:hover {
  @apply -translate-y-0.5 shadow-md bg-white/80;
}
</style>