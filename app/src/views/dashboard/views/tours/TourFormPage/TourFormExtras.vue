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
            <th v-if="editMode" class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">
              ДЕЙСТВИЯ
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
            <td class="py-3 px-4">
              <div v-if="editMode" class="flex items-center">
                <input
                  :value="service.price"
                  @input="updateServicePrice(service, $event)"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-20 px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
                <span class="ml-1 text-xs text-gray-500">₽</span>
              </div>
              <span v-else>{{ formatCurrency(service.price) }}</span>
            </td>
            <td class="py-3 px-4">{{ tour.customers_count }}</td>
            <td class="py-3 px-4 font-semibold">
              {{ formatCurrency(service.price * tour.customers_count) }}
            </td>
            <td v-if="editMode" class="py-3 px-4">
              <button
                @click="removeService(service)"
                class="text-red-600 hover:text-red-800 transition-colors duration-200"
                title="Удалить сервис"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
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
  editMode: boolean;
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

const updateServicePrice = (service: any, event: Event) => {
  const target = event.target as HTMLInputElement;
  const newPrice = parseFloat(target.value) || 0;
  
  const updatedServices = tour.value.services.map(s => 
    s.id === service.id ? { ...s, price: newPrice } : s
  );
  
  tour.value = {
    ...tour.value,
    services: updatedServices,
  };
};

const removeService = (serviceToRemove: any) => {
  if (confirm('Вы уверены, что хотите удалить этот сервис?')) {
    const updatedServices = tour.value.services.filter(s => s.id !== serviceToRemove.id);
    
    tour.value = {
      ...tour.value,
      services: updatedServices,
    };
  }
};
</script>
