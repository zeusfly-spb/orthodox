import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Country } from '@/types/country';
import type { City } from '@/types/city';
import { countryApi } from '@/api/countries';
import { cityApi } from '@/api/cities';

export const usePlacesStore = defineStore('placesStore', () => {
    
  const allCountries = ref<Country[]>([]);
  const citiesByCountry = ref<Record<number, City[]>>({});
  const loadingCities = ref<Record<number, boolean>>({});

  const fetchCountries = async () => {
    const response = await countryApi.fetchData();
    allCountries.value = response.data || [];
  };

  const fetchCitiesByCountryId = async (countryId: number) => {
    if (citiesByCountry.value[countryId]) {
      return citiesByCountry.value[countryId];
    }

    loadingCities.value[countryId] = true;
    
    try {
      const response = await cityApi.fetchCitiesByCountryId(countryId);
      citiesByCountry.value[countryId] = response.data || [];
      return citiesByCountry.value[countryId];
    } catch (error) {
      console.error('Ошибка загрузки городов:', error);
      citiesByCountry.value[countryId] = [];
      return [];
    } finally {
      loadingCities.value[countryId] = false;
    }
  };

  const getCitiesForCountries = (countryIds: number[]) => {
    const allCities: City[] = [];
    
    countryIds.forEach(countryId => {
      const cities = citiesByCountry.value[countryId] || [];
      allCities.push(...cities);
    });
    
    return allCities;
  };

  const isCitiesLoading = (countryId: number) => {
    return loadingCities.value[countryId] || false;
  };

  fetchCountries();

  return {
    allCountries,
    citiesByCountry,
    loadingCities,
    fetchCitiesByCountryId,
    getCitiesForCountries,
    isCitiesLoading,
  };
});
