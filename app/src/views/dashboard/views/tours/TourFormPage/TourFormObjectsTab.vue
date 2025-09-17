<template>
  <div class="tour-objects">
    <div class="section-header">
      <h2 class="section-title">Объекты в туре</h2>
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
    <div v-if="isLoading">
      <div class="flex justify-center items-center h-full">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </div>
    <div v-else class="flex items-center w-full mt-4">
        <table class="w-full">
          <thead>
            <tr>
              <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">Объект</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">Тип</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="object in objects" :key="object.id">
              <td class="text-left py-3 px-4">{{ object.title }}</td>
              <td class="text-left py-3 px-4">{{ object.entityType.title }}</td>
            </tr>
          </tbody>
        </table>
    </div>
    <div v-if="entitiesError" class="text-red-500 text-sm mt-1">
      {{ entitiesError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '@/types/tour';
import { computed } from 'vue';
import { useToursStore } from '@/stores/tours';
import { Pencil } from 'lucide-vue-next';

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

const toursStore = useToursStore();
const { isLoadingEntities, entitiesError, fetchEntities } = toursStore;

const isLoading = computed(() => toursStore.isLoadingEntities);
const objects = computed(() => toursStore.objects.filter(object => object.id !== tour.value.id));

const handleEdit = () => {
  editMode.value = !editMode.value;
};
</script>

<style scoped>
.tour-objects {
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
</style>