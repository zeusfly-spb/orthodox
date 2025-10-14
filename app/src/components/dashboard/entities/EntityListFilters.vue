<template>
  <div class="search-filters-container2">
    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          type="text"
          class="search-input"
          placeholder="Поиск по названию объекта..."
          v-model.trim="searchFilter"
        />
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <div class="filters-scroll-container">
      <div class="filters-grid">
        <!-- DropdownMenu для фильтра по типам -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" class="flex items-center gap-2 h-10 px-4">
              <span class="truncate max-w-[140px]">
                {{ selectedTypeTitle }}
              </span>
              <ChevronDown class="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56">
            <DropdownMenuLabel>Тип объекта</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup :model-value="entityTypeFilter" @update:model-value="selectType">
              <DropdownMenuRadioItem :value="0">
                Все типы объектов
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                v-for="type in entityTypes"
                :key="type.id"
                :value="type.id"
              >
                {{ type.title }}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          v-if="hasFilters"
          title="Сбросить фильтры"
          type="button"
          class="filter-reset-btn"
          @click="resetFilters"
        >
          <RotateCcw color="#10b981" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RotateCcw, ChevronDown } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEntitiesStore } from '@/stores/entities.ts';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const entitiesStore = useEntitiesStore();
const { entityTypes, searchFilter, entityTypeFilter } = storeToRefs(entitiesStore);

// Выбранный тип
const selectedTypeTitle = computed(() => {
  if (entityTypeFilter.value === 0) return 'Все типы объектов';
  const selectedType = entityTypes.value.find(type => type.id === entityTypeFilter.value);
  return selectedType ? selectedType.title : 'Все типы объектов';
});

const selectType = (value: number) => {
  entityTypeFilter.value = value;
};

const hasFilters = computed(() => {
  return searchFilter.value !== '' || entityTypeFilter.value !== 0;
});

const resetFilters = () => {
  searchFilter.value = '';
  entityTypeFilter.value = 0;
};
</script>

<style scoped>

.search-filters-container2 {
  display: grid;
  position: relative;
  grid-template-columns: 1fr;
  grid-gap: 24px;
}

.search-container {
  margin-bottom: 16px;
  position: relative;
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

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input:focus {
  outline: 0;
  border-color: #94a3b8;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}

.filters-scroll-container {
  z-index: 1;
  scrollbar-width: thin;
  scrollbar-color: rgba(16, 185, 129, 0.5) #f1f1f1;
  -webkit-overflow-scrolling: touch;
  margin-bottom: -10px;
  padding-bottom: 10px;
  position: relative;
}

.filters-grid {
  display: flex;
  z-index: 1000;
  position: relative;
  gap: 12px;
  width: max-content;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(16, 185, 129, 0.5) #f1f1f1;
  -webkit-overflow-scrolling: touch;
  overflow-x: auto;
}

.filter-reset-btn {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.filter-reset-btn:hover {
  background-color: #fff;
  border-color: #94a3b8;
}

/* Адаптивность */
@media (max-width: 768px) {
  .filters-grid {
    flex-direction: column;
    width: 100%;
  }
}
</style>
