<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/app/ConfirmDialog.vue';

import DataTable from '@/components/dashboard/bookings/DataTable.vue';
import BookingForm from '@/components/dashboard/bookings/BookingForm.vue';
import { bookingApi } from '@/api/bookings';
import { useCrudActions } from '@/composables/useCrudActions';
import Pagination from '@/components/app/Pagination.vue';
import type { Booking } from '@/types/booking';
import type { Customer } from '@/types/customer';

const {
  isLoading,
  showConfirm,
  showForm,
  handledItemId,
  items,
  currentItem,
  pagination,
  loadCollection,
  handleSubmit,
  handleEdit,
  handleDelete,
  onDeleteConfirm,
  onCancel,
} = useCrudActions(bookingApi, {
  successMessage: 'Заявка успешно сохранена!',
  deleteMessage: 'Заявка успешно удалена!',
});

// Load API data
loadCollection();

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
};

const applyFilters = () => {
  // Сбрасываем на первую страницу при применении фильтров
  loadCollection({
    page: 1,
    ...filters.value,
  });
};

// Map Booking to BookingForm
const mappedCurrentItem = computed(() => {
  if (!currentItem.value) return null;
  
  const booking = currentItem.value as unknown as Booking;
  
  // Ensure customer is in an array for the form
  const customersarr = booking.customers ? [booking.customers] : [];
  
  return {
    id: typeof booking.id === 'string' ? parseInt(booking.id) : booking.id,
    status: booking.status,
    description: booking.description,
    customers: customersarr,
    tour_id: typeof booking.tour?.id === 'string' ? parseInt(booking.tour.id) : booking.tour?.id || null,
  };
});

// Handle form submission with proper type conversion
const handleSubmitForm = (formData: any) => {
  // Convert form data to match API expectations
  const submitData = {
    ...formData,
    tour_id: formData.tour_id,
    customer: formData.customers[0] || null,
  };
  
  // Remove customers array as it's not expected by the API
  delete submitData.customers;
  
  return handleSubmit(submitData);
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
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </CardContent>
      <CardFooter class="muted border-t" v-if="pagination.currentPage && pagination.lastPage > 1">
        <Pagination
          :current-page="pagination.currentPage"
          :per-page="pagination.perPage ? pagination.perPage : 1"
          :total="pagination.total ? pagination.total : 0"
          :lastPage="pagination?.lastPage ? pagination.lastPage : 1"
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
