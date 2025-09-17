<template>
  <div class="space-y-4 mb-8">
    <div class="flex items-center">
      <span class="text-gray-700 font-medium w-32">Перевозчик:</span>
      <span class="text-gray-900">--</span>
    </div>
    <div class="flex items-center">
      <span class="text-gray-700 font-medium w-32">Отель:</span>
      <div class="flex-1">
        <select 
          v-if="editMode"
          v-model="selectedHotel" 
          :disabled="isLoadingEntities"
          class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option :value="{ id: '', title: '--' }">
            Выберите отель
          </option>
          <option 
            v-for="hotel in [...hotels, ...(selectedHotel ? [selectedHotel] : [])]" 
            :key="`hotel-${hotel.title}`" 
            :value="hotel"
          >
            {{ hotel.title }}
          </option>
        </select>
        <span v-else class="text-gray-900">
          {{ selectedHotel?.title || '--' }}
        </span>
        <div v-if="entitiesError" class="text-red-500 text-sm mt-1">
          {{ entitiesError }}
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <span class="text-gray-700 font-medium w-32">Объект питания:</span>
      <div class="flex-1">
        <select 
          v-if="editMode"
          v-model="selectedRestaurant" 
          :disabled="isLoadingEntities"
          class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option :value="{ id: '', title: '--' }">
            Выберите объект питания
          </option>
          <option 
            v-for="restaurant in [...restaurants, ...(selectedRestaurant ? [selectedRestaurant] : [])]" 
            :key="`restaurant-${restaurant.title}`" 
            :value="restaurant"
          >
            {{ restaurant.title }}
          </option>
        </select>
        <span v-else class="text-gray-900">
          {{ selectedRestaurant?.title || '--' }}
        </span>
        <div v-if="entitiesError" class="text-red-500 text-sm mt-1">
          {{ entitiesError }}
        </div>
        <div v-if="entitiesError" class="text-red-500 text-sm mt-1">
          {{ entitiesError }}
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <span class="text-gray-700 font-medium w-32">Гид:</span>
      <div class="flex-1">
        <select 
          v-if="editMode"
          v-model="selectedGuide" 
          :disabled="isLoadingEntities"
          class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option :value="{ id: '', title: '--' }">
            Выберите гида
          </option>
          <option 
            v-for="guide in [...guides, ...(selectedGuide ? [selectedGuide] : [])]" 
            :key="`guide-${guide.title}`" 
            :value="guide"
          >
            {{ guide.title }}
          </option>
        </select>
        <span v-else class="text-gray-900">
          {{ selectedGuide?.title || '--' }}
        </span>
        <div v-if="entitiesError" class="text-red-500 text-sm mt-1">
          {{ entitiesError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Tour } from '@/types/tour';
import type { Entity } from '@/types/entity';
import type { Service } from '@/types/service';
import { computed, onMounted, ref, watch } from 'vue';
import { useToursStore } from '@/stores/tours';

const props = defineProps<{
  currentItem: Tour;
  editMode: boolean;
  guide: Entity | null;
  hotel: Entity | null;
  restaurant: Entity | null;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
  (e: 'update:guide', value: Entity | null): void;
  (e: 'update:hotel', value: Entity | null): void;
  (e: 'update:restaurant', value: Entity | null): void;
}>();


const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value) {
    emit('update:currentItem', value);
  },
});

const selectedGuide = computed({
  get() {
    return props.guide;
  },
  set(value) {
    emit('update:guide', value);
  },
});

const selectedHotel = computed({
  get() {
    return props.hotel;
  },
  set(value) {
    emit('update:hotel', value);
  },
});

const selectedRestaurant = computed({
  get() {
    return props.restaurant;
  },
  set(value) {
    emit('update:restaurant', value);
  },
});

const toursStore = useToursStore();
const { isLoadingEntities, entitiesError, fetchEntities } = toursStore;

const isLoading = computed(() => toursStore.isLoadingEntities);
const guides = computed(() => toursStore.guides.filter(guide => guide.id !== selectedGuide.value?.id));
const hotels = computed(() => toursStore.hotels.filter(hotel => hotel.id !== selectedHotel.value?.id));
const restaurants = computed(() => toursStore.restaurants.filter(restaurant => restaurant.id !== selectedRestaurant.value?.id));
</script>
