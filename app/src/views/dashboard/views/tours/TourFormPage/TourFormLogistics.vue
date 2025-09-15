<template>
  <div class="space-y-4 mb-8">
    <div class="flex items-center">
      <span class="text-gray-700 font-medium w-32">Перевозчик:</span>
      <span class="text-gray-900">--</span>
    </div>
    <div class="flex items-center">
      <span class="text-gray-700 font-medium w-32">Отель:</span>
      <span class="text-gray-900">--</span>
    </div>
    <div class="flex items-center">
      <span class="text-gray-700 font-medium w-32">Объект питания:</span>
      <button class="text-blue-600 hover:text-blue-800 underline">--</button>
    </div>
    <div class="flex items-center">
      <span class="text-gray-700 font-medium w-32">Гид:</span>
      <div class="flex-1">
        <!-- В режиме редактирования показываем селект -->
        <select 
          v-if="editMode"
          v-model="selectedGuide" 
          @change="handleGuideChange"
          :disabled="isLoadingEntities"
          class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option :value="{ id: '', title: '--' }">
            Выберите гида
          </option>
          <option 
            v-for="guide in guides" 
            :key="guide.id" 
            :value="guide"
          >
            {{ guide.title }}
          </option>
        </select>
        <!-- В режиме просмотра показываем просто текст -->
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

// Используем хранилище туров для работы с гидами
const toursStore = useToursStore();
const { isLoadingEntities, entitiesError, fetchEntities } = toursStore;

// Выбранный гид

const isLoading = computed(() => toursStore.isLoadingEntities);
const guides = computed(() => toursStore.guides);


// Обработчик изменения гида
const handleGuideChange = () => {
  
  // Обновляем тур с выбранным гидом
  const updatedTour = {
    ...tour.value,
  };
  
  tour.value = updatedTour;
};

onMounted(async () => {
  try {
    await fetchEntities();
    
    // Инициализируем выбранного гида, если он уже есть в туре
    const existingGuideService = tour.value.services.find(service => 
      service.entity && service.entity.entityType && service.entity.entityType.slug === 'guide'
    );
    if (existingGuideService && existingGuideService.entity) {
      selectedGuide.value = existingGuideService.entity;
    } else {
      selectedGuide.value = { id: '', title: '--' } as Entity;
    }
    
    watch(selectedGuide, (newVal) => {
      if (newVal && newVal.id && newVal.id !== '') {
        // Добавляем сервис с правильной структурой
        const newService: Service = {
          // id: Date.now(), // временный ID
          title: newVal.title,
          description: newVal.description || '',
          is_active: true,
          price: 0,
          type: 'basic', // добавляем обязательное поле type (допустимые значения: basic, extra)
          entity_id: newVal.id, // ID сущности
        };
        
        const filteredServices = tour.value.services.filter(service => 
          !service.entity
        );
        
        tour.value = {
          ...tour.value,
          services: [...filteredServices, newService],
        };
      } else {
        // Удаляем сервис-гид (ищем по entity.entityType.slug)
        tour.value = {
          ...tour.value,
          services: tour.value.services.filter(service => 
            !(service.entity && service.entity.entityType && service.entity.entityType.slug === 'guide')
          ),
        };
      }
    }, {immediate: true, deep: true});
  } catch (error) {
    console.error('Ошибка при загрузке сущностей:', error);
  }
});
</script>
