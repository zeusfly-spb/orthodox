<template>
  <div class="tour-program">
    <div class="section-header">
      <h2 class="section-title">Программа тура</h2>
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

    <div class="program-content">
      <div class="days-tabs mb-6">
        <button
          v-for="(day, index) in (tour.days || [])"
          :key="index"
          @click="selectedDay = index"
          :class="[
            'day-tab',
            selectedDay === index ? 'day-tab-active' : 'day-tab-inactive'
          ]"
        >
          {{ index + 1 }} день
        </button>
      </div>

      <div class="day-activities mb-8">
        <div class="activities-list">
          <div v-if="currentDay" class="activity-item">
            <div v-if="editMode" class="edit-form">
              <div class="form-group">
                <label class="form-label">Название дня:</label>
                <input 
                  v-model="currentDayTitle" 
                  class="form-input"
                  placeholder="Введите название дня"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Описание программы:</label>
                <textarea 
                  v-model="currentDayDescription" 
                  class="form-textarea"
                  placeholder="Введите описание программы дня"
                  rows="4"
                ></textarea>
              </div>
            </div>
            <div v-else>
              <h3 class="day-title">{{ currentDay.title }}</h3>
              <p class="day-description">{{ currentDay.description }}</p>
            </div>
          </div>
          <div v-else class="activity-item">
            Нет данных для выбранного дня
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';
import type { Tour, DayItem } from '@/types/tour';
import { computed, ref, nextTick, watch } from 'vue';

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
  set(value) {
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

const focusFirstInput = async () => {
  await nextTick();
  
  const firstInput = document.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])') as HTMLElement;
  
  if (firstInput) {
    firstInput.focus();
  }
};

const handleEdit = () => {
  editMode.value = !editMode.value;
  
  if (editMode.value) {
    focusFirstInput();
  }
};

const selectedDay = ref(0);

const currentDay = computed<DayItem | undefined>(() => {
  if (!tour.value.days || !Array.isArray(tour.value.days) || selectedDay.value >= tour.value.days.length) {
    return undefined;
  }
  return tour.value.days[selectedDay.value];
});

const currentDayTitle = computed({
  get() {
    return currentDay.value?.title || '';
  },
  set(value: string) {
    if (!currentDay.value) return;
    
    const days = [...tour.value.days];
    days[selectedDay.value] = {
      ...days[selectedDay.value],
      title: value
    };
    
    const updatedTour = {
      ...tour.value,
      days: days
    };
    
    emit('update:currentItem', updatedTour);
  }
});

const currentDayDescription = computed({
  get() {
    return currentDay.value?.description || '';
  },
  set(value: string) {
    if (!currentDay.value) return;
    
    const days = [...tour.value.days];
    days[selectedDay.value] = {
      ...days[selectedDay.value],
      description: value
    };
    
    const updatedTour = {
      ...tour.value,
      days: days
    };
    
    emit('update:currentItem', updatedTour);
  }
});
</script>

<style scoped>
.tour-program {
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

.program-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.touchable {
  cursor: pointer;
  user-select: none;
}

.days-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.day-tab {
  padding: 0.75rem 1.5rem;
  border-radius: 1.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid;
  outline: none;
}

.day-tab-active {
  background-color: #374151;
  color: white;
  border-color: #374151;
}

.day-tab-inactive {
  background-color: white;
  color: #374151;
  border-color: #d1d5db;
}

.day-tab-inactive:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.day-activities {
  margin-bottom: 2rem;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-item {
  padding: 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
  border: none;
  background: none;
}

.day-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.day-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #6b7280;
  margin: 0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  background-color: white;
  transition: border-color 0.2s ease-in-out;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.program-gallery {
  margin-top: 2rem;
}

.gallery-images {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.gallery-image {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.gallery-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-more {
  width: 80px;
  height: 80px;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #6b7280;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .days-tabs {
    flex-wrap: wrap;
  }

  .day-tab {
    flex: 1;
    min-width: 80px;
    text-align: center;
  }

  .gallery-images {
    flex-wrap: wrap;
  }

  .gallery-image,
  .gallery-more {
    width: 60px;
    height: 60px;
  }
}
</style>
