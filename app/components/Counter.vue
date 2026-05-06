<template>
  <div class="glass-card p-8 inline-flex flex-col items-center gap-6 border-brand-green/10">
    <h3 class="text-3xl font-black text-brand-green-dark tracking-tighter">
      Counter: <span class="text-brand-orange">{{ count }}</span>
    </h3>
    <div class="flex gap-3">
      <button 
        @click="decrement"
        class="w-12 h-12 rounded-full border-2 border-brand-green/20 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-all font-black text-xl"
      >
        -
      </button>
      <button 
        @click="increment"
        class="px-8 py-2 rounded-full bg-cta-gradient text-white font-black shadow-lg shadow-brand-orange/20 hover:scale-105 transition-all"
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
