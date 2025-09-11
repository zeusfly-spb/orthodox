`
<script setup>
import { X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button/index.js';
</script>
<template>
  <div class="flex flex-wrap items-center gap-3 mb-6">
    <div class="flex gap-2">
      <span
        class="bg-gray-600 rounded-full px-3 py-1 text-sm flex items-center gap-1 text-gray-200 hover:text-white touchable"
      >
        Teг 1
        <X />
      </span>
      <span
        class="bg-gray-600 rounded-full px-3 py-1 text-sm flex items-center gap-1 text-gray-200 hover:text-white touchable"
      >
        Teг 2
        <X />
      </span>
      <span
        class="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-600 hover:text-white touchable"
      >
        Teг 3
        <X />
      </span>
      <span
        class="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-600 hover:text-white touchable"
      >
        Teг 4
        <X />
      </span>
      <span
        class="px-3 border rounded-full border-gray-600 border-dashed py-1 text-sm flex items-center gap-1 hover:bg-gray-600 touchable"
      >
        <button class="ml-1 text-gray-600 hover:text-white touchable">Добавить тег</button>
      </span>
    </div>
  </div>
</template>
`
