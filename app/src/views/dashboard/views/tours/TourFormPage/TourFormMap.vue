<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Карта маршрута</h2>
      <div v-if="routePoints.length > 0" class="text-sm text-gray-600">
        {{ routePoints.length }} {{ routePoints.length === 1 ? 'объект' : 'объектов' }} тура
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
        <p class="text-gray-500">Нет объектов тура для отображения</p>
        <p class="text-sm text-gray-400 mt-1">Добавьте объекты тура для отображения маршрута на карте</p>
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
      <h3 class="text-lg font-medium mb-4">Объекты тура</h3>
      <div class="space-y-3">
        <div 
          v-for="(point, index) in routePoints" 
          :key="point.id"
          :draggable="true"
          @dragstart="handleDragStart($event, index)"
          @dragover="handleDragOver($event, index)"
          @dragleave="handleDragLeave"
          @drop="handleDrop($event, index)"
          @dragend="handleDragEnd"
          :class="[
            'flex items-start space-x-3 p-4 bg-white rounded-lg border transition-all duration-200 cursor-move',
            draggedIndex === index 
              ? 'border-blue-500 shadow-lg transform scale-105 bg-blue-50' 
              : draggedOverIndex === index 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          ]"
        >
          <div class="flex-shrink-0 flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 cursor-move">
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
                {{ point.entity.title }}
              </h4>
            </div>
            
            <p v-if="point.entity.description" class="text-sm text-gray-600 mt-1 line-clamp-2">
              {{ point.entity.description }}
            </p>
            
            <div v-if="point.entity.location?.coordinates" class="text-sm text-gray-500 mt-1 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ point.entity.location.coordinates[1].toFixed(4) }}, {{ point.entity.location.coordinates[0].toFixed(4) }}
            </div>
          </div>
          
          <div v-if="point.entity.location?.coordinates" class="flex-shrink-0">
            <div class="w-3 h-3 bg-green-400 rounded-full" title="Объект на карте"></div>
          </div>
        </div>
      </div>
      
      <div v-if="routePoints.length > 1" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center text-sm text-blue-700">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Перетащите объекты для изменения порядка маршрута
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '@/types/tour';
import { computed, ref } from 'vue';
import RouteMap from '@/components/maps/RouteMap.vue';

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
}>();

const props = defineProps<{
  currentItem: Tour;
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

const routePoints = computed(() => {
  if (!tour.value.entities || !Array.isArray(tour.value.entities)) {
    return [];
  }

  const filtered = tour.value.entities.filter(entity => 
    entity && entity.entity && entity.entity.location && entity.entity.location.coordinates
  );

  return filtered.map((entity, index) => ({
    id: entity.entity.id,
    title: entity.entity.title || `Объект ${index + 1}`,
    description: entity.entity.description || '',
    location: {
      type: 'Point' as const,
      coordinates: entity.entity.location.coordinates as [number, number]
    },
    entity: entity.entity
  }));
});

const handleMarkerClick = (id: string | number | undefined) => {
};

const handleDragStart = (event: DragEvent, index: number) => {
  draggedIndex.value = index;
  isDragging.value = true;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', '');
  }
};

const handleDragOver = (event: DragEvent, index: number) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  draggedOverIndex.value = index;
};

const handleDragLeave = () => {
  draggedOverIndex.value = null;
};

const handleDrop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault();
  
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
    resetDragState();
    return;
  }

  reorderEntities(draggedIndex.value, dropIndex);
  resetDragState();
};

const handleDragEnd = () => {
  resetDragState();
};

const resetDragState = () => {
  draggedIndex.value = null;
  draggedOverIndex.value = null;
  isDragging.value = false;
};

const reorderEntities = (fromIndex: number, toIndex: number) => {
  if (!tour.value.entities || !Array.isArray(tour.value.entities)) {
    return;
  }

  const newEntities = [...tour.value.entities];
  const [movedEntity] = newEntities.splice(fromIndex, 1);
  newEntities.splice(toIndex, 0, movedEntity);

  tour.value = {
    ...tour.value,
    entities: newEntities
  };
};

</script>
