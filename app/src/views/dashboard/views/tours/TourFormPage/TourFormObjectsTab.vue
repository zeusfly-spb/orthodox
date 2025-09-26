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
        title="Редактировать объекты"
      >
        <Pencil class="w-4 h-4" />
      </button>
    </div>
    <div v-if="isLoading">
      <Spinner />
    </div>
    <div v-else class="flex items-center w-full mt-4">
        <table class="w-full">
          <thead>
            <tr>
              <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">Объект</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">Тип</th>
              <th v-if="editMode" class="text-center py-3 px-4 font-medium text-gray-700 border-b border-gray-200 w-16">Действия</th>
            </tr>
            <tr v-if="editMode">
              <td colspan="3" class="py-3 px-4 border-b border-gray-200">
                <div class="flex flex-col gap-2">
                  <div class="search-input-wrapper">
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Поиск объектов..."
                      class="search-input"
                    />
                    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  
                  <div v-if="searchQuery.trim()" class="search-results">
                    <div class="search-results-header">
                      <span class="search-results-count">
                        Найдено: {{ availableEntities.length }} {{ getResultsText(availableEntities.length) }}
                      </span>
                      <button 
                        @click="clearSearch"
                        class="clear-search-btn"
                        title="Очистить поиск"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div v-if="availableEntities.length > 0" class="search-results-list">
                      <div 
                        v-for="entity in availableEntities" 
                        :key="entity.id"
                        @click="selectEntity(entity)"
                        class="search-result-item"
                      >
                        <div class="entity-info">
                          <div class="entity-title">{{ entity.title }}</div>
                          <div class="entity-type">{{ entity.entityType.title }}</div>
                        </div>
                        <div class="add-icon">+</div>
                      </div>
                    </div>
                    
                    <div v-else class="no-results">
                      <p>По вашему запросу ничего не найдено</p>
                      <button 
                        @click="createNewObject"
                        class="create-object-btn"
                      >
                        <svg class="create-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Создать новый объект
                      </button>
                    </div>
                  </div>
                  
                  <select 
                    v-if="!searchQuery.trim()"
                    v-model="selectedEntityId" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @change="addEntity"
                  >
                    <option value="">Выберите объект для добавления</option>
                    <option 
                      v-for="entity in availableEntities" 
                      :key="entity.id" 
                      :value="entity.id"
                    >
                      {{ entity.title }} ({{ entity.entityType.title }})
                    </option>
                  </select>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entity in entities" :key="entity.id">
              <td class="text-left py-3 px-4">{{ entity.title }}</td>
              <td class="text-left py-3 px-4">{{ entity.entityType.title }}</td>
              <td v-if="editMode" class="text-center py-3 px-4">
                <button
                  @click="removeEntity(entity.id)"
                  class="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-100 active:bg-red-200 transition-colors touchable"
                  title="Удалить объект"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
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
import { computed, ref, onMounted, nextTick, watch } from 'vue';
import { useToursStore } from '@/stores/tours';
import { Pencil, Trash2, Plus } from 'lucide-vue-next';
import Spinner from '@/components/app/Spinner.vue';

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

const entities = computed(() => tour.value.entities.map((item: any) => item.entity));

const searchQuery = ref('');

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
const selectedEntityId = ref<string | number>('');

const availableEntities = computed(() => {
  const currentEntityIds = entities.value.map((entity: any) => entity.id);
  let filtered = toursStore.objects.filter((entity: any) => !currentEntityIds.includes(entity.id));
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter((entity: any) => 
      entity.title?.toLowerCase().includes(query) ||
      entity.entityType?.title?.toLowerCase().includes(query)
    );
  }
  
  return filtered;
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

const removeEntity = (entityId: number) => {
  tour.value = { ...tour.value, entities: tour.value.entities.filter((item: any) => item.entity.id !== entityId) };
};

const addEntity = () => {
  if (!selectedEntityId.value) return;
  
  const entityToAdd = availableEntities.value.find((entity: any) => entity.id === selectedEntityId.value);
  if (entityToAdd) {
    const newEntityItem = {
      entity: entityToAdd
    };
    
    tour.value = { 
      ...tour.value, 
      entities: [...tour.value.entities, newEntityItem] 
    };
    
    selectedEntityId.value = '';
    searchQuery.value = '';
  }
};

const getResultsText = (count: number) => {
  if (count === 0) return 'объектов';
  if (count === 1) return 'объект';
  if (count >= 2 && count <= 4) return 'объекта';
  return 'объектов';
};

const clearSearch = () => {
  searchQuery.value = '';
};

const selectEntity = (entity: any) => {
  const newEntityItem = {
    entity: entity
  };
  
  tour.value = { 
    ...tour.value, 
    entities: [...tour.value.entities, newEntityItem] 
  };
  
  searchQuery.value = '';
};

const createNewObject = () => {
  window.open('/dashboard/entities', '_blank');
};

onMounted(async () => {
  try {
    await fetchEntities();
  } catch (error) {
    console.error('Ошибка при загрузке объектов:', error);
  }
});
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

.search-container {
  margin-bottom: 1rem;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  transition: all 0.2s;
}

.search-input:focus {
  outline: 0;
  border-color: #94a3b8;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input:focus + .search-icon path {
  stroke: #64748b;
}

.search-results {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 8px 8px 0 0;
  font-size: 13px;
  color: #64748b;
}

.search-results-count {
  font-weight: 500;
  color: #374151;
}

.clear-search-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s;
}

.clear-search-btn:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.search-results-list {
  max-height: 200px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
}

.search-result-item:hover {
  background-color: #f8fafc;
}

.search-result-item:last-child {
  border-bottom: none;
}

.entity-info {
  flex: 1;
}

.entity-title {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
  margin-bottom: 2px;
}

.entity-type {
  font-size: 12px;
  color: #64748b;
}

.add-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s;
}

.search-result-item:hover .add-icon {
  background-color: #059669;
  transform: scale(1.1);
}

.no-results {
  text-align: center;
  padding: 1.5rem;
  color: #64748b;
  font-size: 13px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.no-results p {
  margin-bottom: 1rem;
  color: #64748b;
}

.create-object-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.create-object-btn:hover {
  background-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.create-icon {
  flex-shrink: 0;
}
</style>