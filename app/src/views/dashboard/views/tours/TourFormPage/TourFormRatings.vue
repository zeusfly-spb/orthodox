<template>
  <div class="flex gap-8 mb-8">
    <div class="flex items-center gap-3">
      <span class="text-gray-700 font-medium">Сложность:</span>
      <DotControl 
        v-model:currentItem="tour"
        fieldName="difficulty"
        :editMode="false"
      />
    </div>

    <div class="flex items-center gap-3">
      <span class="text-gray-700 font-medium">Комфорт:</span>
      <DotControl 
        v-model:currentItem="tour"
        fieldName="comfort"
        :editMode="false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Tour } from '@/types/tour';
import { computed } from 'vue';
import DotControl from '@/components/dashboard/tours/DotControl.vue';

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
