<template>
  <div class="country-selector">
    <div class="selected-countries" v-if="selectedCountries.length > 0">
      <div 
        v-for="country in selectedCountries" 
        :key="country.id"
        class="country-tag"
      >
        <span>{{ country.name }}</span>
        <button 
          type="button"
          @click="removeCountry(country.id)"
          class="remove-btn"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
    </div>
    
    <div class="selector-container">
      <select 
        v-model="selectedCountryId" 
        @change="addCountry"
        class="country-select"
        :disabled="allCountries.length === 0"
      >
        <option value="" disabled>
          {{ allCountries.length === 0 ? 'Загрузка стран...' : 'Выберите страну' }}
        </option>
        <option 
          v-for="country in availableCountries" 
          :key="country.id" 
          :value="country.id"
        >
          {{ country.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';
import type { Country } from '@/types/country';

interface Props {
  modelValue: Country[];
  allCountries: Country[];
}

interface Emits {
  (e: 'update:modelValue', value: Country[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedCountryId = ref<string | number>('');

const selectedCountries = computed({
  get() {
    return props.modelValue || [];
  },
  set(value: Country[]) {
    emit('update:modelValue', value);
  },
});

const availableCountries = computed(() => {
  const selectedIds = selectedCountries.value.map(country => country.id);
  return props.allCountries.filter(country => !selectedIds.includes(country.id));
});

const addCountry = () => {
  if (!selectedCountryId.value) return;
  
  const country = props.allCountries.find(c => c.id === selectedCountryId.value);
  if (country && !selectedCountries.value.find(c => c.id === country.id)) {
    selectedCountries.value = [...selectedCountries.value, country];
  }
  
  selectedCountryId.value = '';
};

const removeCountry = (countryId: string | number) => {
  selectedCountries.value = selectedCountries.value.filter(c => c.id !== countryId);
};
</script>

<style scoped>
.country-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.selected-countries {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.country-tag {
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

.country-select {
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

.country-select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
}

.country-select:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.country-select option[disabled] {
  color: #9ca3af;
}
</style>
