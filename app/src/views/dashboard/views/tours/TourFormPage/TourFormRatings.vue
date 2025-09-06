<template>
  <div class="flex gap-8 mb-8">
    <div class="flex items-center gap-3">
      <span class="text-gray-700 font-medium">Сложность:</span>
      <span class="text-gray-900">Легкий</span>
      <div class="flex gap-1">
        <div
          v-for="i in 5"
          :key="i"
          class="w-2 h-2 rounded-full"
          :class="i <= 2 ? 'bg-emerald-500' : 'bg-gray-300'"
        ></div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <span class="text-gray-700 font-medium">Комфорт:</span>
      <span class="text-gray-900">Выше среднего</span>
      <div class="flex gap-1">
        <div
          v-for="i in 5"
          :key="i"
          class="w-2 h-2 rounded-full"
          :class="i <= 4 ? 'bg-emerald-500' : 'bg-gray-300'"
        ></div>
      </div>
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
