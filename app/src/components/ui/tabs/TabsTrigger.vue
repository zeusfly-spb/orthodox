<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{
  value: string
}>()

const activeTab = inject<string>('activeTab')
const setActiveTab = inject<(value: string) => void>('setActiveTab')
</script>

<template>
  <button
    role="tab"
    :aria-selected="activeTab === value"
    :tabindex="activeTab === value ? 0 : -1"
    @click="() => setActiveTab?.(value)"
    class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    :class="{
      // 'bg-background text-foreground shadow-sm': activeTab === value,
      // 'hover:text-foreground': activeTab !== value,
      'bg-background text-emerald-500 shadow-sm': activeTab === value,
      'hover:text-emerald-500/80 text-muted-foreground': activeTab !== value,
    }"
  >
    <slot />
  </button>
</template>
