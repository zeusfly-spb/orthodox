<script setup>
import { reactive, ref, onMounted, nextTick, onUnmounted,computed } from 'vue';
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

const route = useRoute();
const bookingId = route.params.id;

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
  // await bookingStore.fetchBookingData(bookingId);
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
  <div class="main-content">
    <div class="content">
      <div class="title-bread-com">
        Мои заявки / Создание новой заявки 
      </div>
      <div class="grid-tours-fd">
        <div>
          <div class="section filters">
            <h2 class="section-title">Общая информация</h2>
            <label class="info-label">Название паломнического тура</label>
            <UDropdown
              :list="tourStore.toursTitles"
              v-model="bookingStore.booking.title"
              :withSearch="true"
              @update:modelValue="handleTourSelect"
            />
           <div class="info-grid">
              <div class="info-item">
                <label class="info-label">Номер тура</label>
                <div class="input-field">{{ bookingStore.booking.tourId }}</div>
              </div>
              <div class="info-item">
                <label class="info-label">Менеджер</label>
                <div class="input-field">{{ bookingStore.booking.manager }}</div>
              </div>
            </div> 
<!-- <div>
  {{ 
    bookingStore.mainInfo.tourrice }}
</div> -->
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">Кол-во ночей</label>
                <UInput
                  inputType="number"
                  v-model="bookingStore.booking.counts.nights"
                  :allowNegative="false"
                  :inputHeightPx="43"
                />
              </div>
              <div class="info-item">
                <label class="info-label">Кол-во свободных мест</label>
                <UInput
                  inputType="number"
                  v-model="bookingStore.booking.counts.freePlaces"
                  :allowNegative="false"
                  :inputHeightPx="43"
                />
              </div>
              <div class="info-item">
                <label class="info-label">Кол-во человек</label>
                <UInput
                  inputType="number"
                  v-model="bookingStore.booking.counts.people"
                  :allowNegative="false"
                  :inputHeightPx="43"
                />
              </div>
            </div>

  <div class="info-grid">
  <div class="info-item">
    <label class="info-label">Дата начала тура</label>
    <div class="flex">
      <Popover v-model:open="isCalendarOpened.startDate">
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            class="w-full justify-start text-left font-normal flex gap-2"
          >
            <CalendarIcon class="mr-2 h-4 w-4" />
            <span>{{ bookingStore.booking.dates.start ? new Date(bookingStore.booking.dates.start).toLocaleDateString('ru-RU') : 'Выберите дату' }}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <AppDatePicker
            v-model="bookingStore.booking.dates.start"
            @update:modelValue="isCalendarOpened.startDate = false"
          />
        </PopoverContent>
      </Popover>
    </div>
  </div>
  
  <div class="info-item">
    <label class="info-label">Дата окончания тура</label>
    <div class="flex">
      <Popover v-model:open="isCalendarOpened.endDate">
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            class="w-full justify-start text-left font-normal flex gap-2"
          >
            <CalendarIcon class="mr-2 h-4 w-4" />
            <span>{{ bookingStore.booking.dates.finish ? new Date(bookingStore.booking.dates.finish).toLocaleDateString('ru-RU') : 'Выберите дату' }}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <AppDatePicker
            v-model="bookingStore.booking.dates.finish"
            :min-date="bookingStore.booking.dates.start"
            @update:modelValue="isCalendarOpened.endDate = false"
          />
        </PopoverContent>
      </Popover>
    </div>
  </div>
</div>
          </div>

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
          />

          <Client />
          <PiligrimTourists />

          <div class="section filters">
            <h2 class="section-title">Документы</h2>
            <div>
              <div class="table-wrapper2">
                <FilesTable />
              </div>
            </div>
          </div>
        </div>
        <MainInfo />
      </div>
    </div>
    <ModalTag v-if="false" />
    <Alert
      variant="destructive"
      v-show="bookingStore.error"
      class="fixed top-4 right-4 w-[350px] p-2 z-50 shadow-lg"
    >
      <AlertTitle>Ошибка!</AlertTitle>
      <AlertDescription>
        {{ bookingStore.error }}
      </AlertDescription>
    </Alert>
  </div>
</template>
<style scoped lang="scss">
.main-content {
  margin-left: 250px;
  flex: 1;
  transition: all 0.3s;
  min-width: 0;
}

.content {
  padding: 30px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.btn {
  padding: 8px 15px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.btn-primary {
  background-color: rgba(16, 185, 129, 1);
  color: #fff;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;

  &:hover {
    background-color: #0f9166;
  }
}

.btn-outline {
  background: #fff;
  border: 1px solid rgba(16, 185, 129, 1);
  color: rgba(16, 185, 129, 1);
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
}

.filters {
  background: #fff;
  padding: 20px;
  border-radius: 24px;
  margin-bottom: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

td,
th {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
}

td {
  font-weight: 400;
  font-size: 14px;
  color: rgba(53, 53, 53, 1);
}

th {
  font-weight: 500;
  color: rgba(106, 110, 117, 1);
  text-transform: uppercase;
  font-size: 11px;
}

tr:hover {
  background-color: rgba(76, 175, 80, 0.05);
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #4caf50;

    svg path {
      fill: #4caf50;
    }
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #353535;
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  margin-top: 10px;
}

.info-item {
  margin-bottom: 12px;
}

.info-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
  display: block;
}

.input-field {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
}

.title-bread-com {
  font-weight: 400;
  color: rgba(106, 110, 117, 1);
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 20px;
}

.order-meta {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 12px;
}

.order-price-3 {
  font-weight: 500;
  color: #353535;
  font-size: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  position: relative;
  vertical-align: middle;
  margin-right: 8px;
}

input[type='checkbox'] {
  position: absolute;
  opacity: 0;

  &:checked + .checkbox {
    background-color: rgba(16, 185, 129, 1);
    border-color: rgba(16, 185, 129, 1);

    &::after {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid #fff;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
}

.date-input-wrapper {
  position: relative;
  width: 100%;
}

.calendar-icon {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 20px;
}

.grid-tours-fd {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
}

.order-item {
  margin-bottom: 20px;
}

.order-title3 {
  font-weight: 500;
  margin-bottom: 8px;
  color: #353535;
  font-size: 14px;
}

.tourist-item2 {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
}

.tourist-name2 {
  font-weight: 400;
  color: rgba(106, 110, 117, 1);
}

.tourist-price2 {
  color: rgba(53, 53, 53, 1);
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
}

.tot-pr {
  font-size: 20px;
}

.total-price2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  background: rgba(249, 249, 250, 1);
  padding: 16px;
}

.payment-options2 {
  display: block;
  margin-top: 16px;
}

.payment-options2 .payment-option {
  margin-bottom: 15px;
}

.header-sec-right-col {
  display: flex;
  align-items: top;
  gap: 20px;
}

.partial-payment-section {
  margin-top: 16px;
}

.action-buttons3 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 30px;
}

.t-center {
  text-align: center;
  display: block;
}

hr {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 16px 0;
}

.amount-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  margin-bottom: 12px;
}

.table-wrapper2 {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  text-align: left;
  padding: 12px 16px;
  background: #f9fafb;
  font-weight: 500;
  color: #6a6e75;
  font-size: 12px;
  text-transform: uppercase;
}

.users-table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.user-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.actions-container {
  position: relative;
}

.date-rekz {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(53, 53, 53, 1);
}

.stacked-avatars2 {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 32px;
}

.avatar3 {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  position: relative;
  margin-left: -10px;
  background-color: rgba(214, 224, 255, 1);
}

.avatar3:first-child {
  margin-left: 0;
  background-color: rgba(220, 242, 234, 1);
}

.avatar3:nth-child(2) {
  background-color: rgba(255, 239, 210, 1);
}

.plus-count {
  margin-left: 5px;
  font-weight: 400;
  font-size: 14px;
  color: rgba(53, 53, 53, 1);
}

.avtor-dog-tab {
  font-weight: 400;
  font-size: 12px;
  margin-top: 10px;
  line-height: 100%;
  color: rgba(106, 110, 117, 1);
}

.name-dog {
  display: flex;
  align-items: center;
  gap: 20px;
}

.name-dogov-tab {
  font-weight: 500;
}

.more-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;

  &:hover svg path {
    fill: #4caf50;
  }
}

@media (max-width: 768px) {
  .grid-tours-fd {
    grid-template-columns: 1fr;
  }

  .table-wrapper2 {
    border-radius: 0;
  }

  .users-table td,
  .users-table th {
    padding: 10px 12px;
    font-size: 13px;
  }

  .action-buttons3 {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 1600px) {
  .table-wrapper2 {
    overflow-x: auto;
  }
}

.table-wrapper2::-webkit-scrollbar {
  height: 6px;
}

.table-wrapper2::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
