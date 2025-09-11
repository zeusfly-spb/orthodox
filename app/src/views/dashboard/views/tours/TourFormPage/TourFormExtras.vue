<template>
  <div class="mb-8">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Выбранные туристами допы</h3>
    <div class="overflow-x-auto">
      <table class="w-full border border-gray-200">
        <thead>
          <tr class="bg-gray-50">
            <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">
              НАИМЕНОВАНИЕ ДОПА
            </th>
            <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">
              СТОИМОСТЬ ЗА ЕД, РУБ
            </th>
            <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">
              КОЛ-ВО, ШТ.
            </th>
            <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">
              ОБЩАЯ СТОИМОСТЬ
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="service in tour.services"
            :key="`service-${service.id}`"
            class="border-b border-gray-200"
          >
            <td class="py-3 px-4">{{ service.title }}</td>
            <td class="py-3 px-4">{{ formatCurrency(service.price) }}</td>
            <td class="py-3 px-4">{{ tour.customers_count }}</td>
            <td class="py-3 px-4 font-semibold">
              {{ formatCurrency(service.price * tour.customers_count) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Tour } from '@/types/tour';
import { computed } from 'vue';
import { useToursStore } from '@/stores/tours';

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

const { formatCurrency } = useToursStore();
</script>
