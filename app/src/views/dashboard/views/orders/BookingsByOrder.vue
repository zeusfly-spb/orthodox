<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->


    <!-- Main Content -->
<main 
  class="transition-all duration-300 ease-in-out min-h-screen bg-gray-50"

>
      <!-- Mobile Overlay -->
      <div 
        v-if="isSidebarExpanded" 
        class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
        @click="toggleSidebar"
      ></div>

      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
  <div class="flex items-center gap-4">
    <h1 class="text-xl lg:text-2xl font-semibold text-gray-900">
      {{ orders[0]?.tour?.title || 'Название тура' }}
    </h1>
  </div>
</div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button class="flex items-center gap-2 px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
              <DownloadIcon class="w-4 h-4" />
              <span class="text-sm font-medium">Скачать отчет</span>
            </button>
         <button 
    @click="router.push('/dashboard/order/new')"
    class="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
  >
    <PlusIcon class="w-4 h-4" />
    <span class="text-sm font-medium">Добавить новый заказ</span>
  </button>
          </div>
        </div>

        <!-- Info Banner -->
        <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
          <button 
            @click="showBanner = false"
            class="absolute top-2 right-2 p-1 hover:bg-blue-100 rounded"
          >
            <XIcon class="w-4 h-4 text-blue-600" />
          </button>
          <div class="flex items-start gap-3">
            <MapPinIcon class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-sm font-medium text-blue-900">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              <p class="text-xs text-blue-700 mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="p-4 lg:p-6">
        <!-- Search and Filters -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
          <!-- Search -->
          <div class="mb-4">
            <div class="relative">
              <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="filters.searchText"
                type="text"
                placeholder="Поиск по наименованию тура, заказчика, номеру заявки..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <button 
              @click="resetFilters"
              class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Очистить все
              <XIcon class="w-4 h-4" />
            </button>

            <!-- Status Filter -->
            <div class="relative">
              <select 
                v-model="filters.status"
                class="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Все</option>
                <option value="confirmed">Подтвержден</option>
                <option value="pending">Ожидает</option>
                <option value="cancelled">Отменен</option>
              </select>
              <ChevronDownIcon class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <!-- Manager Filter -->
            <div class="relative">
              <select 
                v-model="filters.manager"
                class="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Менеджер</option>
                <option v-for="manager in managerList" :key="manager" :value="manager">
                  {{ manager.name }}
                </option>
              </select>
              <ChevronDownIcon class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <!-- Date Filters -->
            <div class="flex items-center gap-2">
              <input
                v-model="filters.date_start"
                type="date"
                class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <span class="text-gray-400">—</span>
              <input
                v-model="filters.date_end"
                type="date"
                class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <!-- Status Filter Buttons -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="status in statusOptions"
              :key="status.value"
              @click="filters.status = filters.status === status.value ? '' : status.value"
              :class="[
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                filters.status === status.value
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <div 
                :class="[
                  'w-2 h-2 rounded-full',
                  status.color
                ]"
              ></div>
              {{ status.label }}
            </button>
          </div>
        </div>

        <!-- Results Info -->
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-600">
            ТУРЫ <span class="font-medium">{{ filteredOrders.length }}</span>
          </p>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Сортировка</span>
            <button class="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
              <ArrowUpDownIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Номер заявки
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата создания
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тур
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Кол-во ночей
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата окончания тура
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Срок оплаты (дн)
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="order in filteredOrders" 
                  :key="order.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{{ order.id }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatDate(order.created_at) }}
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-900">
                    <div class="max-w-xs">
                      <p class="font-medium truncate">{{ order.tour?.title }}</p>
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Тег 1
                        </span>
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Тег 2
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    #{{ order.tour?.id }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ order.tour?.night_count || order.tour?.duration || 7 }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatDate(order.tour?.date_end) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatDate(order.tour?.date_end) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span 
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getStatusClass(order.status)
                      ]"
                    >
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end gap-2">
                      <button class="text-gray-400 hover:text-gray-600">
                        <EyeIcon class="w-4 h-4" />
                      </button>
                      <button class="text-gray-400 hover:text-gray-600">
                        <LinkIcon class="w-4 h-4" />
                      </button>
                      <button class="text-gray-400 hover:text-gray-600">
                        <MoreHorizontalIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { getBookingByTourId } from '@/api/bookings'
import { useRouter } from 'vue-router'
import { managerApi } from '@/api/managers'
import { ref, reactive, computed, onMounted } from 'vue'
const router = useRouter()
// Icons (using simple SVG components)
const SearchIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" /></svg>`
}

const XIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>`
}

const ChevronDownIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>`
}

const DownloadIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`
}

const PlusIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>`
}

const MapPinIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.757.433l.018.008.006.003zM10 7a2 2 0 100 4 2 2 0 000-4z" clip-rule="evenodd" /></svg>`
}

const ArrowUpDownIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04L10 15.148l2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" /></svg>`
}

const EyeIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>`
}

const LinkIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" /></svg>`
}

const MoreHorizontalIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>`
}

const HomeIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clip-rule="evenodd" /></svg>`
}

const UsersIcon = {
  template: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>`
}

// Reactive data
const isSidebarExpanded = ref(false)
const selectedItem = ref(1)
const showBanner = ref(true)

const filters = reactive({
  searchText: '',
  status: '',
  manager: '',
  date_start: '',
  date_end: ''
})

// Sample data based on provided JSON structure


const menuItems = [
  { id: 1, name: 'Главная', icon: HomeIcon },
  { id: 2, name: 'Заказы', icon: UsersIcon },
  { id: 3, name: 'Туры', icon: MapPinIcon },
  { id: 4, name: 'Клиенты', icon: UsersIcon }
]

const statusOptions = [
  { value: '', label: 'Все', color: 'bg-gray-400' },
  { value: 'confirmed', label: 'Подтвержден', color: 'bg-emerald-400' },
  { value: 'pending', label: 'Ожидает', color: 'bg-yellow-400' },
  { value: 'cancelled', label: 'Отменен', color: 'bg-red-400' }
]

// Computed
const filteredOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return []

  return orders.value.filter(order => {
    const matchesSearch = !filters.searchText || 
      order.tour?.title?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      order.customers?.[0]?.firstname?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      order.customers?.[0]?.lastname?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      order.id.toString().includes(filters.searchText)

    const matchesStatus = !filters.status || order.status === filters.status

    const matchesDateRange = !filters.date_start || !filters.date_end ||
      (order.created_at && isDateInRange(order.created_at, filters.date_start, filters.date_end))

    return matchesSearch && matchesStatus && matchesDateRange
  })
})

// Methods
function toggleSidebar() {
  isSidebarExpanded.value = !isSidebarExpanded.value
}

function resetFilters() {
  filters.searchText = ''
  filters.status = ''
  filters.manager = ''
  filters.date_start = ''
  filters.date_end = ''
}

function isDateInRange(date, start, end) {
  const checkDate = new Date(date)
  const startDate = new Date(start)
  const endDate = new Date(end)
  return checkDate >= startDate && checkDate <= endDate
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function getStatusClass(status) {
  const statusClasses = {
    'confirmed': 'bg-emerald-100 text-emerald-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status) {
  const statusLabels = {
    'confirmed': 'Подтвержден',
    'pending': 'Ожидает',
    'cancelled': 'Отменен'
  }
  return statusLabels[status] || status
}
let orders = ref([])
let managerList = ref([])

// Правильная загрузка данных
async function loadData() {
  try {
    // Правильное обновление реактивных данных
    const ordersResponse = await getBookingByTourId(2)
    orders.value = ordersResponse.data
    
    const managersResponse = await managerApi.fetchData()
    managerList.value = managersResponse.data
    
    console.log(orders.value, managerList.value)
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
}
onMounted(() => {
  loadData()
})
</script>