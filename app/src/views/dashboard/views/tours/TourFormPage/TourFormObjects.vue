<template>
  <div class="mb-8">
    <div class="flex items-center mb-4">
      <span class="text-gray-700 font-medium">Объекты в туре:</span>
    </div>
    <div class="flex gap-2 overflow-x-auto">
      <span
        v-for="object in Array(5)
          .fill(1)
          .map((item, index) => index + 1)"
        :key="object"
        class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full whitespace-nowrap"
      >
        {{ object }}
      </span>
      <span class="px-2 text-gray-400">→</span>
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
