import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCrudActions } from '@/composables/useCrudActions';
import { entityApi } from '@/api/entities';
import type { Entity } from '@/types/entity';

export const useEntitiesStore = defineStore('entities', () => {
  const route = useRoute();
  const router = useRouter();

  const crud = useCrudActions(entityApi, {
    successMessage: 'Данные сохранены',
    deleteMessage: 'Данные удалены',
  });

  // ФИЛЬТРЫ
  const searchFilter = ref('');
  const entityTypeFilter = ref(0);
  const currentPage = ref(Number(route.query.page) || 1);

  // Загрузка типов объектов
  const entityTypes = ref<any[]>([]);
  const isInitialized = ref(false);

  // Функция загрузки типов объектов
  const loadEntityTypes = async () => {
    try {
      const response = await entityApi.getParameters();

      let typesArray: any[] = [];

      // Обрабатываем разные структуры ответа
      if (Array.isArray(response)) {
        typesArray = response;
      } else if (response && typeof response === 'object') {
        if (response.data) {
          if (Array.isArray(response.data)) {
            typesArray = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            typesArray = response.data.data;
          }
        }
      }

      // Ищем entity-types в структуре
      if (typesArray.length > 0) {
        const findEntityTypes = (arr: any[]): any[] => {
          for (const item of arr) {
            if (item.slug === 'entity-types' && Array.isArray(item.children)) {
              return item.children;
            }
            if (item.children && Array.isArray(item.children)) {
              const found = findEntityTypes(item.children);
              if (found.length > 0) return found;
            }
          }
          return [];
        };

        const entityTypesFound = findEntityTypes(typesArray);
        if (entityTypesFound.length > 0) {
          entityTypes.value = entityTypesFound;
        } else {
          entityTypes.value = typesArray[0]?.children || typesArray;
        }
      } else {
        // Заглушка если типы не найдены
        console.warn('⚠️ Типы объектов не найдены в ответе');
        entityTypes.value = [
          { id: 36, title: 'Митрополия' },
          { id: 37, title: 'Епархия' },
          { id: 38, title: 'Монастырь' },
          { id: 39, title: 'Храм' },
          { id: 40, title: 'Святыня' }
        ];
      }

    } catch (error) {
      console.error('❌ Ошибка при загрузке параметров сущностей:', error);
    }
  };

  // Функция загрузки с обновлением URL
  const loadWithFilters = async (page?: number) => {
    const newPage = page || currentPage.value;
    currentPage.value = newPage;

    const filters: any = { page: newPage };

    if (searchFilter.value.trim()) {
      filters['filter[title]'] = searchFilter.value;
    }
    if (entityTypeFilter.value && entityTypeFilter.value !== 0) {
      filters['filter[entityType.id]'] = entityTypeFilter.value;
    }

    await crud.loadCollection(filters);

    updateURL(newPage);
  };

  // Обновление URL параметров
  const updateURL = (page: number) => {
    const query: any = {};

    if (page > 1) {
      query.page = page.toString();
    }

    if (searchFilter.value.trim()) {
      query.search = searchFilter.value;
    }
    if (entityTypeFilter.value && entityTypeFilter.value !== 0) {
      query.type = entityTypeFilter.value.toString();
    }

    router.replace({ query });
  };

  // Пагинация
  const handlePageChange = async (page: number) => {
    await loadWithFilters(page);
  };

  // Реагируем на изменения URL
  watch(
    () => route.query.page,
    (newPage) => {
      const page = newPage ? parseInt(newPage as string) : 1;
      if (page !== currentPage.value) {
        loadWithFilters(page);
      }
    }
  );

  // Автоматическая загрузка при изменении фильтров
  watch([searchFilter, entityTypeFilter], () => {
    loadWithFilters(1);
  });

  // Инициализация store
  const init = async () => {
    if (!isInitialized.value) {
      await loadEntityTypes(); // Загружаем типы объектов
      await loadWithFilters(currentPage.value); // Загружаем данные
      isInitialized.value = true;
    }
  };

  init();

  return {
    // Данные
    items: crud.items as unknown as Entity[],
    pagination: crud.pagination,
    isLoading: crud.isLoading,
    showConfirm: crud.showConfirm,

    // свойства для работы с формами
    showForm: crud.showForm,
    currentItem: crud.currentItem,
    handledItemId: crud.handledItemId,

    // Фильтры и пагинация
    searchFilter,
    entityTypeFilter,
    currentPage,

    // Типы объектов
    entityTypes,
    isInitialized,

    // Методы пагинации и фильтрации
    handlePageChange,

    // методы для работы с формами
    handleSubmit: crud.handleSubmit,
    handleEdit: crud.handleEdit,
    handleDelete: crud.handleDelete,
    onDeleteConfirm: crud.onDeleteConfirm,
    onCancel: crud.onCancel,

    // метод для сброса фильтров (если используется в компоненте)
    resetQueryFilters: () => {
      searchFilter.value = '';
      entityTypeFilter.value = 0;
    }
  };
});
