<template>
  <div class="tour-params">
    <div class="section-header">
      <h2 class="section-title">Параметры паломнического тура</h2>
      <button
        :class="[
          'p-2 rounded-lg transition-colors touchable',
          editMode 
            ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        ]"
        @click="handleEdit"
      >
        <Pencil class="w-4 h-4" />
      </button>
    </div>

    <div class="params-grid">
      <div class="params-column">
        <div class="param-item">
          <span class="param-label">Название паломнического тура</span>
          <Input 
            v-if="editMode" 
            v-model="tourTitle" 
            class="param-input"
            placeholder="Введите название тура"
          />
          <span v-else class="param-value">
            {{ tour.title }}
          </span>
        </div>

        <div class="param-item">
          <span class="param-label">Тип тура</span>
          <select 
            v-if="editMode && tourTypes.length > 0" 
            v-model="selectedTourTypeId" 
            class="param-select"
          >
            <option value="" disabled>Выберите тип тура</option>
            <option 
              v-for="type in tourTypes" 
              :key="type.id" 
              :value="type.id"
            >
              {{ type.title }}
            </option>
          </select>
          <span v-else class="param-value">
            {{ tour.tourType?.title || 'Не указан' }}
          </span>
        </div>

        <div class="param-item">
          <span class="param-label">Логистика тура</span>
          <select 
            v-if="editMode && tourTransports.length > 0" 
            v-model="selectedTourTransportId" 
            class="param-select"
          >
            <option value="" disabled>Выберите логистику</option>
            <option 
              v-for="transport in tourTransports" 
              :key="transport.id" 
              :value="transport.id"
            >
              {{ transport.title }}
            </option>
          </select>
          <span v-else class="param-value">
            {{ tour.tourTransport?.title || 'Не указана' }}
          </span>
        </div>

        <div class="param-item">
          <span class="param-label">Категория тура</span>
          <select 
            v-if="editMode && tourCategories.length > 0" 
            v-model="selectedTourCategoryId" 
            class="param-select"
          >
            <option value="" disabled>Выберите категорию</option>
            <option 
              v-for="category in tourCategories" 
              :key="category.id" 
              :value="category.id"
            >
              {{ category.title }}
            </option>
          </select>
          <span v-else class="param-value">
            {{ tour.tourCategory?.title || 'Не указана' }}
          </span>
        </div>

        <div class="param-item">
          <span class="param-label">Страны</span>
          <span class="param-value">--</span>
        </div>

        <div class="param-item">
          <span class="param-label">Страна начала</span>
          <span class="param-value">--</span>
        </div>

        <div class="param-item">
          <span class="param-label">Город начала</span>
          <span class="param-value">--</span>
        </div>
      </div>
      <div class="params-column">
        <div class="param-item">
          <span class="param-label">Города</span>
          <span class="param-value">--</span>
        </div>

        <div class="param-item">
          <span class="param-label">Количество дней</span>
          <Input 
            v-if="editMode" 
            v-model="tourDuration" 
            type="number"
            class="param-input"
            placeholder="Введите количество дней"
            min="1"
          />
          <span v-else class="param-value">{{ tour.duration }}</span>
        </div>

        <div class="param-item">
          <span class="param-label">Время начала</span>
          <div v-if="editMode" class="time-input-container">
            <Input 
              v-model="tourStartTime" 
              type="time"
              class="param-input"
            />
          </div>
          <span v-else class="param-value">
            {{ tour.time }}
          </span>
        </div>

        <div class="param-item">
          <span class="param-label">Дата начала</span>
          <div v-if="editMode" class="date-input-container">
            <Input 
              v-model="tourStartDate" 
              type="date"
              class="param-input"
            />
          </div>
          <span v-else class="param-value">
            {{ tour.date ? formatDate(tour.date) : 'Не указана' }}
          </span>
        </div>

        <div class="param-item">
          <span class="param-label">Сложность</span>
          <DotControl 
              v-model:currentItem="tour"
              fieldName="difficulty"
              :editMode="editMode"                                           
            />
        </div>

        <div class="param-item">
          <span class="param-label">Комфорт</span>
            <DotControl 
              v-model:currentItem="tour"
              fieldName="comfort"
              :editMode="editMode"                                           
            />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import type { Tour } from '@/types/tour';
import { computed, nextTick, watch } from 'vue';
import { useToursStore } from '@/stores/tours';
import DotControl from '@/components/dashboard/tours/DotControl.vue';

const props = defineProps<{
  currentItem: Tour;
  editMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
  (e: 'update:editMode', value: boolean): void;
}>();

const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value: Tour) {
    emit('update:currentItem', value);
  },
});

const editMode = computed({
  get() {
    return props.editMode;
  },
  set(value) {
    emit('update:editMode', value);
  },
});

const toursStore = useToursStore();
const tourTypes = computed(() => toursStore.tourTypes);
const tourTransports = computed(() => toursStore.tourTransports);
const tourCategories = computed(() => toursStore.tourCategories);

const tourTitle = computed({
  get() {
    return tour.value.title;
  },
  set(value: string) {
    tour.value = { ...tour.value, title: value };
  },
});

const focusFirstInput = async () => {
  await nextTick();
  
  const firstInput = document.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])') as HTMLElement;
  
  if (firstInput) {
    firstInput.focus();
  }
};

watch(() => props.editMode, async (newValue) => {
  if (newValue) {
    await focusFirstInput();
  }
});

const selectedTourTypeId = computed({
  get() {
    return (tour.value.parameters as any)?.tourType || '';
  },
  set(value: string | number | null) {
    const selectedType = tourTypes.value.find(type => type.id === value);
    tour.value = {
      ...tour.value,
      parameters: {
        ...tour.value.parameters,
        tourType: value
      } as any,
      tourType: selectedType ? {
        id: selectedType.id,
        slug: selectedType.slug,
        title: selectedType.title
      } : undefined
    };
  },
});

const selectedTourTransportId = computed({
  get() {
    return (tour.value.parameters as any)?.tourTransport || '';
  },
  set(value: string | number | null) {
    const selectedTransport = tourTransports.value.find(transport => transport.id === value);
    tour.value = {
      ...tour.value,
      parameters: {
        ...tour.value.parameters,
        tourTransport: value
      } as any,
      tourTransport: selectedTransport ? {
        id: selectedTransport.id,
        slug: selectedTransport.slug,
        title: selectedTransport.title
      } : undefined
    };
  },
});

const selectedTourCategoryId = computed({
  get() {
    return (tour.value.parameters as any)?.tourCategory || '';
  },
  set(value: string | number | null) {
    const selectedCategory = tourCategories.value.find(category => category.id === value);
    tour.value = {
      ...tour.value,
      parameters: {
        ...tour.value.parameters,
        tourCategory: value
      } as any,
      tourCategory: selectedCategory ? {
        id: selectedCategory.id,
        slug: selectedCategory.slug,
        title: selectedCategory.title
      } : undefined
    };
  },
});

const tourDuration = computed({
  get() {
    return tour.value.duration;
  },
  set(value: number) {
    tour.value = { ...tour.value, duration: value };
  },
});

const tourStartDate = computed({
  get() {
    if (!tour.value.date) return '';
    if (tour.value.date.includes('T')) {
      return tour.value.date.split('T')[0];
    }
    return tour.value.date;
  },
  set(value: string) {
    if (!value) {
      tour.value = { ...tour.value, date: '' };
      return;
    }
    
    tour.value = { ...tour.value, date: value };
  },
});

const tourStartTime = computed({
  get() {
    return tour.value.time || '00:00';
  },
  set(value: string) {
    tour.value = { ...tour.value, time: value };
  },
});

const formatDate = (dateString: string) => {
  if (!dateString) return 'Не указана';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatTime = (dateString: string) => {
  if (!dateString) return 'Не указано';
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + ' по МСК';
};

const handleEdit = () => {
  editMode.value = !editMode.value;
};
</script>

<style scoped>
.tour-params {
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}


.params-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.params-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.param-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.param-value {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
}

.param-input {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 12px;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}

.param-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.param-select {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 32px 8px 12px;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  transition: all 0.2s ease-in-out;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  min-width: 200px;
}

.param-select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
}

.param-select option[disabled] {
  color: #9ca3af;
}

.date-input-container {
  display: flex;
  align-items: center;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rating-dots {
  display: flex;
  gap: 0.25rem;
}

.dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  transition: all 0.15s ease-in-out;
}

.dot-filled {
  background-color: #10b981;
}

.dot-empty {
  background-color: #d1d5db;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .params-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .rating-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
