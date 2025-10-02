<!-- Путь до страницы: orders/:id -->

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
       <Hint />
      </header>

      <!-- Content -->
        <!-- Search and Filters -->
           <div class="p-4 lg:p-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
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

          <div class="flex flex-wrap items-center gap-3 mb-4">
            <button 
              @click="resetFilters"
              class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Очистить все
              <XIcon class="w-4 h-4" />
            </button>

            <StatusSelector
              v-model="filters.status"
              :options="statusOptions"
              mode="dropdown"
              placeholder="Статус"
            />

            <StatusSelector
              v-model="filters.payment_status"
              :options="paymentOptions"
              placeholder="Статус оплаты"
            />

            <div class="relative">
              <select 
                v-model="filters.manager"
                class="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Менеджер</option>
                <option v-for="manager in managerList" :key="manager.id" :value="manager.id">
                  {{ manager.name }}
                </option>
              </select
              <ChevronDownIcon class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <DatePeriodPicker
              v-model="filters.order"
              start-placeholder="Период создания тура "
              end-placeholder=""
            />

            <DatePeriodPicker
              v-model="filters.tour_perioud"
              start-placeholder="Даты тура"
              end-placeholder="Даты тура"
            />
          </div>

       
        </div>
 <div v-if="loading" class="flex justify-center items-center py-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>

  <div v-else-if="error" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
    <div class="max-w-md mx-auto">
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки</h3>
      <p class="text-sm text-gray-600 mb-4">{{ error }}</p>
      <button 
        @click="loadData" 
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Попробовать снова
      </button>
    </div>
  </div>
        <!-- Results Info -->
         <div v-else>
      <div class="flex items-center justify-between mb-4">
  <p class="text-sm text-gray-600">
    ТУРЫ <span class="font-medium">{{ filteredOrders.length }}</span>
  </p>
  <div class="flex items-center gap-2" v-if="filteredOrders.length > 0">
    <span class="text-sm text-gray-600">Сортировка</span>
    <button class="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
      <ArrowUpDownIcon class="w-4 h-4" />
    </button>
  </div>
</div>

<!-- Table или сообщение о пустом списке -->
<div v-if="filteredOrders.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th 
            v-for="column in tableColumns" 
            :key="column.key"
            :class="[
              'px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-move relative',
              columnClasses[column.key]
            ]"
            draggable="true"
            @dragstart="onDragStart($event, column.key)"
            @dragover="onDragOver($event)"
            @drop="onDrop($event, column.key)"
            @dragenter="onDragEnter($event)"
            @dragleave="onDragLeave($event)"
          >
            <div class="flex items-center justify-between">
              
              <div class="flex items-center gap-1">
                <span class="text-gray-300 opacity-100 hover:opacity-100 transition-opacity
                 scale-150 mr-4">
                  ⠿
                </span>
                <span>{{ column.label }}</span>
              </div>
            </div>
            <div 
              class="absolute inset-0 bg-blue-300 border-2 border-blue-300 rounded pointer-events-none opacity-0 transition-opacity"
              :class="{ 'opacity-100': dragOverColumn === column.key }"
            ></div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="hover:bg-gray-50 transition-colors"
        >
          <td 
            v-for="column in tableColumns" 
            :key="column.key"
            :class="[
              'px-4 py-4 whitespace-nowrap text-sm',
              column.key === 'actions' ? 'text-right' : 'text-left',
              tdClasses[column.key]
            ]"
          >
            <template v-if="column.key === 'id'">
              <span class="font-medium text-gray-900">#{{ order.id }}</span>
            </template>
            
            <template v-else-if="column.key === 'created_at'">
              <span class="text-gray-600">{{ formatDate(order.created_at) }}</span>
            </template>
            
            <template v-else-if="column.key === 'tour'">
              <div class="max-w-xs">
                <p class="font-medium truncate text-gray-900">{{ order.tour?.title }}</p>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 ">
                    Тег 1
                  </span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 ">
                    Тег 2
                  </span>
                </div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'tour_id'">
              <span class="text-gray-600">#{{ order.tour?.id }}</span>
            </template>
            
            <template v-else-if="column.key === 'nights'">
              <span class="text-gray-600 text-center">{{ order.tour?.night_count || order.tour?.duration || 7 }}</span>
            </template>
            <template v-else-if="column.key === 'tour_start'">
              <span class="text-gray-600">{{ formatDate(order.tour?.date_start) }}</span>
            </template>
            <template v-else-if="column.key === 'tour_end'">
              <span class="text-gray-600">{{ formatDate(order.tour?.date_end) }}</span>
            </template>
             <template v-else-if="column.key === 'seats'">
              <span class="text-gray-600">{{ order.tour.seats}}</span>
            </template>
            
             <template v-else-if="column.key === 'customer'">
              <span class="text-gray-600">{{ order.customers[0].email }}</span>
            </template>
            
            
            <template v-else-if="column.key === 'status'">
              <span 
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusClass(order.status)
                ]"
              >
                {{ getStatusLabel(order.status) }}
              </span>
            </template>
               <template v-else-if="column.key === 'payment_deadline'">
              <span  :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getPaymentStatusClass(order.payment_status)
                ]" >{{ getPaymentStatusLabel(order.payment_status) }}</span>
            </template>
        
           

          </td>
  <td class="px-4 py-4  scale-150 "
    
  >
                    <div class="flex items-center gap-2">
                      <button class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                
      
                      <router-link
                        :to="{ name: 'order-edit', params: { id: order.id  } }"
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


<!-- Сообщение о пустом списке -->
<div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
  <div class="max-w-md mx-auto">
    <div class="flex justify-center mb-4">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">Заявок по туру не найдено</h3>
    <p class="text-sm text-gray-600">
      Попробуйте изменить параметры фильтрации или номер тура.
    </p>
  </div>
</div>
</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { getBookingByTourId } from '@/api/bookings'
import { useRouter,useRoute } from 'vue-router'
import { managerApi } from '@/api/managers'
import Hint from '@/components/static/Hint.vue'
import { ref, reactive, computed, onMounted } from 'vue'
import StatusSelector from '@/components/selectors/statuses/StatusSelector.vue'
import DatePeriodPicker from '@/components/selectors/date/DatePeriodPicker.vue'
const router = useRouter()
const route = useRoute();
const id = route.params.id;
const loading = ref(false)
const error = ref(null)



const tableColumns = ref([
  { key: 'id', label: 'Номер заявки' },
  { key: 'created_at', label: 'Дата создания' },
  { key: 'tour', label: 'Тур' },
  { key: 'tour_id', label: 'ID' },
  { key: 'nights', label: 'Кол-во ночей' },
  {key: 'tour_start', label: 'Дата начала тура'},
  { key: 'tour_end', label: 'Дата окончания тура' },
  { key: 'payment_deadline', label: 'Статус оплаты' },
  {key: 'seats', label: 'Лимит мест'},
  {key: 'customer', label: 'Еmail заказчика'},

])

// Состояния для drag and drop
const dragOverColumn = ref(null)
const draggedColumn = ref(null)

// Классы для колонок
const columnClasses = {
  'id': 'w-32',
  'created_at': 'w-36',
  'tour': 'w-64',
  'tour_id': 'w-24',
  'nights': 'w-32',
  'tour_start': 'w-36',
  'tour_end': 'w-36',
  'payment_deadline': 'w-36',
  'status': 'w-32',
  'actions': 'w-32'
}

const tdClasses = {
  'id': 'font-medium text-gray-900',
  'created_at': 'text-gray-600',
  'tour': 'text-gray-900',
  'tour_id': 'text-gray-600',
  'nights': 'text-gray-600',
  'tour_start': 'text-gray-600',
  'tour_end': 'text-gray-600',
  'payment_deadline': 'text-gray-600',
  'status': '',
  'actions': ''
}

// Методы для drag and drop
function onDragStart(event, columnKey) {
  draggedColumn.value = columnKey
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', columnKey)
  
  // Добавляем визуальный эффект при перетаскивании
}

function onDragOver(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

function onDrop(event, targetColumnKey) {
  event.preventDefault()
  
  if (draggedColumn.value && draggedColumn.value !== targetColumnKey) {
    const draggedIndex = tableColumns.value.findIndex(col => col.key === draggedColumn.value)
    const targetIndex = tableColumns.value.findIndex(col => col.key === targetColumnKey)
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Перемещаем колонку
      const [movedColumn] = tableColumns.value.splice(draggedIndex, 1)
      tableColumns.value.splice(targetIndex, 0, movedColumn)
      
      // Сохраняем порядок в localStorage
      saveColumnOrder()
    }
  }
  
  // Сбрасываем состояния
  dragOverColumn.value = null
  draggedColumn.value = null
  event.target.style.opacity = '1'
}

function onDragEnter(event, columnKey) {
  dragOverColumn.value = columnKey
}

function onDragLeave(event) {
  // Проверяем, что курсор действительно покинул элемент
  if (!event.currentTarget.contains(event.relatedTarget)) {
    dragOverColumn.value = null
  }
}

// Сохранение и загрузка порядка колонок
function saveColumnOrder() {
  const order = tableColumns.value.map(col => col.key)
  localStorage.setItem('tourTableColumnOrder', JSON.stringify(order))
}

function loadColumnOrder() {
  try {
    const savedOrder = localStorage.getItem('tourTableColumnOrder')
    if (savedOrder) {
      const order = JSON.parse(savedOrder)
      
      // Сортируем колонки согласно сохраненному порядку
      tableColumns.value.sort((a, b) => {
        const indexA = order.indexOf(a.key)
        const indexB = order.indexOf(b.key)
        return indexA - indexB
      })
    }
  } catch (error) {
    console.warn('Не удалось загрузить порядок колонок:', error)
  }
}

// Загружаем порядок колонок при монтировании
onMounted(() => {
  loadColumnOrder()
})

// Сброс порядка колонок (можно добавить кнопку для этого)
function resetColumnOrder() {
  tableColumns.value = [
    { key: 'id', label: 'Номер заявки' },
    { key: 'created_at', label: 'Дата создания' },
    { key: 'tour', label: 'Тур' },
    { key: 'tour_id', label: 'ID' },
    { key: 'nights', label: 'Кол-во ночей' },
    { key: 'tour_start', label: 'Дата окончания тура' },
    { key: 'tour_end', label: 'Дата окончания тура' },
    { key: 'payment_deadline', label: 'Срок оплаты (дн)' },
    { key: 'status', label: 'Статус' },
    { key: 'actions', label: 'Действия' }
  ]
  localStorage.removeItem('tourTableColumnOrder')
}
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
  payment_status: '',
  operator:'',
  tour_perioud: {
    start: '',
    end: ''
  },
  order: {
    start: '',
    end: ''
  }
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
  { value: 'pending', label: 'Новая', color: 'bg-green-400' },
  { value: 'confirmed', label: 'В работе', color: 'bg-yellow-400' },
  { value: 'completed', label: 'Завершено', color: 'bg-blue-400'},
  { value: 'cancelled', label: 'Аннулировано', color: 'bg-red-400' }
]
const paymentOptions = [
  { value: '', label: 'Все', color: 'bg-gray-400' },
  { value: 'pending', label: 'Не оплачено', color: 'bg-blue-400' },
  { value: 'paid_partially', label: 'Частично оплачено', color: 'bg-yellow-400' },
  { value: 'paid', label: 'Оплачено', color: 'bg-emerald-400' },
  { value: 'cancelled', label: 'Аннулировано', color: 'bg-red-400' },
  { value: 'refunded', label: 'Возврат', color: 'bg-gray-400' }
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
    const matchesPaymentStatus = !filters.payment_status || order.payment_status === filters.payment_status

    const matchesOrderDateRange = !filters.order.start || !filters.order.end ||
      (order.created_at && isDateInRange(order.created_at, filters.order.start, filters.order.end))

    const matchesTourPeriod = !filters.tour_perioud.start || !filters.tour_perioud.end ||
      (order.tour?.date_start && isDateInRange(order.tour.date_start, filters.tour_perioud.start, filters.tour_perioud.end))

    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesOrderDateRange && matchesTourPeriod
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
  filters.payment_status = ''
  filters.operator = ''
  filters.tour_perioud = { start: '', end: '' }
  filters.order = { start: '', end: '' }
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
function getPaymentStatusClass(status) {
  const statusClasses = {
    'paid': 'bg-emerald-100 text-emerald-800',
    'pending': 'bg-yellow-100 text:yellow-800',
    'cancelled': 'bg-red-100 text-red-800',
    'refunded': 'bg-gray-100 text-gray-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}
function getPaymentStatusLabel(status) {
  const statusLabels = {
    'paid': 'Оплачено',
    'pending': 'Не оплачено',
    'cancelled': 'Отменено',
    'refunded': 'Возвращено'
  }
  return statusLabels[status] || status
}
let orders = ref([])
let managerList = ref([])

// Правильная загрузка данных
async function loadData() {
  loading.value = true
  error.value = null
  
  try {
    // Проверяем наличие ID
    if (!id) {
      throw new Error('ID тура не указан')
    }

    // Параллельная загрузка данных
    const [ordersResponse, managersResponse] = await Promise.all([
      getBookingByTourId(id),
      managerApi.fetchData()
    ])

    // Обновляем данные
    orders.value = ordersResponse.data || []
    managerList.value = managersResponse.data || []

    // Проверяем, есть ли данные
    if (!orders.value.length) {
      console.log('Заявки по туру не найдены')
    }

  } catch (err) {
    console.error('Ошибка загрузки данных:', err)
    error.value = err.response?.data?.message || err.message || 'Произошла ошибка при загрузке данных'
  } finally {
    loading.value = false
  }
}

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadData()
})

import { watch } from 'vue'
watch(() => route.params.id, (newId) => {
  if (newId && newId !== id) {
    loadData()
  }
})
</script>