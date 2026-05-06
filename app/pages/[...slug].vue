<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <div class="mx-auto px-4">
    <div v-if="page" class="glass-card p-1 md:p-1 overflow-hidden bg-gradient-to-br from-brand-green/5 to-transparent">
      <div class="bg-white/80 backdrop-blur-3xl p-8 md:p-16 rounded-[calc(1.5rem-1px)]">
        <article class="prose prose-emerald max-w-none prose-headings:text-brand-green-dark prose-headings:font-black prose-p:text-brand-charcoal/80 prose-a:text-brand-green hover:prose-a:text-brand-green-dark">
          <ContentRenderer :value="page" />
        </article>
      </div>
    </div>
  </div>
</template>
