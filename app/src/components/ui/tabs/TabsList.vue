<script setup lang="ts">
import { inject } from 'vue'

const activeTab = inject<string>('activeTab')
const setActiveTab = inject<(value: string) => void>('setActiveTab')
</script>

<template>
  <div class="inline-flex h-10 items-center rounded-md p-1 text-muted-foreground border-bottom">
    <slot :activeTab="activeTab" :setActiveTab="setActiveTab" />
  </div>
</template>
