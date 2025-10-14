<template>
  <div class="tourists-list">
    <div class="section-header">
      <h2 class="section-title">Список туристов</h2>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="text-center py-8">
        <div class="text-gray-500">Загрузка данных о туристах...</div>
      </div>
    </div>

    <div v-else-if="tourists.length === 0" class="empty-state">
      <div class="text-center py-8">
        <div class="text-gray-500">Туристы не найдены</div>
      </div>
    </div>

    <div v-else class="tourists-table-container">
      <table class="tourists-table">
        <thead>
          <tr>
            <th class="table-header">
              <div class="header-content">
                <MoreHorizontal class="w-4 h-4 text-gray-400" />
                <span>НОМЕР ЗАКАЗА</span>
              </div>
            </th>
            <th class="table-header">
              <div class="header-content">
                <MoreHorizontal class="w-4 h-4 text-gray-400" />
                <span>ФИО ТУРИСТА</span>
              </div>
            </th>
            <th class="table-header">
              <div class="header-content">
                <MoreHorizontal class="w-4 h-4 text-gray-400" />
                <span>СТОИМОСТЬ, РУБ</span>
              </div>
            </th>
            <th class="table-header">
              <div class="header-content">
                <MoreHorizontal class="w-4 h-4 text-gray-400" />
                <span>ДОП. УСЛУГИ</span>
              </div>
            </th>
            <th class="table-header">
              <div class="header-content">
                <MoreHorizontal class="w-4 h-4 text-gray-400" />
                <span>СТАТУС ОПЛАТЫ</span>
              </div>
            </th>
            <th class="table-header">
              <div class="header-content">
                <MoreHorizontal class="w-4 h-4 text-gray-400" />
                <span>СУММА ОПЛАТЫ</span>
              </div>
            </th>
            <th class="table-header">
              <div class="header-content">
                <MoreHorizontal class="w-4 h-4 text-gray-400" />
                <span>НУЖНО ОПЛАТИТЬ</span>
              </div>
            </th>
            <th class="table-header">
              <div class="header-content">
                <MoreHorizontal class="w-4 h-4 text-gray-400" />
                <span>ГОД РОЖДЕНИЯ</span>
              </div>
            </th>
            <th class="table-header">
              <div class="header-content">
                <MoreHorizontal class="w-4 h-4 text-gray-400" />
                <span>КОММЕНТАРИЙ</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tourist in tourists" :key="tourist.id" class="table-row">
            <td class="table-cell">
              <span class="order-number">№{{ tourist.bookingId }}</span>
            </td>
            <td class="table-cell">
              <div class="tourist-info">
                <div class="tourist-name">{{ getFullName(tourist) }}</div>
                <div v-if="tourist.role" class="tourist-role">{{ tourist.role }}</div>
              </div>
            </td>
            <td class="table-cell">
              <span class="price">{{ formatPrice(tourist.cost) }}</span>
            </td>
            <td class="table-cell">
              <div class="services">
                <div v-for="service in tourist.additionalServices" :key="service" class="service-item">
                  {{ service }}
                </div>
              </div>
            </td>
            <td class="table-cell">
              <span :class="getPaymentStatusClass(tourist.paymentStatus)" class="payment-status">
                {{ tourist.paymentStatus }}
              </span>
            </td>
            <td class="table-cell">
              <span class="price">{{ formatPrice(tourist.paidAmount) }}</span>
            </td>
            <td class="table-cell">
              <span class="price">{{ formatPrice(tourist.amountToPay) }}</span>
            </td>
            <td class="table-cell">
              <span class="birth-year">{{ tourist.birthYear }}</span>
            </td>
            <td class="table-cell">
              <span class="comment">{{ tourist.comment }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil, MoreHorizontal } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { tourApi } from '@/api/tours';
import type { Tour } from '@/types/tour';

interface TouristData {
  id: string | number;
  bookingId: string | number;
  firstname: string;
  lastname: string;
  patronymic: string;
  role?: string;
  cost: number;
  additionalServices: string[];
  paymentStatus: string;
  paidAmount: number;
  amountToPay: number;
  birthYear: string;
  comment: string;
}

const props = defineProps<{
  tour: Tour;
}>();

const isLoading = ref(false);
const touristsData = ref<TouristData[]>([]);

const tourists = computed(() => touristsData.value);

const loadTouristsData = async () => {
  if (!props.tour?.id) return;
  
  isLoading.value = true;
  try {
    const response = await tourApi.getData(props.tour.id);
    const tourData = response.data;
    
    const allTourists: TouristData[] = [];
    
    if (tourData.bookings && Array.isArray(tourData.bookings)) {
      tourData.bookings.forEach((booking: any) => {
        if (booking.customers && Array.isArray(booking.customers)) {
          booking.customers.forEach((customer: any) => {
            allTourists.push({
              id: customer.id || `${booking.id}-${customer.firstname}-${customer.lastname}`,
              bookingId: booking.id,
              firstname: customer.firstname || '',
              lastname: customer.lastname || '',
              patronymic: customer.patronymic || '',
              role: customer.role || 'Священник',
              cost: booking.tour?.price || props.tour.price || 0,
              additionalServices: [
                'Ужин в ресторане 3*',
                'Экскурсия в Псково – Печерский монастырь'
              ],
              paymentStatus: customer.payment_status || 'Оплачено',
              paidAmount: booking.tour?.price || props.tour.price || 0,
              amountToPay: 0,
              birthYear: customer.passport_birth_date ? 
                new Date(customer.passport_birth_date).getFullYear().toString() : '1998',
              comment: customer.description || 'Lorem ipsu adipiscing incididunt'
            });
          });
        }
      });
    }
    
    touristsData.value = allTourists;
  } catch (error) {
    console.error('Ошибка загрузки данных о туристах:', error);
  } finally {
    isLoading.value = false;
  }
};

const getFullName = (tourist: TouristData) => {
  const parts = [tourist.lastname, tourist.firstname, tourist.patronymic].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : 'Не указано';
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
};

const getPaymentStatusClass = (status: string) => {
  switch (status) {
    case 'Оплачено':
      return 'status-paid';
    case 'Частично оплачено':
      return 'status-partial';
    case 'Не оплачено':
      return 'status-unpaid';
    default:
      return 'status-default';
  }
};

const handleEdit = () => {
  console.log('Редактирование списка туристов');
};

onMounted(() => {
  loadTouristsData();
});
</script>

<style scoped>
.tourists-list {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  margin-top: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.loading-state,
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.tourists-table-container {
  overflow-x: auto;
}

.tourists-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.table-header {
  padding: 1rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
}

.table-row:hover {
  background-color: #f9fafb;
}

.table-cell {
  padding: 1rem 0.75rem;
  vertical-align: top;
}

.order-number {
  font-weight: 500;
  color: #111827;
}

.tourist-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tourist-name {
  font-weight: 500;
  color: #111827;
}

.tourist-role {
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  display: inline-block;
  width: fit-content;
}

.price {
  font-weight: 500;
  color: #111827;
}

.services {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.service-item {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
}

.payment-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.status-paid {
  background-color: #dcfce7;
  color: #166534;
}

.status-partial {
  background-color: #fef3c7;
  color: #92400e;
}

.status-unpaid {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-default {
  background-color: #f3f4f6;
  color: #6b7280;
}

.birth-year {
  color: #6b7280;
}

.comment {
  color: #6b7280;
  font-size: 0.75rem;
  line-height: 1.4;
}

/* Адаптивность */
@media (max-width: 768px) {
  .tourists-table-container {
    font-size: 0.75rem;
  }
  
  .table-cell {
    padding: 0.75rem 0.5rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
}
</style>