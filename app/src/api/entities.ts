import api from './httpClient';
import { createApiClient } from './generic';
import type { Entity } from '@/types/entity.ts';

const baseApi = createApiClient<Entity>('entities');

export const entityApi = {
  ...baseApi,

  // Дополнительные методы для сущностей

    getParameters: async (): Promise<any> => {
    try {
        const response = await api.get('/manage/entities/parameters');
        return response.data;
    } catch (error) {
        console.error('❌ Ошибка загрузки параметров сущностей:', error);
        // Заглушка
        return [{
          slug: 'entity-types',
          children: [
              { id: 36, title: 'Митрополия' },
              { id: 37, title: 'Епархия' },
              { id: 38, title: 'Монастырь' },
              { id: 39, title: 'Храм' }
          ]
        }];
    }
    },

  // Явно объявляем все методы для TypeScript
  getData: baseApi.getData, // Добавляем этот метод!
  fetchData: baseApi.fetchData,
  storeData: baseApi.storeData,
  patchData: baseApi.patchData,
  deleteData: baseApi.deleteData,

  // Переопределяем getAll для лучшей отладки
  getAll: async (params?: Record<string, unknown>): Promise<any> => {
    try {
      const response = await api.get('/manage/entities', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка загрузки объектов:', error);
      return {
        data: [],
        meta: { current_page: 1, last_page: 1, total: 0 }
      };
    }
  }
};
