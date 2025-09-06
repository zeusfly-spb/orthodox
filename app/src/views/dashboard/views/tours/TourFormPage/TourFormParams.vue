<template>
  <div class="tour-params">
    <div class="section-header">
      <h2 class="section-title">Параметры паломнического тура</h2>
      <button class="edit-button" @click="handleEdit">
        <Pencil class="w-4 h-4" />
      </button>
    </div>

    <div class="params-grid">
      <div class="params-column">
        <div class="param-item">
          <span class="param-label">Название паломнического тура</span>
          <span class="param-value">
            {{ tour.title }}
          </span>
        </div>

        <div class="param-item">
          <span class="param-label">Тип тура</span>
          <span class="param-value">
            {{ tour.tourType?.title }}
          </span>
        </div>

        <div class="param-item">
          <span class="param-label">Логистика тура</span>
          <span class="param-value">
            {{ tour.tourTransport?.title }}
          </span>
        </div>

        <div class="param-item">
          <span class="param-label">Категория тура</span>
          <span class="param-value">
            {{ tour.tourCategory?.title }}
          </span>
        </div>

        <div class="param-item">
          <span class="param-label">Страны</span>
          <span class="param-value">--, -- +1</span>
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
          <span class="param-value">--, -- +3</span>
        </div>

        <div class="param-item">
          <span class="param-label">Количество дней</span>
          <span class="param-value">{{ tour.duration }}</span>
        </div>

        <div class="param-item">
          <span class="param-label">Время начала</span>
          <span class="param-value">--:-- по МСК</span>
        </div>

        <div class="param-item">
          <span class="param-label">Дата начала</span>
          <span class="param-value">--</span>
        </div>

        <div class="param-item">
          <span class="param-label">Сложность</span>
          <div class="rating-container">
            <span class="param-value">Легкий</span>
            <div class="rating-dots">
              <span class="dot dot-empty"></span>
              <span class="dot dot-empty"></span>
              <span class="dot dot-empty"></span>
              <span class="dot dot-empty"></span>
              <span class="dot dot-empty"></span>
            </div>
          </div>
        </div>

        <div class="param-item">
          <span class="param-label">Комфорт</span>
          <div class="rating-container">
            <span class="param-value">Выше среднего</span>
            <div class="rating-dots">
              <span class="dot dot-empty"></span>
              <span class="dot dot-empty"></span>
              <span class="dot dot-empty"></span>
              <span class="dot dot-empty"></span>
              <span class="dot dot-empty"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';
import type { Tour } from '@/types/tour';
import { computed } from 'vue';

const props = defineProps<{
  currentItem: Tour;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
}>();

const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value: Tour) {
    emit('update:currentItem', value);
  },
});

const handleEdit = () => {
  console.log('Edit tour parameters');
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

.edit-button {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.edit-button:hover {
  color: #374151;
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
