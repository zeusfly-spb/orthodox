<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p class="text-sm text-gray-500 mb-1">Количество мест в туре</p>
      <p class="text-lg font-semibold text-gray-900">{{ tour.seats - tour.customers_count }} / {{ tour.seats }}</p>
    </div>

    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p class="text-sm text-gray-500 mb-1">Гид</p>
      <p class="text-lg font-semibold text-gray-900">--</p>
    </div>

    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p class="text-sm text-gray-500 mb-1">Стоимость</p>
      <p class="text-sm text-gray-600 mb-1">
        {{ formatCurrency(tour.price) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Tour } from '@/types/tour';
import { computed } from 'vue';
import { useToursStore } from '@/stores/tours';

const { formatCurrency } = useToursStore();

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
