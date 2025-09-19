<template>
  <div class="search-filters-container2">
    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          type="text"
          class="search-input"
          placeholder="Поиск по названию тура, описанию, типу..."
          v-model.trim="queryFilters.searchString.value"
        />
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <div class="filters-scroll-container">
      <div class="filters-grid">
        <select class="filter-select" v-model.number="dayCount">
          <option value="0">Длительность (дней)</option>
          <option v-for="day in tourDays" :key="`duration-option-${day}`" :value="day">
            {{ day }}
          </option>
        </select>

        <select class="filter-select" v-model.number="customerCount">
          <option value="0">Паломников</option>
          <option v-for="item in customerNumbers" :key="`customer-number-option-${item}`" :value="item">
            {{ item }}
          </option>
        </select>

        <div class="price-range-container">
          <div class="price-input-wrapper">
            <input
              type="number"
              min="0"
              step="100"
              placeholder="Цена от"
              class="price-input"
              v-model="queryFilters.priceMin.value"
            />
            <span class="currency">₽</span>
          </div>
          <div class="price-input-wrapper">
            <input
              type="number"
              min="0"
              step="100"
              placeholder="Цена до"
              class="price-input"
              v-model="queryFilters.priceMax.value"
            />
            <span class="currency">₽</span>
          </div>
        </div>

        <select class="filter-select" v-model="queryFilters.tourTypeId.value">
          <option value="0">Тип тура</option>
          <option v-for="type in tourTypes" :key="`type-option-${type.id}`" :value="type.id">
            {{ type.title }}
          </option>
        </select>

        <select class="filter-select" v-model="queryFilters.tourCategoryId.value">
          <option value="0">Категория тура</option>
          <option
            v-for="category in tourCategories"
            :key="`category-option-${category.id}`"
            :value="category.id"
          >
            {{ category.title }}
          </option>
        </select>

        <select class="filter-select" v-model="queryFilters.tourTransportId.value">
          <option value="0">Логистика тура</option>
          <option
            v-for="transport in tourTransports"
            :key="`transport-option-${transport.id}`"
            :value="transport.id"
          >
            {{ transport.title }}
          </option>
        </select>

        <select class="filter-select" v-model="queryFilters.tourStatusId.value">
          <option value="0">Статус тура</option>
          <option v-for="status in tourStatuses" :key="`status-option-${status.id}`" :value="status.id">
            {{ status.title }}
          </option>
        </select>

        <button
          v-if="filtered"
          title="Сбросить фильтры"
          type="button"
          class="filter-reset-btn"
          @click="resetQueryParams"
          aria-label="Сбросить фильтры"
        >
          <FunnelX class="text-gray-500" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FunnelX } from 'lucide-vue-next';
import { useToursStore } from '@/stores/tours.ts';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const toursStore = useToursStore();
const { queryFilters, dayCount, customerCount } = storeToRefs(toursStore);
const tourTypes = computed(() => toursStore.tourTypes);
const tourCategories = computed(() => toursStore.tourCategories);
const tourTransports = computed(() => toursStore.tourTransports);
const tourStatuses = computed(() => toursStore.tourStatuses);
const filtered = computed(() => toursStore.filtered);
const tourDays = computed(() => toursStore.tourDays);
const customerNumbers = computed(() => toursStore.customerNumbers);

const { resetQueryFilters } = toursStore;
const resetQueryParams = () => resetQueryFilters();
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
  position: relative;
  width: max-content;
  gap: 12px;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(16, 185, 129, 0.5) #f1f1f1;
  -webkit-overflow-scrolling: touch;
  overflow-x: auto;
}

.filter-select {
  width: auto;
  min-width: 150px;
  max-width: 200px;
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
  flex-shrink: 0;
}

.filter-select:focus {
  outline: 0;
  border-color: #94a3b8;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}

.price-range-container {
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8fafc;
  min-width: 200px;
  flex-shrink: 0;
}

.price-input-wrapper {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-right: 1px solid #e2e8f0;
}

.price-input-wrapper:last-child {
  border-right: none;
}

.price-input {
  outline: none;
  border: none;
  background: transparent;
  width: 90px;
  font-size: 14px;
  color: #64748b;
}

.price-input::placeholder {
  color: #94a3b8;
}

.currency {
  margin-left: 4px;
  color: #94a3b8;
  font-size: 14px;
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
</style>
