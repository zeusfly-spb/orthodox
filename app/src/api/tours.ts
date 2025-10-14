import { createApiClient } from './generic';
import api from './httpClient';
import type { Tour } from '@/types/tour';

export const tourApi = {
  ...createApiClient<Tour>('tours'),

  // Get tour parameters
  getParameters: async (): Promise<any> => {
    const response = await api.get('/manage/tours/parameters');
    return response.data;
  },
};
