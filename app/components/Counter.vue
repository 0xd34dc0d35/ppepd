<template>
  <div class="glass-card p-8 inline-flex flex-col items-center gap-6 border-line">
    <h3 class="text-3xl font-bold text-klh-green-800 tracking-tight">
      Counter: <span class="text-klh-orange-700">{{ count }}</span>
    </h3>
    <div class="flex gap-3">
      <button 
        @click="decrement"
        class="w-12 h-12 rounded-full border-2 border-line flex items-center justify-center text-klh-green-600 hover:bg-klh-green-600 hover:text-white transition-all font-bold text-xl"
      >
        -
      </button>
      <button 
        @click="increment"
        class="px-8 py-2 rounded-full bg-klh-orange-500 text-on-orange font-bold shadow-klh-3 hover:scale-105 transition-all"
      >
        Increment
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  if (count.value > 0) {
    count.value--
  }
}
</script>
