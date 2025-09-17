<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p class="text-sm text-gray-500 mb-1">Количество мест в туре</p>
      <p class="text-lg font-semibold text-gray-900">{{ tour.seats - tour.customers_count }} / {{ tour.seats }}</p>
    </div>

    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p class="text-sm text-gray-500 mb-1">Гид</p>
      <div class="flex-1">
        <select 
          v-if="editMode"
          v-model="selectedGuide" 
          @change="handleGuideChange"
          :disabled="isLoadingEntities"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
        <p v-else class="text-lg font-semibold text-gray-900">
          {{ selectedGuide?.title || '--' }}
        </p>
        <div v-if="entitiesError" class="text-red-500 text-sm mt-1">
          {{ entitiesError }}
        </div>
      </div>
    </div>

    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p class="text-sm text-gray-500 mb-1">Стоимость</p>
      <p class="text-sm text-gray-600 mb-1">
        {{ formatCurrency(tour.price) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Tour } from '@/types/tour';
import type { Entity } from '@/types/entity';
import type { Service } from '@/types/service';
import { computed, onMounted, ref, watch } from 'vue';
import { useToursStore } from '@/stores/tours';

const { formatCurrency } = useToursStore();

const props = defineProps<{
  currentItem: Tour;
  editMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
}>();

const selectedGuide = ref<Entity | null>(null);

const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value) {
    emit('update:currentItem', value);
  },
});

const toursStore = useToursStore();
const { isLoadingEntities, entitiesError, fetchEntities } = toursStore;

const isLoading = computed(() => toursStore.isLoadingEntities);
const guides = computed(() => toursStore.guides.filter(guide => guide.id !== selectedGuide.value?.id));

const handleGuideChange = () => {
  const updatedTour = {
    ...tour.value,
  };
  
  tour.value = updatedTour;
};

const removeService = (slug: string) => {
  tour.value = {
    ...tour.value,
    services: tour.value.services.filter(service => 
      !(service.entity && service.entity.entityType && service.entity.entityType.slug === slug)
    ),
  };
};

onMounted(async () => {
  try {
    await fetchEntities();
    
    const existingGuideService = tour.value.services.find(service => 
      service.entity && service.entity.entityType && service.entity.entityType.slug === 'guide'
    );
    if (existingGuideService && existingGuideService.entity) {
      selectedGuide.value = existingGuideService.entity;
    } else {
      selectedGuide.value = { id: '', title: '--' } as Entity;
    }
    
    watch(selectedGuide, (newVal) => {
      removeService('guide');

      if (newVal && newVal.id && newVal.id !== '') {
        
        const newService: Service = {
          title: newVal.title,
          description: newVal.description || '',
          is_active: true,
          price: 0,
          type: 'basic',
          entity_id: newVal.id,
        };
        
        const filteredServices = tour.value.services.filter(service => 
          !service.entity
        );
        
        tour.value = {
          ...tour.value,
          services: [...filteredServices, newService],
        };
      }
    }, {deep: true});
  } catch (error) {
    console.error('Ошибка при загрузке сущностей:', error);
  }
});
</script>
