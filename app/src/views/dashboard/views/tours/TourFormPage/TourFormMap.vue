<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Карта маршрута</h2>
      <div v-if="routePoints.length > 0" class="text-sm text-gray-600">
        {{ routePoints.length }} {{ routePoints.length === 1 ? 'точка' : 'точек' }} маршрута
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
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '@/types/tour';
import { computed } from 'vue';
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
