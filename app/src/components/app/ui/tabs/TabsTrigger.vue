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
    @click="() => setActiveTab?.(value)"
    class="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-base md:text-lg cursor-pointer ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative"
    :class="{
      'text-emerald-500': activeTab === value,
      'text-muted-foreground hover:text-foreground': activeTab !== value,
    }"
  >
    <slot />
    <span
      v-if="activeTab === value"
      class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
    />
  </button>
</template>
