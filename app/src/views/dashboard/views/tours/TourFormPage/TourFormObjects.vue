<template>
  <div class="mb-8">
    <div class="flex items-center mb-4">
      <span class="text-gray-700 font-medium">Объекты в туре:</span>
    </div>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="object in objects"
        :key="object.id"
        class="px-3 py-3 bg-gray-100 text-gray-700 text-sm rounded-full whitespace-nowrap"
      >
        {{ object.title }}
      </span>
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

const objects = computed(() => tour.value.entities.map(item => item.entity));
</script>
