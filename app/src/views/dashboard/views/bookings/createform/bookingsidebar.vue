<script setup>
import PickList from '@/components/filters/PickList.vue';
import { computed } from 'vue';


const props = defineProps({
  status: String,
  paymentStatus: String,
  tags: Array,
  statusOptions: Array,
  paymentStatusOptions: Array,
  services: Array,
  tour: Object
});

const emit = defineEmits(['update:status', 'update:paymentStatus', 'update:tags']);

// Calculate total price from services
const totalPrice = computed(() => {
  if (!props.services || props.services.length === 0) return 0;
  
  // This would need to fetch actual service prices
  // For now, return placeholder
  return props.services.reduce((sum, service) => {
    return sum + (service.price || 0) * (service.quantity || 0);
  }, 0);
});

// Available tags (mock data - should come from API)
const availableTags = [
  { id: 1, name: 'VIP' },
  { id: 2, name: 'Срочно' },
  { id: 3, name: 'Особые условия' },
  { id: 4, name: 'Группа' }
];
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-6">Информация о заявке</h2>
    
    <div class="space-y-6">
       Status 
      <div>
        <label class="block text-sm text-gray-600 mb-2">Статус заявки</label>
        <PickList
          :items="statusOptions"
          :modelValue="[status]"
          @update:modelValue="(val) => emit('update:status', val[0])"
          label-key="label"
          value-key="value"
          placeholder="Выберите статус"
          :multiple="false"
        />
      </div>

       Payment Status 
      <div>
        <label class="block text-sm text-gray-600 mb-2">Статус оплаты</label>
        <Picklist
          :items="paymentStatusOptions"
          :modelValue="[paymentStatus]"
          @update:modelValue="(val) => emit('update:paymentStatus', val[0])"
          label-key="label"
          value-key="value"
          placeholder="Выберите статус оплаты"
          :multiple="false"
        />
      </div>

       Tags 
      <div>
        <label class="block text-sm text-gray-600 mb-2">Теги</label>
        <Picklist
          :items="availableTags"
          :modelValue="tags"
          @update:modelValue="(val) => emit('update:tags', val)"
          label-key="name"
          value-key="id"
          placeholder="Выберите теги"
          :multiple="true"
        />
      </div>

      <hr class="border-gray-200" />

       Price Summary 
      <div>
        <h3 class="text-sm font-medium text-gray-700 mb-4">Стоимость</h3>
        
        <div class="space-y-3">
          <div
            v-for="(service, index) in services"
            :key="index"
            class="flex justify-between text-sm"
          >
            <span class="text-gray-600">Услуга {{ index + 1 }} (×{{ service.quantity }})</span>
            <span class="font-medium text-gray-900">{{ (service.price || 0) * service.quantity }} ₽</span>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <span class="text-base font-semibold text-gray-900">Итого:</span>
            <span class="text-xl font-bold text-emerald-600">{{ totalPrice }} ₽</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
