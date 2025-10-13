import { createApiClient } from './generic';
import api from './httpClient';
import type { Tour, TourDayImage } from '@/types/tour';
import type { AxiosResponse } from 'axios';

export const tourPhotosApi = {
  // Upload images to tour day
  upload: async (
    tourId: number | string,
    dayId: number | string,
    files: File[]
  ): Promise<AxiosResponse<TourDayImage[]>> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images[]', file);
    });

    const response = await api.post<TourDayImage[]>(
      `/manage/tours/${tourId}/days/${dayId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  },

  // Delete image from tour day
  delete: async (
    tourId: number | string,
    dayId: number | string,
    imageId: number | string
  ): Promise<void> => {
    const response = await api.delete(
      `/manage/tours/${tourId}/days/${dayId}/images`,
      {
        data: {
          images: [imageId]
        }
      }
    );
  },
};

export const tourApi = {
  ...createApiClient<Tour>('tours'),

  // Photo operations
  photos: tourPhotosApi,

  // Get tour parameters
  getParameters: async (): Promise<any> => {
    const response = await api.get('/manage/tours/parameters');
    return response.data;
  },
};
