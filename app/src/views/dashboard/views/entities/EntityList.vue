<script setup lang="ts">
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/app/ConfirmDialog.vue';

import DataTable from '@/components/dashboard/entities/DataTable.vue';
import EntityForm from '@/components/dashboard/entities/EntityForm.vue';
import Pagination from '@/components/app/Pagination.vue';
import EntityListFilters from '@/components/dashboard/entities/EntityListFilters.vue';

import { useEntitiesStore } from '@/stores/entities';
import { storeToRefs } from 'pinia';

const entitiesStore = useEntitiesStore();

// Берем ВСЕ необходимые данные из store
const {
  isLoading,
  showConfirm,
  items,
  pagination,
  currentPage,
  showForm,
  currentItem
} = storeToRefs(entitiesStore);

// Берем ВСЕ необходимые методы из store
const {
  handleDelete,
  onDeleteConfirm,
  onCancel,
  handlePageChange,
  handleSubmit,
  handleEdit
} = entitiesStore;

// Для открытия формы добавления
const openAddForm = () => {
  entitiesStore.showForm = true;
};

// Обработчики (просто передаем вызовы в store)
const handleEditWrapper = (id: string | number) => {
  handleEdit(id);
};

const handleSubmitWrapper = (formData: any) => {
  handleSubmit(formData);
};
</script>

<template>
  <div class="ml-70">
    <div class="flex flex-col gap-6 rounded-xl py-6 mb-8">
      <div class="flex shrink-0 items-center justify-between gap-2">
        <div class="flex items-center gap-4 pl-4">
          <h1 class="text-lg font-bold text-muted-foreground">Объекты</h1>
        </div>
        <div class="flex items-center gap-4 pr-4">
          <Button
            class="bg-emerald-500 text-white shadow hover:bg-emerald-500/90 px-8 py-6"
            @click="openAddForm"
          >
            Добавить объект
          </Button>
        </div>
      </div>
    </div>

    <Card class="mb-8 gap-0">
      <CardContent>
        <div class="flex flex-col gap-6 rounded-xl py-6 mb-8">
          <EntityListFilters />
        </div>

        <div v-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p class="text-gray-500 mt-2">Загрузка объектов...</p>
        </div>

        <div v-else-if="items.length === 0" class="text-center py-8">
          <p class="text-gray-500">Объекты не найдены</p>
        </div>

        <DataTable
          v-else
          :isLoading="isLoading"
          :collection="items"
          @edit="handleEditWrapper"
          @delete="handleDelete"
        />
      </CardContent>

      <CardFooter
        class="muted border-t"
        v-if="!isLoading && pagination && pagination.lastPage > 1"
      >
        <Pagination
          :current-page="currentPage || 1"
          :per-page="pagination.perPage || 10"
          :total="pagination.total || 0"
          :last-page="pagination.lastPage || 1"
          @update:current-page="handlePageChange"
        />
      </CardFooter>
    </Card>

    <EntityForm
      v-model:open="showForm"
      createTitle="Добавить объект"
      editTitle="Редактировать данные"
      description="Данные объекта"
      submit-text="Сохранить"
      cancel-text="Отмена"
      :item="currentItem"
      @dismiss="onCancel"
      @submit="handleSubmitWrapper"
    />

    <ConfirmDialog
      v-model:show="showConfirm"
      title="Удалить запись?"
      description="Вы уверены что хотите удалить эту запись? Это действие нельзя отменить."
      confirm-text="Удалить"
      @dismiss="onCancel"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>
