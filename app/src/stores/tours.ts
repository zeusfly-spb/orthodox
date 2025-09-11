import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import api from '@/api/httpClient';
import deepEqual from 'deep-equal';
import { usePaginationFilters } from '@/composables/usePaginationFilters.ts';
import { useCrudActions } from '@/composables/useCrudActions.ts';
import { tourApi } from '@/api/tours.ts';

interface FilterItem {
  param: string;
  value: string | number;
}

interface TourFilters {
  searchString: FilterItem;
  pilCount: FilterItem;
  tourTypeId: FilterItem;
  tourCategoryId: FilterItem;
  tourTransportId: FilterItem;
  tourStatusId: FilterItem;
  priceMin: FilterItem;
  priceMax: FilterItem;
  daysMin: FilterItem;
  daysMax: FilterItem;
  customerMin: FilterItem;
  customerMax: FilterItem;
}

interface Tour {
  duration: number;
  customers_count?: number;
}

interface TourParameter {
  slug: string;
  children: any[];
}

const blankFilters: TourFilters = {
  searchString: { param: 'filter[title]', value: '' },
  pilCount: { param: '', value: '' },
  tourTypeId: { param: 'filter[tourType.id]', value: 0 },
  tourCategoryId: { param: 'filter[tourCategory.id]', value: 0 },
  tourTransportId: { param: 'filter[tourTransport.id]', value: 0 },
  tourStatusId: { param: 'filter[tourStatus.id]', value: 0 },
  priceMin: { param: 'filter[price][min]', value: '' },
  priceMax: { param: 'filter[price][max]', value: '' },
  daysMin: { param: 'filter[duration][min]', value: 0 },
  daysMax: { param: 'filter[duration][max]', value: 0 },
  customerMin: { param: 'filter[customers][min]', value: 0 },
  customerMax: { param: 'filter[customers][max]', value: 0 },
};

function safeClone<T>(obj: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

export const useToursStore = defineStore('toursStore', () => {
  const { filters, complexFilters, applyFilters, resetFilters, handlePageChange, currentPage } =
    usePaginationFilters({
      search: '',
      status: '',
    });

  const {
    isLoading,
    showConfirm,
    handledItemId,
    items,
    currentItem,
    pagination,
    loadCollection,
    handleSubmit,
    handleDelete,
    onDeleteConfirm,
    onCancel,
  } = useCrudActions(tourApi, {
    successMessage: 'Данные сохранены',
    deleteMessage: 'Данные удалены',
  });

  const tourParams = ref<TourParameter[]>([]);
  const tourTypes = ref<any[]>([]);
  const tourCategories = ref<any[]>([]);
  const tourTransports = ref<any[]>([]);
  const tourStatuses = ref<any[]>([]);
  const queryFilters = ref<TourFilters>(safeClone(blankFilters));
  const tourDays = ref<number[]>([]);
  const dayCount = ref<number>(0);
  const customerNumbers = ref<number[]>([]);
  const customerCount = ref<number>(0);
  const isInitialized = ref<boolean>(false);

  const filtered = computed(() => !deepEqual(queryFilters.value, blankFilters));
  const formattedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\./g, '-');
  };
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  function findParameterBySlug(data: TourParameter[], slug: string): TourParameter | undefined {
    return data.find((item) => item.slug === slug);
  }

  async function getTourParams() {
    try {
      const { data } = await api.get('/manage/tours/parameters');

      if (!data?.data || !Array.isArray(data.data)) {
        throw new Error('Неверная структура данных от API');
      }

      const tourTypesParam = findParameterBySlug(data.data, 'tour-types');
      const tourCategoriesParam = findParameterBySlug(data.data, 'tour-categories');
      const tourTransportsParam = findParameterBySlug(data.data, 'tour-transports');
      const tourStatusesParam = findParameterBySlug(data.data, 'tour-statuses');

      tourTypes.value = tourTypesParam?.children || [];
      tourCategories.value = tourCategoriesParam?.children || [];
      tourTransports.value = tourTransportsParam?.children || [];
      tourStatuses.value = tourStatusesParam?.children || [];
      tourParams.value = data.data;
    } catch (error) {
      console.error('Ошибка при загрузке параметров туров:', error);
      tourTypes.value = [];
      tourCategories.value = [];
      tourTransports.value = [];
      tourStatuses.value = [];
      tourParams.value = [];
    }
  }

  function resetQueryFilters() {
    queryFilters.value = safeClone(blankFilters);
    dayCount.value = 0;
    customerCount.value = 0;
  }

  function createFiltersFromQueryFilters(val: TourFilters): Record<string, string | number> {
    const filters: Record<string, string | number> = {};

    for (const [key, filterItem] of Object.entries(val)) {
      const { value, param } = filterItem;

      if (value && value !== '0' && value !== 0) {
        if (key === 'searchString' && typeof value === 'string' && value.length < 3) {
          continue;
        }
        filters[param] = value;
      }
    }

    return filters;
  }

  function updateTourDays() {
    if (items.value.length > 0) {
      const durations = items.value
        .map((tour: Tour) => tour.duration)
        .filter((duration: number) => duration != null && !isNaN(duration));
      if (!tourDays.value.length) {
        tourDays.value = [...new Set(durations)].sort();
      }
      const numbers = items.value.map((tour: Tour) => tour.customers_count);
      if (!customerNumbers.value.length) {
        customerNumbers.value = [...new Set(numbers)]
          .filter((item): item is number => typeof item === 'number' && !isNaN(item) && item !== 0)
          .sort();
      }
    }
  }

  async function init() {
    try {
      resetQueryFilters();
      watch(
        queryFilters,
        async (val: TourFilters) => {
          const filters = createFiltersFromQueryFilters(val);
          await loadCollection(filters);
          updateTourDays();
        },
        { immediate: true, deep: true },
      );

      watch(
        dayCount,
        (val: number) => {
          queryFilters.value.daysMax.value = val;
          queryFilters.value.daysMin.value = val;
        },
        { immediate: true },
      );

      watch(
        customerCount,
        (val: number) => {
          queryFilters.value.customerMax.value = val;
          queryFilters.value.customerMin.value = val;
        },
        { immediate: true },
      );

      await getTourParams();
      isInitialized.value = true;
    } catch (error) {
      console.error('Ошибка при инициализации store:', error);
    }
  }

  init();

  return {
    tourTypes,
    tourCategories,
    tourTransports,
    tourStatuses,
    queryFilters,
    filtered,
    items,
    isLoading,
    currentPage,
    pagination,
    showConfirm,
    tourDays,
    dayCount,
    customerCount,
    customerNumbers,
    formattedDate,
    formatCurrency,
    handleDelete,
    onDeleteConfirm,
    onCancel,
    handlePageChange,
    resetQueryFilters,
    init,
  };
});
