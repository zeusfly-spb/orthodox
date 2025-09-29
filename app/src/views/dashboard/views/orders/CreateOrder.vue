<!-- Создание заявки расширенный функционал 
Путь к странице : orders/new 
-->
<script setup>
import { reactive, ref, onMounted, nextTick, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import UInput from '@/components/ui/UInput.vue';
import UDropdown from '@/components/ui/UDropdown.vue';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import AppDatePicker from '@/components/app/AppDatePicker.vue';
import ContactPerson from './ContactPerson.vue';
import Client from './Client.vue';
import PiligrimTourists from './PiligrimTourists.vue';
import ModalTag from './ModalTag.vue';
import FilesTable from '../../FilesTable.vue';
import MainInfo from './MainInfo.vue';
import { useBookingStore } from '@/stores/booking';
import { useTourStore } from '@/stores/tour';
import { useCustomerStore } from '@/stores/customer';
import { useOrderStore } from '@/stores/order';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { bookingParams } from '@/api/bookings';

const route = useRoute();
const bookingStore = useBookingStore();
const tourStore = useTourStore();
const customerStore = useCustomerStore();
const orderStore = useOrderStore();

const isCalendarOpened = reactive({
  startDate: false,
  finishDate: false,
});

const handleTourSelect = (selectedTitle) => {
  if (selectedTitle) {
    tourStore.findTourByTitle(selectedTitle);
  }
};

const contactPersons = ref([
  {
    id: Date.now(),
    fullname: '',
    email: '',
    phone: '',
    comment: '',
  },
]);

function handleAddItem(newItem) {
  bookingStore.booking.contactPersons.push(newItem);
  contactPersons.value.push({
    id: Date.now(),
    fullname: '',
    email: '',
    phone: '',
    comment: '',
  });
}

function handleRemoveItem(index) {
  if (contactPersons.value.length > 1) {
    contactPersons.value.splice(index, 1);
    bookingStore.booking.contactPersons.splice(index, 1);
  }
}

const focusFirstInput = async () => {
  await nextTick();
  
  const firstInput = document.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
  
  if (firstInput) {
    firstInput.focus();
  }
};

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    console.log('ESC pressed - exit edit mode');
  }
};

onMounted(async () => {
  await customerStore.fetchClientNames();
  await orderStore.fetchOrderStatuses();
  await tourStore.fetchTours();

  console.log(tourStore.$state)
  
  await focusFirstInput();
  
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="ml-64 flex-1 transition-all duration-300 min-w-0 lg:ml-16">
    <div class="p-4 md:p-6 lg:p-8 w-full max-w-full box-border">
      <div class="text-slate-500 text-base leading-6 mb-5">
        Мои заявки / Создание новой заявки 
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <div class="xl:col-span-2 space-y-6 lg:space-y-8">
          <!-- Общая информация -->
          <div class="bg-white p-4 md:p-5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100">
            <h2 class="text-base lg:text-lg font-semibold text-gray-800 pb-2 mb-4 lg:mb-5">
              Общая информация
            </h2>
            
            <div class="space-y-4 lg:space-y-5">
              <div>
                <label class="block text-xs text-slate-500 mb-1">
                  Название паломнического тура
                </label>
                <UDropdown
                  :list="tourStore.toursTitles"
                  v-model="bookingStore.booking.title"
                  :withSearch="true"
                  @update:modelValue="handleTourSelect"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-slate-500 mb-1">Номер тура</label>
                  <div class="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50">
                    {{ bookingStore.booking.tourId }}
                  </div>
                </div>
                <div>
                  <label class="block text-xs text-slate-500 mb-1">Менеджер</label>
                  <div class="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50">
                    {{ bookingStore.booking.manager}}
                  </div>
                </div>
              </div>

              <!-- <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs text-slate-500 mb-1">Кол-во ночей</label>
                  <div class="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50">
                    {{ bookingStore.booking.counts.nights }}
                  </div>
                </div>
                <div>
                  <label class="block text-xs text-slate-500 mb-1">Кол-во свободных мест</label>
                  <div class="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50">
                    {{ bookingStore.booking.counts.freePlaces }}
                  </div>
                </div>
                <div>
                  <label class="block text-xs text-slate-500 mb-1">Кол-во человек</label>
                  <div class="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50">
                    {{ bookingStore.booking.counts.people }}
                  </div>
                </div>
              </div> -->

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-slate-500 mb-1">Дата начала тура</label>
                  <Popover :open="false">
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal flex gap-2 px-3 py-2.5 h-auto"
                        disabled
                      >
                        <CalendarIcon class="mr-2 h-4 w-4 opacity-50" />
                        <span class="text-sm">
                          {{ bookingStore.booking.dates.start ? 
                             new Date(bookingStore.booking.dates.start).toLocaleDateString('ru-RU') : 
                             'Дата не доступна' 
                          }}
                        </span>
                      </Button>
                    </PopoverTrigger>
                  </Popover>
                </div>
                
                <div>
                  <label class="block text-xs text-slate-500 mb-1">Дата окончания тура</label>
                  <Popover :open="false">
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal flex gap-2 px-3 py-2.5 h-auto"
                        disabled
                      >
                        <CalendarIcon class="mr-2 h-4 w-4 opacity-50" />
                        <span class="text-sm">
                          {{ bookingStore.booking.dates.finish ? 
                             new Date(bookingStore.booking.dates.finish).toLocaleDateString('ru-RU') : 
                             'Дата не доступна' 
                          }}
                        </span>
                      </Button>
                    </PopoverTrigger>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          <!-- Контактные лица -->
          <ContactPerson
            v-for="(contact, index) in contactPersons"
            :key="contact.id"
            :showAddButton="index === contactPersons.length - 1"
            :countContacts="index + 1"
            :index="index"
            @add-item="handleAddItem"
            @remove-item="handleRemoveItem"   
            v-model:fullname="contact.fullname"
            v-model:email="contact.email"
            v-model:phone="contact.phone"
            v-model:comment="contact.comment"
            class="bg-white p-4 md:p-5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100"
          />

          <!-- Клиенты -->
          <div class="bg-white p-4 md:p-5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100">
            <Client />
          </div>

          <!-- Туристы-паломники -->
          <div class="bg-white p-4 md:p-5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100">
            <PiligrimTourists />
          </div>

          <!-- Документы -->
          <div class="bg-white p-4 md:p-5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100">
            <h2 class="text-base lg:text-lg font-semibold text-gray-800 pb-2 mb-4 lg:mb-5">
              Документы
            </h2>
            <div class="w-full overflow-x-auto rounded-lg bg-white shadow-sm border border-gray-100">
              <FilesTable />
            </div>
          </div>
        </div>

        <!-- Боковая панель с основной информацией -->
        <div class="xl:col-span-1">
          <div class="sticky top-4">
            <MainInfo />
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно тегов -->
    <ModalTag v-if="false" />
    
    <!-- Уведомление об ошибке -->
    <Alert
      variant="destructive"
      v-show="bookingStore.error"
      class="fixed top-4 right-4 w-[350px] p-3 z-50 shadow-lg border border-red-200"
    >
      <AlertTitle class="text-sm font-medium">Ошибка!</AlertTitle>
      <AlertDescription class="text-sm mt-1">
        {{ bookingStore.error }}
      </AlertDescription>
    </Alert>
  </div>
</template>

<style scoped>
/* Кастомные стили для скроллбара таблиц */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}
</style>