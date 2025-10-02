import { ref } from 'vue';
import type { ApiError } from '@/types/shared';
import { createApiClient } from '@/api/generic';

export function useApiClient<T>(apiClient: ReturnType<typeof createApiClient<T>>) {
  const response = ref<null>(null);
  const items = ref<T[]>([]);
  const currentItem = ref<T | null>(null);
  const error = ref<ApiError | null>(null);
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 1,
    total: 1,
  });

  const handleError = (err: unknown) => {
    error.value = err as ApiError;
    const apiError = error.value;
    let errors = apiError.response?.data?.message || 'Unknown error';
    if (apiError.response?.status === 422) {
      errors = Object.values(apiError.response.data?.errors || {}).join('\n');
    }
    console.error('ApiError', err);
    throw err;
  };

  const getAll = async (params?: Record<string, unknown>) => {
    try {
      response.value = await apiClient.fetchData(params);
      items.value = response.value?.data;
      if (response.value?.meta?.current_page || response.value?.current_page) {
        const { current_page, last_page, per_page, total } = response.value?.meta || response.value;
        pagination.value = {
          currentPage: current_page,
          lastPage: last_page,
          perPage: per_page,
          total: total,
        };
      }
      return items.value;
    } catch (error) {
      handleError(error);
    }
  };

  const getOneById = async (id: number | string) => {
    try {
      response.value = await apiClient.getData(id);
      currentItem.value = response.value?.data || response.value;
      return currentItem.value;
    } catch (error) {
      handleError(error);
    }
  };

  const store = async (data: Partial<T>) => {
    try {
      return await apiClient.storeData(data);
    } catch (error) {
      handleError(error);
    }
  };

  const update = async (id: number | string, data: Partial<T>) => {
    try {
      return await apiClient.patchData(id, data);
    } catch (error) {
      handleError(error);
    }
  };

  const destroy = async (id: number | string) => {
    try {
      return await apiClient.deleteData(id);
    } catch (error) {
      handleError(error);
    }
  };

  return {
    items,
    currentItem,
    error,
    pagination,
    getAll,
    getOneById,
    store,
    update,
    destroy,
  };
}
