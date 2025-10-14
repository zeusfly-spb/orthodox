<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Карта маршрута</h2>
      <div class="flex items-center gap-4">
        <div v-if="routePoints.length > 0" class="text-sm text-gray-600">
          {{ routePoints.length }} {{ routePoints.length === 1 ? 'объект' : 'объектов' }} тура
        </div>
        <button
          v-if="routePoints.length > 0"
          :class="[
            'p-2 rounded-lg transition-colors touchable',
            editMode 
              ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'
          ]"
          @click="toggleEditMode"
          :title="editMode ? 'Завершить редактирование' : 'Редактировать порядок'"
        >
          <Pencil class="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div v-if="routePoints.length === 0" class="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div class="text-center">
        <div class="text-gray-500 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <p class="text-gray-500">Нет точек маршрута для отображения</p>
        <p class="text-sm text-gray-400 mt-1">Добавьте точки маршрута в разделе "Программа" для отображения карты</p>
      </div>
    </div>
    
    <div v-else class="h-96 rounded-lg overflow-hidden border">
      <RouteMap 
        :points="routePoints"
        :height="'100%'"
        :line-paint="{
          'line-color': '#3B82F6',
          'line-width': 4,
          'line-opacity': 0.8
        }"
        :circle-paint="{
          'circle-color': '#EF4444',
          'circle-radius': 8,
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 2
        }"
        @marker-click="handleMarkerClick"
      />
    </div>

    <div v-if="routePoints.length > 0" class="mt-6">
      <h3 class="text-lg font-medium mb-4">Точки маршрута</h3>
      <div class="space-y-3">
        <div 
          v-for="(point, index) in tour.points" 
          :key="point.id"
          :draggable="editMode"
          @dragstart="editMode ? handleDragStart($event, index) : null"
          @dragover="editMode ? handleDragOver($event, index) : null"
          @dragleave="editMode ? handleDragLeave() : null"
          @drop="editMode ? handleDrop($event, index) : null"
          @dragend="editMode ? handleDragEnd() : null"
          :class="[
            'flex items-start space-x-3 p-4 bg-white rounded-lg border transition-all duration-200',
            editMode ? 'cursor-move' : 'cursor-default',
            draggedIndex === index 
              ? 'border-blue-500 shadow-lg transform scale-105 bg-blue-50' 
              : draggedOverIndex === index 
                ? 'border-green-500 bg-green-50' 
                : editMode 
                  ? 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  : 'border-gray-200'
          ]"
        >
          <div v-if="editMode" class="flex-shrink-0 flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 cursor-move">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6h8v2H8V6zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"/>
            </svg>
          </div>
          <div class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
            {{ index + 1 }}
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="text-base font-medium text-gray-900 truncate">
                {{ point.title || point.entity?.title || `Точка ${index + 1}` }}
              </h4>
              <span v-if="point.time" class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {{ point.time }}
              </span>
            </div>
            
            <p v-if="point.description || point.entity?.description" class="text-sm text-gray-600 mt-1 line-clamp-2">
              {{ point.description || point.entity?.description }}
            </p>
            
            <div v-if="point.address" class="text-sm text-gray-500 mt-1 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ point.address }}
            </div>
          </div>
          
          <div v-if="point.entity?.location?.coordinates" class="flex-shrink-0">
            <div class="w-3 h-3 bg-green-400 rounded-full" title="Точка на карте"></div>
          </div>
        </div>
      </div>
      
      <div v-if="routePoints.length > 1 && editMode" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center text-sm text-blue-700">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Перетащите объекты для изменения порядка маршрута
        </div>
      </div>
      
      <div v-if="routePoints.length > 1 && !editMode" class="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          Включите режим редактирования для изменения порядка объектов
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '@/types/tour';
import { computed, ref } from 'vue';
import { Pencil } from 'lucide-vue-next';
import RouteMap from '@/components/maps/RouteMap.vue';

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
  (e: 'update:editMode', value: boolean): void;
}>();

const props = defineProps<{
  currentItem: Tour;
  editMode: boolean;
}>();

const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value: Tour) {
    emit('update:currentItem', value);
  },
});

const draggedIndex = ref<number | null>(null);
const draggedOverIndex = ref<number | null>(null);
const isDragging = ref(false);

const toggleEditMode = () => {
  emit('update:editMode', !props.editMode);
};

const routePoints = computed(() => {
  if (!tour.value.points || !Array.isArray(tour.value.points)) {
    return [];
  }

  return tour.value.points
    .filter(point => point.entity && point.entity.location && point.entity.location.coordinates)
    .map((point, index) => ({
      id: point.id,
      entity: {
        id: point.entity!.id,
        title: point.title || point.entity!.title || `Точка ${index + 1}`,
        description: point.description || point.entity!.description || '',
        location: {
          type: 'Point' as const,
          coordinates: point.entity!.location!.coordinates as [number, number]
        }
      }
    }));
});

const handleMarkerClick = (id: string | number | undefined) => {
  if (id !== undefined) {
    console.log('Клик по маркеру:', id);
  }
};

</script>
