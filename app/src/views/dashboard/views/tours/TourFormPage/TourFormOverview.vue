<template>
  <div class="flex gap-6 mb-8">
    <!-- Thumbnail -->
    <div class="flex-shrink-0">
      <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
        <div class="w-16 h-16 bg-yellow-400 rounded-full"></div>
      </div>
    </div>
    <!-- Main Info -->
    <div class="flex-1">
      <!-- Заголовок тура -->
      <h2 v-if="!editMode" class="text-xl font-semibold text-gray-900 mb-2">
        {{ tour.title || 'Загрузка данных...' }}
      </h2>
      
      <!-- Инпут для редактирования заголовка -->
      <div v-if="editMode" class="mb-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Название тура
        </label>
        <input
          v-model="tourTitle"
          type="text"
          class="input-field"
          placeholder="Введите название тура"
        />
      </div>
      <p class="text-gray-600 mb-2">
        {{ datesString }}
      </p>
      
      <Badge
        v-if="tour.tourStatus && !editMode"
        :type="tour.tourStatus?.slug"
        :caption="tour.tourStatus?.title"
      />
      
      <!-- Выбор статуса тура -->
      <div v-if="editMode && tourStatuses.length > 0" class="mt-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Статус тура
        </label>
        <div class="custom-select inline-block">
          <select 
            v-model="selectedStatusId" 
            class="filter-select"
            @change="handleStatusChange"
          >
            <option value="" disabled>Выберите статус</option>
            <option 
              v-for="status in tourStatuses" 
              :key="status.id" 
              :value="status.id"
            >
              {{ status.title }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Badge from '@/components/app/Badge.vue';
import type { Tour } from '@/types/tour';
import { useToursStore } from '@/stores/tours';

const { formattedDate } = useToursStore();

const props = defineProps<{
  currentItem: Tour;
  editMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
}>();

const tourStatuses = computed(() => useToursStore().tourStatuses);

const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value) {
    emit('update:currentItem', value);
  },
});

const selectedStatusId = ref(props.currentItem.tourStatus?.id || '');

const tourTitle = computed({
  get() {
    return tour.value.title;
  },
  set(value) {
    tour.value = { ...tour.value, title: value };
  },
});

const handleStatusChange = () => {
  const selectedStatus = tourStatuses.value.find(status => status.id === selectedStatusId.value);
  if (selectedStatus) {
    tour.value = {
      ...tour.value,
      parameters: {
        ...tour.value.parameters,
        tourStatus: selectedStatus.id
      },
      tourStatus: {
        id: selectedStatus.id,
        slug: selectedStatus.slug,
        title: selectedStatus.title
      }
    };
  } else {
    tour.value = {
      ...tour.value,
      parameters: {
        ...tour.value.parameters,
        tourStatus: null
      },
      tourStatus: undefined
    };
  }
};

watch(() => tour.value.tourStatus, (newStatus) => {
  if (newStatus) {
    const status = tourStatuses.value.find(s => s.slug === newStatus.slug);
    selectedStatusId.value = status?.id || '';
  } else {
    selectedStatusId.value = '';
  }
}, { immediate: true });

watch(() => tour.value.parameters?.tourStatus, (newStatusId) => {
  if (newStatusId) {
    selectedStatusId.value = newStatusId.toString();
  } else {
    selectedStatusId.value = '';
  }
}, { immediate: true });

const datesString = computed(() => {
  if (!tour.value.date) {
    return 'Даты не указаны';
  }
  return `${formattedDate(tour.value.date)} / ${formattedDate(tour.value.date_end)}`;
});
</script>

<style scoped>
.custom-select {
  position: relative;
  display: inline-block;
  z-index: auto;
}

.filter-select {
  min-width: 200px;
  max-width: 300px;
  padding: 10px 14px;
  padding-right: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: 0;
  border-color: #94a3b8;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}

.filter-select option[disabled][selected] {
  color: #94a3b8;
}

.input-field {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  transition: all 0.2s;
}

.input-field:focus {
  outline: 0;
  border-color: #94a3b8;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}
</style>
