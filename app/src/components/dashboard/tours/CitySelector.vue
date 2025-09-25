<template>
  <div class="city-selector">
    <div class="selected-cities" v-if="selectedCities.length > 0">
      <div 
        v-for="city in selectedCities" 
        :key="city.id"
        class="city-tag"
      >
        <span>{{ city.name }}</span>
        <button 
          type="button"
          @click="removeCity(city.id)"
          class="remove-btn"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
    </div>
    
    <div class="selector-container">
      <select 
        v-model="selectedCityId" 
        @change="addCity"
        class="city-select"
        :disabled="availableCities.length === 0 || isLoading"
      >
        <option value="" disabled>
          {{ isLoading ? 'Загрузка городов...' : availableCities.length === 0 ? 'Выберите сначала страны' : 'Выберите город' }}
        </option>
        <option 
          v-for="city in availableCities" 
          :key="city.id" 
          :value="city.id"
        >
          {{ city.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import type { City } from '@/types/city';
import { usePlacesStore } from '@/stores/places';

interface Props {
  modelValue: City[];
  selectedCountryIds: number[];
}

interface Emits {
  (e: 'update:modelValue', value: City[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const placesStore = usePlacesStore();
const selectedCityId = ref<string | number>('');

const selectedCities = computed({
  get() {
    return props.modelValue || [];
  },
  set(value: City[]) {
    emit('update:modelValue', value);
  },
});

const availableCities = computed(() => {
  const selectedIds = selectedCities.value.map(city => city.id);
  const allCities = placesStore.getCitiesForCountries(props.selectedCountryIds);
  
  return allCities.filter(city => !selectedIds.includes(city.id));
});

const isLoading = computed(() => {
  return props.selectedCountryIds.some(countryId => placesStore.isCitiesLoading(countryId));
});

// Загружаем города при изменении выбранных стран
watch(() => props.selectedCountryIds, async (newCountryIds) => {
  if (newCountryIds.length > 0) {
    const citiesPromises = newCountryIds.map(id => placesStore.fetchCitiesByCountryId(id));
    await Promise.all(citiesPromises);
  }
}, { immediate: true });

const addCity = () => {
  if (!selectedCityId.value) return;
  
  const city = availableCities.value.find(c => c.id === selectedCityId.value);
  if (city && !selectedCities.value.find(c => c.id === city.id)) {
    selectedCities.value = [...selectedCities.value, city];
  }
  
  selectedCityId.value = '';
};

const removeCity = (cityId: string | number) => {
  selectedCities.value = selectedCities.value.filter(c => c.id !== cityId);
};
</script>

<style scoped>
.city-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.selected-cities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.city-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.15s ease-in-out;
}

.remove-btn:hover {
  background-color: #ef4444;
  color: white;
}

.selector-container {
  display: flex;
  align-items: center;
}

.city-select {
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

.city-select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
}

.city-select:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.city-select option[disabled] {
  color: #9ca3af;
}
</style>
