<template>
  <div class="tour-description">
    <div class="section-header">
      <h2 class="section-title">Описание</h2>
      <button
        :class="[
          'p-2 rounded-lg transition-colors touchable',
          editMode 
            ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        ]"
        @click="handleEdit"
        title="Редактировать описание"
      >
        <Pencil class="w-4 h-4" />
      </button>
    </div>

    <div class="description-content">
      <Textarea 
        v-if="editMode" 
        v-model="tourDescription" 
        class="description-textarea"
        placeholder="Введите описание тура"
        rows="6"
      />
      <p v-else class="description-text">
        {{ tour.description }}
      </p>

      <button v-if="!editMode" class="read-more-link" @click="handleReadMore">Читать подробнее</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';
import { Textarea } from '@/components/ui/textarea';
import type { Tour } from '@/types/tour';
import { computed } from 'vue';

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

const tourDescription = computed({
  get() {
    return tour.value.description || '';
  },
  set(value: string) {
    tour.value = { ...tour.value, description: value };
  },
});

const handleEdit = () => {
  editMode.value = !editMode.value;
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

.description-textarea {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
  resize: vertical;
  min-height: 120px;
}

.description-textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .tour-description {
    padding: 1rem;
  }

  .description-text {
    font-size: 0.875rem;
  }

  .description-textarea {
    font-size: 0.875rem;
  }
}
</style>
