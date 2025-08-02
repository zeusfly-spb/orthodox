<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{
  value: string
}>()

const activeTab = inject<string>('activeTab')
</script>

<template>
  <div
    v-show="activeTab === value"
    class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full"
  >
    <slot />
  </div>
</template>
