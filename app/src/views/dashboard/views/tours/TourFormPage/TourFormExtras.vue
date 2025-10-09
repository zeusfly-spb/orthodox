<template>
  <div class="mb-8">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Выбранные туристами допы</h3>

    <!-- Форма добавления новой услуги -->
    <div v-if="showAddForm" class="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
      <h4 class="text-md font-medium text-gray-800 mb-3">Добавить новую услугу</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Название услуги</label>
          <input
              v-model="newService.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Введите название услуги"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Стоимость за единицу (₽)</label>
          <input
              v-model.number="newService.price"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="0.00"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Тип услуги</label>
          <select
              v-model="newService.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="basic">Основная</option>
            <option value="extra">Дополнительная</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Описание услуги</label>
          <textarea
              v-model="newService.description"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Введите описание услуги (необязательно)"
          ></textarea>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <button
            @click="cancelAddService"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
        >
          Отмена
        </button>
        <button
            @click="confirmAddService"
            :disabled="!isNewServiceValid"
            class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Добавить услугу
        </button>
      </div>
    </div>

    <!-- Кнопка добавления услуги -->
    <div class="mb-4">
      <button
          v-if="!showAddForm"
          @click="showAddServiceForm"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4v16m8-8H4"></path>
        </svg>
        Добавить услугу
      </button>
    </div>

    <!-- Таблица услуг -->
    <div class="overflow-x-auto">
      <table class="w-full border border-gray-200">
        <thead>
        <tr class="bg-gray-50">
          <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">
            НАИМЕНОВАНИЕ ДОПА
          </th>
          <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">
            ТИП УСЛУГИ
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
          <th v-if="editMode"
              class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">
            ДЕЙСТВИЯ
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(service, index) in tour.services"
            :key="getServiceKey(service, index)"
            class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            :class="{ 'opacity-60': !service.is_active }"
        >
          <td class="py-3 px-4">
            <div>
              <div class="font-medium text-gray-900">{{ service.title }}</div>
              <div v-if="service.description" class="text-xs text-gray-500 mt-1">
                {{ service.description }}
              </div>
            </div>
          </td>
          <td class="py-3 px-4">
            <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="getServiceTypeClass(service.type)"
            >
              {{ getServiceTypeLabel(service.type) }}
            </span>
          </td>
          <td class="py-3 px-4">
            <div v-if="editMode" class="flex items-center">
              <input
                  :value="service.price"
                  @input="updateServicePrice(service, $event)"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-20 px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </td>
        </tr>

        <!-- Сообщение при отсутствии услуг -->
        <tr v-if="tour.services.length === 0">
          <td :colspan="editMode ? 6 : 5" class="py-8 px-4 text-center text-gray-500">
            Нет добавленных услуг
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {Tour} from '@/types/tour';
import {computed, ref} from 'vue';
import {useToursStore} from '@/stores/tours';

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

const {formatCurrency} = useToursStore();

// Состояние для формы добавления услуги
const showAddForm = ref(false);
const newService = ref({
  title: '',
  type: 'extra' as 'basic' | 'extra',
  price: 0,
  description: ''
});

// Валидация формы
const isNewServiceValid = computed(() => {
  return newService.value.title.trim() !== '' && newService.value.price > 0;
});

// Генерация уникального ключа для сервиса
const getServiceKey = (service: any, index: number) => {
  return service.id
      ? `service-${service.id}`
      : `service-temp-${index}-${service.title}-${service.price}`;
};

// Методы
const showAddServiceForm = () => {
  showAddForm.value = true;
  // Сброс формы
  newService.value = {
    title: '',
    type: 'extra',
    price: 0,
    description: ''
  };
};

const cancelAddService = () => {
  showAddForm.value = false;
  newService.value = {
    title: '',
    type: 'extra',
    price: 0,
    description: ''
  };
};

const confirmAddService = () => {
  if (!isNewServiceValid.value) return;

  const serviceToAdd = {
    id: Date.now().toString(), // Временный ID
    title: newService.value.title.trim(),
    type: newService.value.type,
    price: parseFloat(newService.value.price.toString()),
    description: newService.value.description.trim(),
  };

  const updatedServices = [...tour.value.services, serviceToAdd];

  tour.value = {
    ...tour.value,
    services: updatedServices,
  };

  // Закрываем форму и сбрасываем значения
  cancelAddService();
};

const updateServicePrice = (service: any, event: Event) => {
  const target = event.target as HTMLInputElement;
  const newPrice = parseFloat(target.value) || 0;

  const updatedServices = tour.value.services.map(s =>
      s.id === service.id ? {...s, price: newPrice} : s
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

const getServiceTypeLabel = (type: string) => {
  const types = {
    basic: 'Основная',
    extra: 'Дополнительная'
  };
  return types[type as keyof typeof types] || type;
};

const getServiceTypeClass = (type: string) => {
  const classes = {
    basic: 'bg-green-100 text-green-800',
    extra: 'bg-blue-100 text-blue-800'
  };
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};
</script>
