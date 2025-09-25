import api from './httpClient';
import type { City } from '@/types/city';

export const cityApi = {
  fetchCitiesByCountryId: async (countryId: number | string, params?: Record<string, unknown>): Promise<{data: City[]}> => {
    const response = await api.get(`/countries/${countryId}/cities`, { params });
    return response?.data;
  },
  
  fetchCitiesByCountryCode: async (countryCode: string, params?: Record<string, unknown>): Promise<{data: City[]}> => {
    const response = await api.get(`/countries/${countryCode}/cities`, { params });
    return response?.data;
  }
};
