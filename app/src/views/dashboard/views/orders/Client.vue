<script setup>
import { reactive, watch, ref, onMounted } from 'vue';
import UDropdown from '@/components/ui/UDropdown.vue';
import { useCustomerStore } from '@/stores/customer';
import { useBookingStore } from '@/stores/booking';

const customerStore = useCustomerStore();
const bookingStore = useBookingStore();
const isMounted = ref(false);

const form = reactive({
  clientType: '',
  clientName: '',
  comment: '',
});

// Функция для обновления bookingStore (только один клиент)
function updateBookingStore() {
  // Проверяем, что обязательные поля заполнены
  if (!form.clientType || !form.clientName) {
    return;
  }
  
  // Инициализируем customers, если не существует
  if (!bookingStore.booking.customers) {
    bookingStore.booking.customers = [];
  }
  
  // Создаем объект клиента
  const customerData = {
    id: 1, // Всегда один и тот же ID для единственного клиента
    clientType: form.clientType,
    clientName: form.clientName,
    comment: form.comment,
    updatedAt: new Date().toISOString()
  };
  
  // Всегда только один клиент - заменяем или добавляем
  if (bookingStore.booking.customers.length === 0) {
    bookingStore.booking.customers.push(customerData);
  } else {
    bookingStore.booking.customers = customerData;
  }
  
  console.log('Клиент обновлен:', bookingStore.booking.customers[0]);
}

// Watchers для отслеживания изменений
watch(
  () => form.clientType,
  (newVal) => {
    if (isMounted.value && newVal) {
      updateBookingStore();
    }
  }
);

watch(
  () => form.clientName,
  (newVal) => {
    if (isMounted.value && newVal) {
      updateBookingStore();
    }
  }
);

watch(
  () => form.comment,
  (newVal) => {
    if (isMounted.value) {
      updateBookingStore();
    }
  }
);

onMounted(async () => {
  try {
    await customerStore.fetchClientNames();
    
    // Загружаем существующие данные из bookingStore
    if (bookingStore.booking.customers && bookingStore.booking.customers.length > 0) {
      const existingCustomer = bookingStore.booking.customers;
      form.clientType = existingCustomer.clientType || '';
      form.clientName = existingCustomer.clientName || '';
      form.comment = existingCustomer.comment || '';
    }
    
    isMounted.value = true;
  } catch (err) {
    console.error('Ошибка при загрузке данных:', err);
  }
});
</script>

<template>
  <div class="section filters">
    <h2 class="section-title">Заказчик</h2>
    <div class="customer-info">
      <div class="info-grid grid-n">
        <div class="info-item">
          <label class="info-label">Тип Заказчика *</label>
          <div class="filter-item">
            <UDropdown 
              v-model="form.clientType" 
              :list="['Физ.лицо', 'Юр.лицо']" 
              placeholder="Выберите тип"
            />
          </div>
        </div>
        <div class="info-item">
          <label class="info-label">Наименование Заказчика *</label>
          <div class="filter-item">
            <UDropdown
              v-model="form.clientName"
              :list="customerStore.clientNames"
              :withSearch="true"
              placeholder="Выберите клиента"
            />
          </div>
        </div>
      </div>
      <div class="info-item">
        <label class="info-label">Комментарий</label>
        <textarea 
          class="input-field" 
          rows="3" 
          v-model="form.comment"
          placeholder="Дополнительная информация..."
        ></textarea>
      </div>
      
      <!-- Отладочная информация -->
      <div  class="debug-info">
        <h4>Заказчик(тест на заполняемость):</h4>
        <pre>{{ JSON.stringify(bookingStore.booking.customers, null, 2) }}</pre>
    </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #353535;
  padding-bottom: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.filters {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.customer-info {
  border-radius: 12px;
  padding: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  margin-bottom: 16px;
}

.info-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 6px;
  display: block;
  font-weight: 500;
}

.info-grid.grid-n {
  grid-template-columns: 150px 1fr;
}

.input-field {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: #fff;
  }
}

.debug-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #10b981;
  
  h4 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #065f46;
    font-weight: 600;
  }
  
  pre {
    font-size: 12px;
    color: #047857;
    margin: 0;
    white-space: pre-wrap;
    background: #ecfdf5;
    padding: 10px;
    border-radius: 4px;
  }
}
</style>