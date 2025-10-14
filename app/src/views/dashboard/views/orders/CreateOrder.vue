<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import UDropdown from '@/components/ui/UDropdown.vue';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { bookingApi, bookingParams } from '@/api/bookings';



import { useTourStore } from '@/stores/tour';
import { useOrderStore } from '@/stores/order';
import ContactPerson from './ContactPerson.vue';
import CustomerForm from '@/components/dashboard/customers/CustomerForm.vue';
import Servicesform from '../bookings/createform/servicesform.vue';
import Bookingsidebar from '../bookings/createform/bookingsidebar.vue';
import MainInfo from './MainInfo.vue';
import PiligrimTourists from './PiligrimTourists.vue';


const router = useRouter();
const tourStore = useTourStore();
const orderStore = useOrderStore();


const formData = reactive({
  tour_id: null,
  status: 'pending',
  description: null,
  payment_status: 'pending',
  contact_persons: [],
  services: [],
  tags: [],
  customers: []
});
const showMoreButton =  false


// Selected tour info (read-only from tour store)
const selectedTour = ref(null);

// Status options
const statusOptions = [
  { value: 'pending', label: 'Ожидает подтверждения' },
  { value: 'confirmed', label: 'Подтверждено' },
  { value: 'cancelled', label: 'Отменено' },
  { value: 'completed', label: 'Завершено' }
];

const paymentStatusOptions = [
  { value: 'pending', label: 'Не оплачено' },
  { value: 'paid', label: 'Оплачено' },
  { value: 'paid_partially', label: 'Частично оплачено' },
  { value: 'cancelled', label: 'Аннулировано' },
  { value: 'refunded', label: 'Возврат' }
];

const isSubmitting = ref(false);
const error = ref(null);
const success = ref(false);

// Handle tour selection
const handleTourSelect = (tourTitle) => {
  console.log(tourStore)
 if (tourTitle && tourStore.allTours) {
  console.log(tourTitle);
    const tour = tourStore.allTours.find(t => t.title === tourTitle);
    if (tour) {
      selectedTour.value = tour;
      formData.tour_id = tour.id;
    }
};
}

// Computed values from selected tour
const tourInfo = computed(() => {
  if (!selectedTour.value) return null;
  return {
    tourId: selectedTour.value.id,
    manager: selectedTour.value.manager || 'Не назначен',
    nights: selectedTour.value.nights || 0,
    price: selectedTour.value.price || 0,
    freePlaces: selectedTour.value.seats || 0,
    totalPlaces: selectedTour.value.total_places || 0,
    startDate: selectedTour.value.date_start,
    finishDate: selectedTour.value.date_end
  };
});

// Calculate total people from services
const totalPeople = computed(() => {
  return formData.services.reduce((sum, service) => sum + (service.quantity || 0), 0);
});

// Validate form
const validateForm = () => {
  if (!formData.tour_id) {
    error.value = 'Выберите тур';
    return false;
  }
  if (formData.contact_persons.length === 0) {
    error.value = 'Добавьте хотя бы одно контактное лицо';
    return false;
  }
  if (formData.customers.length === 0) {
    error.value = 'Добавьте хотя бы одного туриста';
    return false;
  }
  if (formData.services.length === 0) {
    error.value = 'Выберите услуги для туристов';
    return false;
  }
  return true;
};

// Submit form
const handleSubmit = async () => {
  error.value = null;
  console.log(formData)
  if (!validateForm()) {
    alert(error.value)
    return;
  }

  isSubmitting.value = true;

  try {
    alert("sended")
  let response =  await bookingApi.storeData(JSON.stringify(formData))

    const result = await response.json();
    success.value = true;
    
    // Redirect to booking details after 1 second
    setTimeout(() => {
      router.push(`/bookings/${result.id}`);
    }, 1000);

  } catch (err) {
    error.value = err.message || 'Произошла ошибка при создании заявки';
  } finally {
    isSubmitting.value = false;
  }
};
function formatCurrency(value) {
  if (!value && value !== 0) return '';
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
}
// Reset form
const handleReset = () => {
  formData.tour_id = null;
  formData.status = 'pending';
  formData.description = null;
  formData.payment_status = 'pending';
  formData.contact_persons = [];
  formData.services = [];
  formData.tags = [];
  formData.customers = [];
  selectedTour.value = null;
  error.value = null;
  success.value = false;
};

onMounted(async () => {
  await tourStore.fetchTours();
  await orderStore.fetchOrderStatuses();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div class="text-sm text-gray-500 mb-6">
        Мои заявки / Создание новой заявки
      </div>

       
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6">Общая информация</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-600 mb-2">Название паломнического тура</label>
                <UDropdown
                  :list="tourStore.toursTitles"
                  :modelValue="selectedTour?.title"
                  :withSearch="true"
                  @update:modelValue="handleTourSelect"
                  placeholder="Выберите тур"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-2">Номер тура</label>
                  <div class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                    {{ tourInfo?.tourId || '—' }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-2">Менеджер</label>
                  <div class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                    {{ tourInfo?.manager || '—' }}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-2">Кол-во ночей</label>
                  <div class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                    {{ tourInfo?.nights || 0 }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-2">Свободных мест</label>
                  <div class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                    {{ tourInfo?.freePlaces || 0 }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-2">Кол-во человек</label>
                  <div class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                    {{ totalPeople }}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-2">Дата начала тура</label>
                       <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                        disabled
                      >      
                  <span>{{ tourInfo?.startDate ? new Date(tourInfo.startDate).toLocaleDateString('ru-RU') : 'Дата не доступна' }}</span>
</Button>
                </div>
                
                <div>
                  <label class="block text-sm text-gray-600 mb-2">Дата окончания тура</label>
                  <Popover :open="false">
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                        disabled
                      >
                        <span>{{ tourInfo?.finishDate ? new Date(tourInfo.finishDate).toLocaleDateString('ru-RU') : 'Дата не доступна' }}</span>
                      </Button>
                    </PopoverTrigger>
                  </Popover>
                </div>
              </div>
            </div>
          </div>


           <ContactPerson v-model="formData.contact_persons" />


          <CustomerForm v-model="formData.customers" />

 
      
          <PiligrimTourists v-model="formData.services" 
              @update:customers="(customers) => formData.customers = customers"  
      @update:services="(services) => formData.services = services"  
          />
        
        
        </div>

        <div class="lg:col-span-1">
  <div class="mb-8">
    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <!-- Заголовок -->
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Детали заказа</h2>

      <!-- Header с изображением и деталями тура -->
      <div class="order-item mb-6">
        <div class="header-sec-right-col flex items-start gap-4 mb-4">
          <div class="flex-shrink-0">
            <img :src="'/img/mini-sob.png'" class="w-12 h-12 object-contain rounded-lg shadow-sm" alt="Tour icon" />
          </div>
         
        </div>

        <!-- Список туристов (улучшенный: карточки с иконками, hover) -->
        <div class="tourists-list mb-6">
          <div 
            v-for="(item, index) in formData.customers" 
            :key="index" 
            class="tourist-item2 flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg mb-2 last:mb-0 hover:bg-gray-50 transition-colors bg-white shadow-sm"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span class="text-primary-foreground font-semibold text-xs">{{ index + 1 }}</span>
              </div>
              <div class="tourist-name2 font-medium text-gray-700 text-sm">{{item.firstname }} {{item.lastname }}</div>
            </div>
            <div class="tourist-price2 text-gray-900 font-semibold text-sm bg-gray-50 px-3 py-1 rounded-md">
              {{ tourInfo?.price }} ₽
            </div>
          </div>
          
          <!-- Кнопка "Показать еще/Свернуть" (улучшенная: с иконкой, hover) -->
          <div v-if="showMoreButton" class="show-more-container flex justify-center mt-4">
            <button 
              class="show-more-btn inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 transition-all shadow-sm"
              @click="toggleTourists"
            >
              <svg v-if="isTouristsExpanded" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              {{ isTouristsExpanded ? 'Свернуть' : `Показать еще ${formData.customers.length - 3}` }}
            </button>
          </div>
        </div>

        <!-- Общая стоимость (улучшенная: карточка с иконкой, выделение) -->
        <div class="total-price2 flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 shadow-inner mb-6">
          <div class="flex items-center gap-2">
        
            <span class="font-semibold text-gray-800 text-base">Общая стоимость</span>
          </div>
          <div class="tot-pr text-2xl font-bold text-green-600 flex items-baseline gap-1">
            {{ formatCurrency(tourInfo?.price * formData.customers.length) }}
            <span class="text-sm text-gray-500"></span>
          </div>
        </div>

        <!-- Разделитель -->
        <hr class="border-gray-200 mb-6" />

        <!-- Опции оплаты (улучшенные: карточки для radio, hover) -->
  <div class="payment-options2 mb-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Полная оплата -->
    <label 
      class="payment-option flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all relative"
      :class="{ 'bg-green-50 border-green-400': formData.payment_status === 'full' }"
      role="radio"
      :aria-checked="formData.payment_status === 'full'"
    >
      <input type="radio" name="paymentType" value="full" v-model="formData.payment_status" class="absolute opacity-0 sr-only" />
     
      <div class="ml-1">
        <div class="font-medium text-gray-900 text-sm">Полная оплата</div>
      </div>
    </label>

    <!-- Частичная оплата -->
    <label 
      class="payment-option flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all relative"
      :class="{ 'bg-yellow-50 border-yellow-400': formData.payment_status === 'paid_partially' }"
      role="radio"
      :aria-checked="formData.payment_status === 'paid_partially'"
    >
      <input type="radio" name="paymentType" value="paid_partially" v-model="formData.payment_status" class="absolute opacity-0 sr-only" />
   
      <div class="ml-1">
        <div class="font-medium text-gray-900 text-sm">Частичная оплата</div>
      </div>
    </label>
  </div>
</div>

        <!-- Секция частичной оплаты (улучшенная: карточка с фокусом) -->
        <div v-if="formData.payment_status === 'paid_partially'" class="partial-payment-section bg-yellow-50 p-5 rounded-2xl border border-yellow-200 mb-6">
          <h4 class="font-medium text-gray-900 text-sm mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Детали частичной оплаты
          </h4>
          <div class="space-y-4">
            <div>
              <label class="info-label block text-xs font-medium text-gray-700 mb-2">Сумма частичной оплаты</label>
              <input
                type="text"
                class="amount-input w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent shadow-sm"
                v-model="displayValue"
                @input="handleInput"
                @blur="formatValue"
                placeholder="Введите сумму (например, 50000)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Отладочная секция (улучшенная: collapsible карточка) -->
      <div class="booking-store-view mb-8">
        <details class="group">
          <summary class="flex items-center justify-between p-4 bg-gray-100 rounded-t-xl cursor-pointer hover:bg-gray-200 transition-colors">
            <h3 class="text-sm font-medium text-gray-900">Данные для отправки (тест на заполняемость)</h3>
            <svg class="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <pre class="json-view bg-gray-50 p-4 rounded-b-xl border-t border-gray-200 font-mono text-xs max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-gray-700">{{ JSON.stringify(formData, null, 2) }}</pre>
        </details>
      </div>

      <!-- Кнопки действий (улучшенные: с иконками, hover) -->
      <div class="action-buttons3 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button class="btn btn-outline flex items-center justify-center gap-2 py-3 px-6 border-2 border-gray-300 text-gray-700 bg-white rounded-xl font-medium text-sm hover:border-gray-400 hover:bg-gray-50 hover:shadow-md transition-all">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          В архив
        </button>
        <button class="btn btn-primary flex items-center justify-center gap-2 py-3 px-6 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary hover:shadow-lg transition-all shadow-md"
        @click="handleSubmit"
        
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Сохранить
        </button>
      </div>
    </div>
  </div>
  </div> 
        </div>
      </div>
    </div>
</template>
