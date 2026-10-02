<template>
  <div class="bg-white rounded-md border border-line overflow-hidden flex flex-col h-full">
    <!-- Illustration Skeleton -->
    <div class="aspect-video bg-gradient-to-r from-surface-bg/30 via-surface-bg/50 to-surface-bg/30 animate-pulse"></div>

    <!-- Content Skeleton -->
    <div class="p-5 flex flex-col flex-grow">
      <div class="flex justify-between items-start mb-3">
        <div class="h-3 w-20 bg-surface-bg/60 rounded animate-pulse"></div>
        <div class="h-3 w-10 bg-surface-bg/60 rounded animate-pulse"></div>
      </div>

      <div class="h-5 w-5/6 bg-surface-bg/70 rounded mb-2 animate-pulse"></div>
      <div class="h-5 w-4/5 bg-surface-bg/70 rounded mb-4 animate-pulse"></div>
      
      <div class="h-3 w-32 bg-surface-bg/60 rounded mb-6 animate-pulse"></div>

      <!-- Tags Skeleton -->
      <div class="flex flex-wrap gap-1.5 mb-6">
        <div class="h-4 w-14 bg-surface-bg/60 rounded-full animate-pulse"></div>
        <div class="h-4 w-16 bg-surface-bg/60 rounded-full animate-pulse"></div>
        <div class="h-4 w-12 bg-surface-bg/60 rounded-full animate-pulse"></div>
      </div>

      <!-- Footer Skeleton -->
      <div class="mt-auto pt-4 border-t border-line flex items-center justify-between">
        <div class="flex flex-col gap-1">
          <div class="h-2 w-14 bg-surface-bg/60 rounded animate-pulse"></div>
          <div class="h-3 w-10 bg-surface-bg/70 rounded animate-pulse"></div>
        </div>
        <div class="w-10 h-10 rounded-full bg-surface-bg/60 animate-pulse"></div>
      </div>
    </div>
  </div>
</template>
