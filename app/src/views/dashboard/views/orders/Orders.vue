<script setup>
import { managerApi } from '@/api/managers';
import UButton from '@/components/ui/UButton.vue';
import UInput from '@/components/ui/UInput.vue';
import UDropdown from '@/components/ui/UDropdown.vue';
import { ref, onMounted, reactive,computed } from 'vue';
import { tourApi } from '@/api/tours';
import UBanner from '@/components/ui/UBanner.vue';
import { useBookingStore } from '@/stores/booking';
import { useOrderStore } from '@/stores/order';



const booking = useBookingStore();

const statuses = useOrderStore()
const filters = reactive({
  searchText: '',
  status: '',
  manager: '',
  creationPeriodStart: '',
  creationPeriodEnd: '',
  tourDatesStart: '',
  tourDatesEnd: ''

});
const managerList = computed(() => booking.managers || []);
const statusList = computed(() => statuses.orderStatusList || {});

// Фильтрация заказов
const filteredOrders = computed(() => {
  if (!booking.orders || !Array.isArray(booking.orders)) return [];

  return booking.orders.filter(order => {
    // Поиск по названию тура
    const matchesSearch = !filters.searchText || 
      order.title?.toLowerCase().includes(filters.searchText.toLowerCase());

    // Фильтр по статусу
    const matchesStatus = !filters.status || 
      order.bookings?.some(booking => booking.status === filters.status);

    // Фильтр по менеджеру
    const matchesManager = !filters.manager || 
      order.bookings?.some(booking => booking.manager === filters.manager);

    // Фильтр по периоду создания тура
    const matchesCreationPeriod = !filters.creationPeriodStart || !filters.creationPeriodEnd ||
      (order.created_at && isDateInRange(order.created_at, filters.creationPeriodStart, filters.creationPeriodEnd));

    // Фильтр по датам тура
    const matchesTourDates = !filters.tourDatesStart || !filters.tourDatesEnd ||
      (order.date_start && order.date_end && 
       isDateInRange(order.date_start, filters.tourDatesStart, filters.tourDatesEnd) ||
       isDateInRange(order.date_end, filters.tourDatesStart, filters.tourDatesEnd));

    return matchesSearch && matchesStatus && matchesManager && matchesCreationPeriod && matchesTourDates;
  });
});

// Функция проверки даты в диапазоне
function isDateInRange(date, start, end) {
  const checkDate = new Date(date);
  const startDate = new Date(start);
  const endDate = new Date(end);
  return checkDate >= startDate && checkDate <= endDate;
}

// Сброс фильтров
function resetFilters() {
  filters.searchText = '';
  filters.status = '';
  filters.manager = '';
  filters.creationPeriodStart = '';
  filters.creationPeriodEnd = '';
  filters.tourDatesStart = '';
  filters.tourDatesEnd = '';
}

// Обработчики для выбора дат
function handleCreationPeriodChange(event) {
  const [start, end] = event.target.value.split(' to ');
  filters.creationPeriodStart = start || '';
  filters.creationPeriodEnd = end || '';
}

function handleTourDatesChange(event) {
  const [start, end] = event.target.value.split(' to ');
  filters.tourDatesStart = start || '';
  filters.tourDatesEnd = end || '';
}

async function loadAllData() {
  try {
    const [toursResponse, managersResponse, statusesResponse] = await Promise.all([
      tourApi.fetchData(),
      managerApi.fetchData(),
      statuses.fetchOrderStatuses(),
    ]);

    booking.managers = managersResponse.data.map((m) => m.name);

    // Загружаем полные данные по каждому туру
    const toursWithDetails = await Promise.all(
      toursResponse.data.map((tour) => tourApi.getData(tour.id).then((res) => res.data)),
    );

    // Объединяем базовую информацию с bookings
    booking.orders = toursResponse.data.map((tour, index) => ({
      ...tour,
      bookings: toursWithDetails[index].bookings || [],
    }));
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
}
function getStatusClass(status) {
  const statusClasses = {
    'Подтвержден': 'bg-emerald-100 text-emerald-800',
    'Ожидает': 'bg-yellow-100 text-yellow-800',
    'Отменен': 'bg-red-100 text-red-800',
    'Завершен': 'bg-blue-100 text-blue-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  loadAllData();
});
</script>
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="bg-white rounded-2xl p-4 sm:p-6 mb-6 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Мои заявки</h1>
          <UButton class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap"
          text="Добавить новую заявку"
              size="medium"
              variant="primary"
              @click="$router.push({ name: 'order-create' })"
            >

          </UButton>
        </div>
        
        <!-- Banner -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div class="flex items-start gap-3">
            <div class="w-5 h-5 bg-emerald-500 hover:bg-emerald-600 rounded-full flex-shrink-0 mt-0.5"></div>
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit</h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus temporibus sit,
                impedit adipisci perferendis incidunt accusantium neque, fuga, molestia.
              </p>
            </div>
            <button class="text-gray-400 hover:text-gray-600 ml-auto">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="space-y-4">
          <!-- Search -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              v-model="filters.searchText"
              type="text" 
              placeholder="Поиск по названию тура, заказчику, номеру заявки..."
              class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap gap-3 overflow-x-auto pb-2">
            <!-- Status Filter -->
            <UDropdown
              :list="statusList"
              v-model="filters.status"
              placeholder="Статус заявки"
            />

            <!-- Manager Filter -->
            <select v-model="filters.manager" class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-0 flex-shrink-0">
              <option value="">Менеджер</option>
              <option v-for="manager in managerList" :key="manager" :value="manager">{{ manager }}</option>
            </select>

            <!-- Date Filters -->
            <div class="relative flex-shrink-0">
              <input 
                type="text" 
                placeholder="Период создания тура"
                class="px-3 py-2 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer min-w-[180px]"
                readonly
              />
              <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
              </svg>
            </div>

            <div class="relative flex-shrink-0">
              <input 
                type="text" 
                placeholder="Даты туров"
                class="px-3 py-2 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer min-w-[140px]"
                readonly
              />
              <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
              </svg>
            </div>

            <button 
              @click="resetFilters"
              class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0"
            >
              Сбросить фильтры
            </button>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap items-center gap-2">
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center gap-1 px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                Ter 1
                <button class="text-white/70 hover:text-white">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </span>
              <span class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                Ter 1
              </span>
            </div>
            <button class="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 border border-dashed border-gray-300 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
              </svg>
              Добавить тег
            </button>
          </div>
        </div>
      </div>

      <!-- Tour Applications -->
      <div v-for="item in filteredOrders" :key="item.id" class="bg-white rounded-2xl p-4 sm:p-6 mb-6 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 class="text-lg font-medium text-gray-900">{{ item.title }}</h2>
          <div class="flex gap-2">
            <span class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              Ter 1
            </span>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                    Дата начала тура
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата окончания тура
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Забронировано
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Всего
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg w-24">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(booking, index) in item.bookings" :key="index" class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-4 text-sm text-gray-900">
                    {{ item.date_start }}
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-900">
                    {{ item.date_end }}
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-900">
                    {{ booking.customers ? booking.customers.length : 0 }}
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-900">
                    {{ item.bookings.length }}
                  </td>
                  <td class="px-4 py-4">
                    <span 
                      v-if="booking.status" 
                      :class="getStatusClass(booking.status)"
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {{ booking.status }}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex items-center gap-2">
                      <button class="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                
      
                      <router-link
                        :to="{ name: 'order-edit', params: { id: val.id } }"
                      >
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </router-link>
           
                      <button class="p-1 text-gray-400 hover:text-gray-600 transition-colors  rotate-90">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredOrders.length === 0" class="bg-white rounded-2xl p-8 text-center shadow-sm">
        <div class="text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-lg font-medium text-gray-900 mb-2">По вашему запросу ничего не найдено</p>
          <p class="text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
        </div>
      </div>
    </div>

    <!-- Modal for Adding Tags -->
    <div v-if="showTagModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl w-full max-w-md">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Добавить тег</h3>
          <button @click="showTagModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <div class="flex gap-3 mb-4">
            <input 
              v-model="newTagName"
              type="text" 
              placeholder="Имя тега"
              class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button 
              @click="addTag"
              class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
            >
              Добавить
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(tag, index) in modalTags" 
              :key="index"
              class="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
            >
              {{ tag }}
              <button @click="removeModalTag(index)" class="text-gray-400 hover:text-gray-600">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
