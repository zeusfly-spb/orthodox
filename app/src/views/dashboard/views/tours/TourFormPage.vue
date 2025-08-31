<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TourFormHeader from '@/views/dashboard/views/tours/TourFormHeader.vue';
import TourFormOverview from '@/views/dashboard/views/tours/TourFormOverview.vue';
import { tourApi } from '@/api/tours';
import { toast } from 'vue-sonner';
import type { Tour } from '@/types/tour';

const router = useRouter();
const id = ref<string | null>(null);
const currentItem = ref<Tour | null>(null);

onMounted(() => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId && routeId !== 'new') {
    id.value = routeId as string;
    loadItem();
  }
});

const loadItem = async (): Promise<void> => {
  try {
    const { data } = await tourApi.getData(id.value!);
    currentItem.value = data;
  } catch (error: unknown) {
    toast.error('Ошибка загрузки данных');
    router.push({ name: 'tours-list' });
  }
};

const handleSubmit = async (formData: Partial<Tour>): Promise<void> => {
  try {
    if (id.value) {
      await tourApi.patchData(id.value, formData);
      toast.success('Тур успешно обновлен');
    } else {
      await tourApi.storeData(formData);
      toast.success('Тур успешно создан');
    }
    router.push({ name: 'tours-list' });
  } catch (error: unknown) {
    toast.error('Ошибка сохранения данных');
  }
};

const handleCancel = (): void => {
  router.push({ name: 'tours-list' });
};

// Форматирование валюты
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2
  }).format(amount);
};

// Моковые данные для демонстрации
const mockTourData = {
  title: 'Паломничество по Святым Местам',
  status: 'published',
  dates: '2024-03-15 / 2024-03-19',
  seats: { taken: 15, total: 50 },
  travelTime: '22 часа 42 минуты',
  guide: 'Иванов И. И.',
  price: {
    tourType: 'Тур 1',
    category: 'Взрослый',
    accommodation: 'Одноместный',
    amount: 74545.45
  },
  carrier: 'ООО «Перевозчик»',
  hotel: 'Гостиница «Университетская»',
  foodObject: 'Выбрать',
  objects: [
    'Псково-Печерский монастырь',
    'Нилова пустынь',
    'Плещеево озеро',
    'Синь - камень',
    'Mercure',
    'Иванов И.И'
  ],
  difficulty: { level: 'easy', rating: 3 },
  comfort: { level: 'high', rating: 4 },
  extras: [
    {
      name: 'Ужин в ресторане 3*',
      costPerUnit: 650,
      quantity: 4,
      totalCost: 2600
    },
    {
      name: 'Экскурсия в Псково-Печерский монастырь',
      costPerUnit: 1200,
      quantity: 1,
      totalCost: 1200
    }
  ],
  totalToPay: 2500555,
  paid: 1500555
};
</script>

<template>
  <div v-if="!currentItem" class="w-full p-6 bg-white rounded-xl">
    <div class="flex items-center justify-center h-32">
      <div class="text-gray-500">Загрузка данных...</div>
    </div>
  </div>
  
  <div 
    v-else
    class="w-full p-6 bg-white rounded-xl"
  >
    <TourFormHeader 
      :currentItem="currentItem" 
    />

    <TourFormOverview
      v-model:currentItem="currentItem"
    />

    <!-- Info Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p class="text-sm text-gray-500 mb-1">Количество мест в туре</p>
        <p class="text-lg font-semibold text-gray-900">{{ mockTourData.seats.taken }}/{{ mockTourData.seats.total }}</p>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p class="text-sm text-gray-500 mb-1">Время в пути</p>
        <p class="text-lg font-semibold text-gray-900">{{ mockTourData.travelTime }}</p>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p class="text-sm text-gray-500 mb-1">Гид</p>
        <p class="text-lg font-semibold text-gray-900">{{ mockTourData.guide }}</p>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p class="text-sm text-gray-500 mb-1">Стоимость</p>
        <p class="text-sm text-gray-600 mb-1">{{ mockTourData.price.tourType }}, {{ mockTourData.price.category }}, {{ mockTourData.price.accommodation }} / {{ formatCurrency(mockTourData.price.amount) }}</p>
      </div>
    </div>

    <!-- Logistics -->
    <div class="space-y-4 mb-8">
      <div class="flex items-center">
        <span class="text-gray-700 font-medium w-32">Перевозчик:</span>
        <span class="text-gray-900">{{ mockTourData.carrier }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-gray-700 font-medium w-32">Отель:</span>
        <span class="text-gray-900">{{ mockTourData.hotel }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-gray-700 font-medium w-32">Объект питания:</span>
        <button class="text-blue-600 hover:text-blue-800 underline">
          {{ mockTourData.foodObject }}
        </button>
      </div>
    </div>

    <!-- Tour Objects -->
    <div class="mb-8">
      <div class="flex items-center mb-4">
        <span class="text-gray-700 font-medium">Объекты в туре:</span>
      </div>
      <div class="flex gap-2 overflow-x-auto">
        <span 
          v-for="object in mockTourData.objects" 
          :key="object" 
          class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full whitespace-nowrap"
        >
          {{ object }}
        </span>
        <span class="px-2 text-gray-400">→</span>
      </div>
    </div>

    <!-- Ratings -->
    <div class="flex gap-8 mb-8">
      <div class="flex items-center gap-3">
        <span class="text-gray-700 font-medium">Сложность:</span>
        <span class="text-gray-900">Легкий</span>
        <div class="flex gap-1">
          <div
            v-for="i in 5"
            :key="i"
            class="w-2 h-2 rounded-full"
            :class="i <= mockTourData.difficulty.rating ? 'bg-emerald-500' : 'bg-gray-300'"
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
            :class="i <= mockTourData.comfort.rating ? 'bg-emerald-500' : 'bg-gray-300'"
          ></div>
        </div>
      </div>
    </div>

    <!-- Selected Extras -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Выбранные туристами допы</h3>
      <div class="overflow-x-auto">
        <table class="w-full border border-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">НАИМЕНОВАНИЕ ДОПА</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">СТОИМОСТЬ ЗА ЕД, РУБ</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">КОЛ-ВО, ШТ.</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">ОБЩАЯ СТОИМОСТЬ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="extra in mockTourData.extras" :key="extra.name" class="border-b border-gray-200">
              <td class="py-3 px-4">{{ extra.name }}</td>
              <td class="py-3 px-4">{{ formatCurrency(extra.costPerUnit) }}</td>
              <td class="py-3 px-4">{{ extra.quantity }}</td>
              <td class="py-3 px-4 font-semibold">{{ formatCurrency(extra.totalCost) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Financial Summary -->
    <div class="flex justify-between items-center p-6 bg-gray-50 rounded-lg">
      <div class="text-right">
        <p class="text-sm text-gray-600 mb-1">Всего к оплате:</p>
        <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(mockTourData.totalToPay) }}</p>
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-600 mb-1">Оплачено:</p>
        <p class="text-2xl font-bold text-emerald-600">{{ formatCurrency(mockTourData.paid) }}</p>
      </div>
    </div>

    <!-- Footer Icons -->
    <div class="flex justify-center gap-4 mt-8">
      <div class="w-6 h-6 bg-gray-300 rounded"></div>
      <div class="w-6 h-6 bg-gray-300 rounded"></div>
    </div>
  </div>

</template>
