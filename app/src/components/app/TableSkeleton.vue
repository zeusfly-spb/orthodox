<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div class="w-full space-y-4">
    <div class="space-y-4">
      <div v-for="i in 5" :key="`row-${i}`" class="flex items-center gap-4">
        <Skeleton class="h-10 w-10" />
        <Skeleton class="h-10 flex-1" />
      </div>
    </div>
  </div>
</template>
