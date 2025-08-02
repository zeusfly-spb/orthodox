<script setup lang="ts">
import { inject } from 'vue'

const activeTab = inject<string>('activeTab')
const setActiveTab = inject<(value: string) => void>('setActiveTab')
</script>

<template>
  <div
    class="inline-flex items-center p-1 text-muted-foreground border-bottom-gray w-full overflow-x-auto"
  >
    <slot :activeTab="activeTab" :setActiveTab="setActiveTab" />
  </div>
</template>
