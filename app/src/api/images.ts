import api from './httpClient';
import type { AxiosResponse } from 'axios';

export interface UploadedImage {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  disk: string;
  size: number;
  url: string;
}

export interface UploadImagesResponse {
  data: UploadedImage[];
}

export const imagesApi = {
  // Upload images
  upload: async (files: File[]): Promise<AxiosResponse<UploadImagesResponse>> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images[]', file);
    });

    const response = await api.post<UploadImagesResponse>(
      '/manage/uploads/images',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  },

  // Delete image
  delete: async (imageId: number | string): Promise<void> => {
    await api.delete(`/manage/uploads/${imageId}`);
  },
};
