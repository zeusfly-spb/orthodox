<template>
  <div class="space-y-4 mb-8">
    <div class="flex items-center">
      <span class="text-gray-700 font-medium w-32">Перевозчик:</span>
      <span class="text-gray-900">--</span>
    </div>
    <div class="flex items-center">
      <span class="text-gray-700 font-medium w-32">Отель:</span>
      <span class="text-gray-900">--</span>
    </div>
    <div class="flex items-center">
      <span class="text-gray-700 font-medium w-32">Объект питания:</span>
      <button class="text-blue-600 hover:text-blue-800 underline">--</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Tour } from '@/types/tour';
import { computed } from 'vue';

const props = defineProps<{
  currentItem: Tour;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
}>();

const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value) {
    emit('update:currentItem', value);
  },
});
</script>
