<template>
  <div class="flex flex-row justify-between">
    <div class="flex flex-wrap items-center gap-3 mb-6  text-gray-400 flex-row">
      <span>ТУРЫ</span>
      <Badge
        class="text-gray-600 bg-gray-200 rounded-full"
      >
        {{ items.length }}
      </Badge>
    </div>
    <div class="flex flex-wrap items-center gap-3 text-gray-400 flex-row touchable">
      <ArrowDownUp
        class="text-gray-600"
        @click="items = items.reverse()"
      />
      Сортировка
    </div>
  </div>
</template>

<script setup>
import { ArrowDownUp } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge/index.js';

const props = defineProps({
  items: Array,
});
</script>
