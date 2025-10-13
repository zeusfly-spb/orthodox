<template>
  <div>
    <TourFormHeader 
      :currentItem="tour" 
      v-model:editMode="editing" 
    />

    <TourFormOverview 
      v-model:currentItem="tour" 
      :editMode="editing" 
    />

    <TourFormCards 
      v-model:currentItem="tour" 
      :editMode="editing" 
      v-model:guide="selectedGuide"
    />

    <TourFormLogistics
      v-model:guide="selectedGuide"
      v-model:hotel="selectedHotel"
      v-model:currentItem="tour"
      v-model:restaurant="selectedRestaurant"
      v-model:transportation="selectedTransportation"
      :editMode="editing" 
    />

    <TourFormObjects 
      v-model:currentItem="tour" 
      :editMode="editing" 
    />

    <TourFormRatings 
      v-model:currentItem="tour" 
      :editMode="editing" 
    />

    <TourFormExtras 
      v-model:currentItem="tour" 
      :editMode="editing" 
    />

    <TourFormSummary 
      v-model:currentItem="tour" 
      :editMode="editing" 
    />
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '@/types/tour';
import TourFormHeader from './TourFormHeader.vue';
import TourFormOverview from './TourFormOverview.vue';
import TourFormCards from './TourFormCards.vue';
import TourFormLogistics from './TourFormLogistics.vue';
import TourFormObjects from './TourFormObjects.vue';
import TourFormRatings from './TourFormRatings.vue';
import TourFormExtras from './TourFormExtras.vue';
import TourFormSummary from './TourFormSummary.vue';
import type { Entity } from '@/types/entity';
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { useToursStore } from '@/stores/tours';
import type { Service } from '@/types/service';


const props = defineProps<{
  currentItem: Tour;
  editMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
  (e: 'update:editMode', value: boolean): void;
}>();

const selectedGuide = ref<Entity | null>(null);
const selectedHotel = ref<Entity | null>(null);
const selectedRestaurant = ref<Entity | null>(null);
const selectedTransportation = ref<Entity | null>(null);

const editing = computed({
  get() {
    return props.editMode;
  },
  set(value) {
    emit('update:editMode', value);
  },
});

const focusFirstInput = async () => {
  await nextTick();
  
  const firstInput = document.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])') as HTMLElement;
  
  if (firstInput) {
    firstInput.focus();
  }
};

watch(editing, async (newValue) => {
  if (newValue) {
    await focusFirstInput();
  }
});

const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value) {
    emit('update:currentItem', value);
  },
});

const toursStore = useToursStore();
const { fetchEntities } = toursStore;

const createService = (entity: Entity) => {
  return {
    title: entity.title,
    description: entity.description || '',
    is_active: true,
    price: 0,
    type: 'basic',
    entity_id: entity.id,
  };
};

const setDefaultServices = () => {
  const existingGuideService = tour.value.services.find(service => 
      service.entity && service.entity.entityType && service.entity.entityType.slug === 'guide'
    );
    const existingHotelService = tour.value.services.find(service => 
      service.entity && service.entity.entityType && service.entity.entityType.slug === 'accommodation'
    );
    const existingRestaurantService = tour.value.services.find(service => 
      service.entity && service.entity.entityType && service.entity.entityType.slug === 'meal'
    );
    const existingTransportationService = tour.value.services.find(service => 
      service.entity && service.entity.entityType && service.entity.entityType.slug === 'transport'
    );

    if (existingGuideService && existingGuideService.entity) {
      selectedGuide.value = existingGuideService.entity;
    } else {
      selectedGuide.value = { id: '', title: '--' } as Entity;
    }

    if (existingHotelService && existingHotelService.entity) {
      selectedHotel.value = existingHotelService.entity;
    } else {
      selectedHotel.value = { id: '', title: '--' } as Entity;
    }

    if (existingRestaurantService && existingRestaurantService.entity) {
      selectedRestaurant.value = existingRestaurantService.entity;
    } else {
      selectedRestaurant.value = { id: '', title: '--' } as Entity;
    }

    if (existingTransportationService && existingTransportationService.entity) {
      selectedTransportation.value = existingTransportationService.entity;
    } else {
      selectedTransportation.value = { id: '', title: '--' } as Entity;
    }
};

const stripService = (service: Service) => {
  delete service.id;  
  service.entity_id = service.entity?.id;
  delete service.entity;
  return service;
};

const filterServices = (slug: string) => {
  return tour.value.services
    .filter(service => 
      !(service.entity && service.entity.entityType && service.entity.entityType.slug === slug)
    ).map(service => stripService(service));
};

const realEntity = (entity: Entity | null) => entity && entity.id !== '';

const applyService = (entity: Entity | null, slug: string) => {
  let services = filterServices(slug);
  if (realEntity(entity)) {
    services = services.filter(service => service.title !== entity!.title && service.entity_id !== entity!.id);
    services.push(createService(entity!));
  }
  tour.value = {
  ...tour.value,
    services: [...services],
  };
};

onMounted(async () => {
  try {
    await fetchEntities();

    setDefaultServices();
    
    watch(selectedGuide, (newVal) => {
      applyService(newVal, 'guide');
    });

    watch(selectedHotel, (newVal) => {
      applyService(newVal, 'accommodation');
    });

    watch(selectedRestaurant, (newVal) => {
      applyService(newVal, 'meal');
    });

    watch(selectedTransportation, (newVal) => {
      applyService(newVal, 'transport');
    });

  } catch (error) {
    console.error('Ошибка при загрузке сущностей:', error);
  }
});
</script>
