import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from 'lodash-es';

export const usePaginationFilters = (defaultFilters = {}, debounceTime = 500) => {
  const route = useRoute();
  const router = useRouter();

  // Состояние фильтров
  const filters = ref({
    page: Number(route.query.page) || 1,
    ...defaultFilters,
  });

  // Комплексные фильтры (при необходимости)
  const complexFilters = computed(() => ({
    page: filters.value.page,
    ...Object.fromEntries(
      Object.entries(filters.value).filter(
        ([key, value]) => value !== null && value !== undefined && value !== '',
      ),
    ),
  }));

  // Debounce для поиска
  const debouncedApply = debounce(applyFilters, debounceTime);

  // Отслеживаем изменения простых фильтров
  watch(
    () => filters.value,
    (newVal, oldVal) => {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        debouncedApply();
      }
    },
    { deep: true },
  );

  // Применение фильтров
  function applyFilters() {
    // Убираем page=1 для чистоты URL
    const query = { ...complexFilters.value };
    if (query.page === 1) delete query.page;

    router.push({ query });
  }

  // Обработчик изменения страницы
  function handlePageChange(page: number) {
    filters.value.page = page;
    applyFilters();
  }

  // Сброс фильтров
  function resetFilters() {
    filters.value = {
      page: 1,
      ...defaultFilters,
    };
    applyFilters();
  }

  return {
    filters,
    complexFilters,
    applyFilters,
    resetFilters,
    handlePageChange,
    currentPage: computed(() => filters.value.page),
  };
};
