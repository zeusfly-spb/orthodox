import { defineStore } from 'pinia';
import { ref } from 'vue';
import { bookingParams } from '@/api/bookings';
import type { BookingParam, BookingParamsResponse, OrderStatus } from '@/types/booking';

// Типы для ответа API


export const useOrderStore = defineStore('order', () => {
  const orders = ref<object | null>(null);
  const managers = ref<object | null>(null);
  const orderStatusList = ref<OrderStatus | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchOrderStatuses = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await bookingParams() as BookingParamsResponse;
      const { data: bookingStatuses } = response;

      const statusObject = bookingStatuses.find((val: BookingParam) => val.type === 'status');
      if (statusObject) {
        orderStatusList.value = statusObject.children;
      } else {
        orderStatusList.value = null;
      }
    } catch (err) {
      error.value = 'Ошибка при загрузке статусов';
      console.error('Order status fetch error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    orders,
    managers,
    orderStatusList,
    isLoading,
    error,
    fetchOrderStatuses,
  };
});