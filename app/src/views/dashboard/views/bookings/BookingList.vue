<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/app/ConfirmDialog.vue';

import DataTable from '@/components/dashboard/bookings/DataTable.vue';
import BookingForm from '@/components/dashboard/bookings/BookingForm.vue';
import { bookingApi } from '@/api/bookings';
import { useCrudActions } from '@/composables/useCrudActions';
import Pagination from '@/components/app/Pagination.vue';

const {
  isLoading,
  showConfirm,
  showForm,
  handledItemId,
  items,
  currentItem,
  pagination,
  pagination,
  loadCollection,
  handleSubmit,
  handleEdit,
  handleDelete,
  onDeleteConfirm,
  onCancel,
} = useCrudActions(bookingApi, {
  successMessage: 'Данные сохранены',
  deleteMessage: 'Данные удалены',
});

// Load API data
// Load API data
loadCollection();

// Filters
// Filters
const filters = ref({
  search: '',
  status: '',
});

const handlePageChange = (page: number) => {
  loadCollection({
    page,
    ...filters.value,
  });
});
// пагинация не работает
const statusOptions = [
  { value: '', label: 'Все статусы' },
  { value: 'pending', label: 'В ожидании' },
  { value: 'confirmed', label: 'В работе' },
  { value: 'cancelled', label: 'Аннулированно' },
  { value: 'completed', label: 'Завершено' },
];

const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    date: '',
  };
  // Reload full data (optional, since filters are client-side, but clears any state)
  loadCollection();
};

// Получить статус на русском
const getStatusLabel = (status: string) => {
  const option = statusOptions.find((opt) => opt.value === status);
  return option ? option.label : status;
};

// Форматирование даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

const applyFilters = () => {
  // Сбрасываем на первую страницу при применении фильтров
  loadCollection({
    page: 1,
    ...filters.value,
  });
};
</script>

<template>
  <div>
    <div class="flex flex-col gap-6 rounded-xl py-6 mb-8">
      <div class="flex shrink-0 items-center justify-between gap-2">
        <!-- Левая часть -->
        <div class="flex items-center gap-4 pl-4">
          <h1 class="text-lg font-bold text-muted-foreground">Мои заявки</h1>
        </div>
        <!-- Правая часть -->
        <div class="flex items-center gap-4 pr-4">
          <Button
            class="bg-emerald-500 text-white shadow hover:bg-emerald-500/90 px-8 py-6"
            @click="showForm = true"
          >
            Добавить заявку
          </Button>
        </div>
      </div>
    </div>
    <Card class="mb-8 gap-0">
      <CardContent>
        <DataTable
          :isLoading="isLoading"
          :collection="items"
          :collection="items"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </CardContent>
      <CardFooter class="muted border-t" v-if="pagination.currentPage && pagination.lastPage > 1">
        <Pagination
          :current-page="pagination.currentPage"
          :per-page="pagination.perPage"
          :total="pagination.total"
          :last-page="pagination.lastPage"
          @update:current-page="handlePageChange"
        />
      </CardFooter>
    </Card>
    <BookingForm
      v-model:open="showForm"
      createTitle="Добавить заявку"
      editTitle="Редактировать данные"
      description="Данные"
      submit-text="Сохранить"
      cancel-text="Отмена"
      :item="currentItem"
      @dismiss="onCancel"
      @submit="handleSubmit"
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

