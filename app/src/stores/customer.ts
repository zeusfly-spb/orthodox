import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { partnerApi } from '@/api/partners';
import type { Tourist } from '@/types/booking';


export const useCustomerStore = defineStore('customer', () => {
  const clientNames = ref<string[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const currentTourist = reactive<Tourist>({
    id: 0,
    firstname: '',
    lastname: '',
    patronymic: '',
    email: '',
    phone: '',
    payment_status: '',
  
  });

  const fetchClientNames = async () => {
    isLoading.value = true;
    try {
      const response = await partnerApi.fetchData();
      clientNames.value = response.data.map((item: any) => item.name);
    } catch (err) {
      error.value = 'Ошибка при загрузке клиентов';
      console.error('Client names fetch error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateCustomer = (tourist: Tourist) => {
    Object.assign(currentTourist, tourist);
  };

  // Заглушки для методов работы с туристами
  const updateTourist = async (id: number, data: Partial<Tourist>) => {
    isLoading.value = true;
    try {
      console.log('Updating tourist:', id, data);
      // await customerApi.updateTourist(id, data)
    } catch (err) {
      error.value = 'Ошибка при обновлении туриста';
      console.error('Update tourist error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteTourist = async (id: number) => {
    isLoading.value = true;
    try {
      console.log('Deleting tourist:', id);
      // await customerApi.deleteTourist(id)
    } catch (err) {
      error.value = 'Ошибка при удалении туриста';
      console.error('Delete tourist error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    clientNames,
    currentTourist,
    isLoading,
    error,
    fetchClientNames,
    updateCustomer,
    updateTourist,
    deleteTourist,
  };
});
