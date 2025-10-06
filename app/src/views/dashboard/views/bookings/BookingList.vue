<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/app/ConfirmDialog.vue';

import DataTable from '@/components/dashboard/bookings/DataTable.vue';
import BookingForm from '@/components/dashboard/bookings/BookingForm.vue';
import { bookingApi } from '@/api/bookings';
import { useCrudActions } from '@/composables/useCrudActions';
import type { Booking } from '@/types/booking';
import type { Customer } from '@/types/customer';

const {
  isLoading,
  showConfirm,
  showForm,
  handledItemId,
  items,
  currentItem,
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

// Load API data (all items, no pagination or filters)
loadCollection();

// Filters (all client-side)
const filters = ref({
  search: '',
  status: '',
  date: '',
});

// Computed property for filtered items (all filters applied client-side)
const filteredItems = computed(() => {
  if (!items.value || !Array.isArray(items.value)) return [];
  
  const searchTerm = filters.value.search.toLowerCase().trim();
  const hasSearch = searchTerm.length > 0;
  const hasStatus = filters.value.status !== '';
  const hasDate = filters.value.date !== '';
  
  return items.value.filter((item: Booking) => {
    let matches = true;
    
    // Client-side search (if active)
    if (hasSearch) {
      const customerMatch = item.customers?.some((customer: Customer) =>
        customer.firstname?.toLowerCase().includes(searchTerm) ||
        customer.lastname?.toLowerCase().includes(searchTerm) ||
        customer.patronymic?.toLowerCase().includes(searchTerm)
      ) || false;
      
      const tourMatch = item.tour?.title?.toLowerCase().includes(searchTerm) || false;
      const idMatch = item.id?.toString().includes(searchTerm) || false;
      const descriptionMatch = item.description?.toLowerCase().includes(searchTerm) || false;
      
      matches = matches && (customerMatch || tourMatch || idMatch || descriptionMatch);
    }
    
    // Client-side status filter (if active)
    if (hasStatus) {
      matches = matches && (item.status === filters.value.status);
    }
    
    // Client-side date filter (if active): compare YYYY-MM-DD only
    if (hasDate) {
      const itemDate = new Date(item.created_at).toISOString().slice(0, 10); // 'YYYY-MM-DD'
      matches = matches && (itemDate === filters.value.date);
    }
    
    return matches;
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

// applyFilters: no-op, since all client-side (computed handles it)
const applyFilters = () => {
  // Nothing to do — filters are reactive
};

// Map Booking to BookingForm
const mappedCurrentItem = computed(() => {
  if (!currentItem.value) return null;
  
  const booking = currentItem.value as unknown as Booking;
  
  // Ensure customers is an array
  const customersarr = Array.isArray(booking.customers) 
    ? booking.customers 
    : (booking.customers ? [booking.customers] : []);
  
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
  const submitData = {
    ...formData,
    tour_id: formData.tour_id,
    customer: formData.customers[0] || null,
  };
  
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
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex items-center gap-3 flex-wrap">
          <!-- Поиск -->
          <div>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Поиск по заявкам..."
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm w-64"
            />
          </div>

          <!-- Фильтр по статусу -->
          <div>
            <select
              v-model="filters.status"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
            >
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Дата (добавил, если отсутствовал) -->
          <div>
            <input
              v-model="filters.date"
              type="date"
              placeholder="Дата"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          <!-- Кнопка очистки -->
          <button
            @click="resetFilters"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Очистить
          </button>
          
          <!-- Кнопка "Поиск" (теперь бесполезна, но оставлена; можно убрать) -->
          <button
            @click="applyFilters"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Применить
          </button>
        </div>
      </div>
    </div>
    
    <Card class="mb-8 gap-0">
      <CardContent>
        <DataTable
          :isLoading="isLoading"
          :collection="filteredItems"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </CardContent>
      <!-- Пагинация отключена (серверная не работает с клиентскими фильтрами).
           Если нужно — добавьте клиентскую (см. рекомендации). -->
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