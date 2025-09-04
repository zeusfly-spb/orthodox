<template>
  <div class="tour-description">
    <div class="section-header">
      <h2 class="section-title">Описание</h2>
      <button 
      class="edit-button" 
      @click="handleEdit"
      title="Редактировать описание"
      >
        <Pencil class="w-4 h-4" />
      </button>
    </div>

    <div class="description-content">
      <p class="description-text">
        {{ tour.description }}
      </p>
      
      <button class="read-more-link" @click="handleReadMore">
        Читать подробнее
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';
import type { Tour } from '@/types/tour';
import { computed } from 'vue';

const props = defineProps <{
  currentItem: Tour;
}>();

const emit = defineEmits<{
    (e: 'update:currentItem', value: Tour): void;
}>();

const tour = computed({
    get() {
        return props.currentItem;
    },
    set(value) {
        emit('update:currentItem', value);
    }
});

const handleEdit = () => {
  console.log('Edit tour description');
};

const handleReadMore = () => {
  console.log('Read more about tour');
};
</script>

<style scoped>
.tour-description {
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.edit-button {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  /* background-color: #f3f4f6; */
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.edit-button:hover {
  /* background-color: #e5e7eb; */
  color: #374151;
}

.description-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.description-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  margin: 0;
  text-align: justify;
}

.read-more-link {
  background: none;
  border: none;
  color: #3b82f6;
  text-decoration: underline;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  align-self: flex-start;
  transition: color 0.15s ease-in-out;
}

.read-more-link:hover {
  color: #2563eb;
  text-decoration: none;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .tour-description {
    padding: 1rem;
  }
  
  .description-text {
    font-size: 0.875rem;
  }
}
</style>