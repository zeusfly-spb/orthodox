<script setup>
import { defineEmits, ref, onMounted, computed, watch } from 'vue';
import UInput from '@/components/ui/UInput.vue';
import UButton from '@/components/ui/UButton.vue';
import UDropdown from '@/components/ui/UDropdown.vue';
import UModal from '@/components/ui/UModal.vue';
import { useAccommodationStore } from '@/stores/accommodation';
import { useBookingStore } from '@/stores/booking';
import { useCustomerStore } from '@/stores/customer';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'update:customers', 'update:services']);

const services = ref([]);
const accommodationStore = useAccommodationStore();
const bookingStore = useBookingStore();
const customerStore = useCustomerStore();

// Mapping room types to service IDs (based on user description: single=6, double=7; extend as needed)
const roomTypeToServiceId = computed(() => ({
  single: 6,
  double: 7,
  // Add more mappings if there are other room types, e.g., triple: 8
}));

const addService = (type) => {
  services.value.push({
    id: type,
    quantity: 1
  });
};

const isShowModal = ref(false);
const innerTouristCount = ref(bookingStore.booking.counts.people || 1);
const isSaving = ref(false);

// Используем данные из сторов
const availableRoomTypes = computed(() => accommodationStore.roomTypes);
const enabledRoomTypes = computed(() => accommodationStore.enabledRoomTypes);
const accommodationOptions = computed(() => accommodationStore.accommodationOptions);
const touristsInfo = computed(() => bookingStore.booking.tourists || []);
const noAccommodationSelected = computed(() => accommodationStore.noAccommodationSelected);
const selectedAccommodation = computed(() => accommodationStore.selectedAccommodation);

const filteredAccommodationOptions = computed(() => {
  if (!accommodationOptions.value) return [];
  return accommodationOptions.value.filter((option) => {
    return Object.keys(option).every(
      (roomType) => option[roomType] === 0 || enabledRoomTypes.value.includes(roomType),
    );
  });
});

function closeModal() {
  isShowModal.value = false;
}

function selectTourist(tourist) {
  customerStore.updateCustomer(tourist);
  isShowModal.value = true;
}

async function handleDeleteTourist(id) {
  try {
    // Удаляем туриста из локального массива
    bookingStore.removeTourist(id);

    // Обновляем счетчик локально
    innerTouristCount.value = bookingStore.booking.tourists.length;

    calculateOptions();
    closeModal();
    // Emit updated customers to parent
    emit('update:customers', bookingStore.booking.tourists || []);
  } catch (error) {
    console.error('Error deleting tourist:', error);
  }
}

async function handleSaveTourist(id, data) {
  try {
    // Обновляем данные туриста в локальном массиве
    bookingStore.updateTouristData(id, data);
    closeModal();
    // Emit updated customers to parent
    emit('update:customers', bookingStore.booking.tourists || []);
  } catch (error) {
    console.error('Error updating tourist:', error);
  }
}

// Функция для синхронизации количества туристов (только локально)
const syncTouristsCount = (newCount) => {
  const currentCount = bookingStore.booking.tourists.length;

  if (newCount > currentCount) {
    // Добавляем новых туристов локально
    const touristsToAdd = newCount - currentCount;
    for (let i = 0; i < touristsToAdd; i++) {
      bookingStore.addTourist({
        firstname: 'Новый',
        lastname: 'Турист',
        payment_status: 'Не оплачено',
      });
    }
  } else if (newCount < currentCount) {
    // Удаляем лишних туристов локально (с конца)
    const touristsToRemove = currentCount - newCount;
    for (let i = 0; i < touristsToRemove; i++) {
      const lastTourist = bookingStore.booking.tourists[bookingStore.booking.tourists.length - 1];
      if (lastTourist) {
        bookingStore.removeTourist(lastTourist.id);
      }
    }
  }
  // Emit updated customers after sync
  emit('update:customers', bookingStore.booking.tourists || []);
};

function calculateOptions() {
  accommodationStore.updatePeopleCount(innerTouristCount.value);
}

function isRoomTypeEnabled(roomType) {
  return enabledRoomTypes.value.includes(roomType);
}

function toggleRoomType(roomType, isEnabled) {
  accommodationStore.toggleRoomType(roomType, isEnabled);
  calculateOptions();
}

function toggleNoAccommodation(isEnabled) {
  accommodationStore.toggleNoAccommodation(isEnabled);
  calculateOptions();
}

function getTotalRooms(option) {
  return accommodationStore.calculateTotalRooms(option);
}

function getAccommodationName(option) {
  return accommodationStore.getAccommodationName(option);
}

function selectOption(option) {
  accommodationStore.selectAccommodation(option);
  // Services will be updated via the watch on selectedAccommodation
}

function isOptionSelected(option) {
  if (!selectedAccommodation.value || !option) return false;

  // Сравниваем объекты по содержимому
  const selectedKeys = Object.keys(selectedAccommodation.value);
  const optionKeys = Object.keys(option);

  if (selectedKeys.length !== optionKeys.length) return false;

  return selectedKeys.every((key) => selectedAccommodation.value[key] === option[key]);
}

function emitSelectedOption() {
  if (selectedAccommodation.value) {
    emit('accommodation-selected', selectedAccommodation.value);
    emit('update:selectedOption', selectedAccommodation.value);
    console.log('Выбран вариант размещения:', selectedAccommodation.value);
  } else {
    alert('Пожалуйста, выберите вариант размещения');
  }
}

// Watch selectedAccommodation to update services in parent formData
watch(selectedAccommodation, (newVal) => {
  if (newVal) {
    const newServices = [];
    if (newVal.no_accommodation) {
      // No accommodation: clear services
      emit('update:services', []);
    } else {
      // Calculate services from selected option
      availableRoomTypes.value.forEach((room) => {
        const qty = newVal[room.type];
        if (qty > 0) {
          const serviceId = roomTypeToServiceId.value[room.type];
          if (serviceId) {
            newServices.push({
              id: serviceId,
              quantity: qty
            });
          }
        }
      });
      emit('update:services', newServices);
    }
  } else {
    emit('update:services', []);
  }
});

// Watch tourists to emit updates (deep watch for changes)
watch(
  () => bookingStore.booking.tourists,
  (newVal) => {
    emit('update:customers', newVal || []);
  },
  { deep: true }
);

// Следим за изменением количества туристов (только локальная синхронизация)
watch(innerTouristCount, (newValue, oldValue) => {
  if (newValue < 1) {
    innerTouristCount.value = 1;
    return;
  }

  // Синхронизируем количество туристов только локально
  syncTouristsCount(newValue);
  calculateOptions();
});

watch(
  () => bookingStore.booking.counts.people,
  (newValue) => {
    if (newValue !== undefined && newValue >= 1) {
      innerTouristCount.value = newValue;
      calculateOptions();
    }
  },
);

onMounted(() => {
  accommodationStore.updatePeopleCount(innerTouristCount.value);
  // Initial emit for customers
  emit('update:customers', bookingStore.booking.tourists || []);
  // Initial emit for services based on selected
  if (selectedAccommodation.value) {
    const newServices = [];
    if (selectedAccommodation.value.no_accommodation) {
      emit('update:services', []);
    } else {
      availableRoomTypes.value.forEach((room) => {
        const qty = selectedAccommodation.value[room.type];
        if (qty > 0) {
          const serviceId = roomTypeToServiceId.value[room.type];
          if (serviceId) {
            newServices.push({
              id: serviceId,
              quantity: qty
            });
          }
        }
      });
      emit('update:services', newServices);
    }
  }
});
</script>
<template>
  <div class="mb-8">
    <h2 class="text-base font-semibold text-gray-900 pb-2 mb-5">Паломники / Туристы</h2>

    <div class="bg-white p-5 rounded-3xl mb-8 shadow-sm">
      <div class="pilgrims-header">
        <div class="pilgrims-count-container flex flex-col gap-1 max-w-[120px]">
          <label class="text-xs text-gray-600">Количество туристов</label>
          <UInput
            class="number-input back-none w-10 text-center p-0 border-none bg-transparent"
            v-model="innerTouristCount"
            inputType="number"
            :inputHeightPx="43"
            :min="1"
          />
          <div
            class="local-changes-info text-xs text-blue-600"
            v-if="innerTouristCount !== bookingStore.booking.counts.people"
          >
            Изменения сохранены локально
          </div>
        </div>
      </div>

      <div class="pilgrims-info-container bg-gray-50 rounded-2xl p-4 mt-5 mb-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div class="room-types-section">
          <label class="block text-xs text-gray-600 mb-2">Доступные типы номеров</label>

          <!-- Вариант "Без размещения в номерах" -->
          <div class="room-types-options mb-2">
            <label class="room-type-option no-accommodation flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="noAccommodationSelected"
                @change="toggleNoAccommodation($event.target.checked)"
                class="absolute opacity-0"
              />
              <span class="custom-checkbox w-4 h-4 border border-gray-300 rounded flex-shrink-0 relative"></span>
              <span class="room-type-text flex items-center gap-3 text-sm">
                <span class="no-accommodation-icon">🚫</span>
                Без размещения в номерах
              </span>
            </label>
          </div>

          <!-- Обычные типы номеров -->
          <div
            v-for="room in availableRoomTypes.filter((r) => r.type !== 'no_accommodation')"
            :key="room.type"
            class="room-types-options mb-2"
          >
            <label 
              class="room-type-option flex items-center gap-2 cursor-pointer" 
              :class="{ 'opacity-50 cursor-not-allowed': noAccommodationSelected }"
            >
              <input
                type="checkbox"
                :checked="isRoomTypeEnabled(room.type)"
                @change="toggleRoomType(room.type, $event.target.checked)"
                :disabled="noAccommodationSelected"
                class="absolute opacity-0"
              />
              <span class="custom-checkbox w-4 h-4 border border-gray-300 rounded flex-shrink-0 relative"></span>
              <span class="room-type-text flex items-center gap-3 text-sm">
                <span class="bed-icons-inline flex items-center gap-0.5">
                  <span v-for="n in room.capacity" :key="n" class="bed-icon inline-flex items-center justify-center w-4 h-4">
                    <img src="/svg/bedd.svg" alt="кровать" class="w-full h-full object-contain" />
                  </span>
                </span>
                {{ room.name }}
              </span>
            </label>
          </div>
        </div>

        <div class="placement-options-section flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex-1">
            <label class="block text-xs text-gray-600 mb-2">Варианты размещения</label>
            <div class="placement-options flex flex-wrap gap-2 mt-2.5">
              <label
                v-for="(option, index) in filteredAccommodationOptions"
                :key="index"
                class="placement-option flex flex-col items-center p-2 border border-gray-200 rounded cursor-pointer transition-all min-w-[70px] bg-white hover:border-blue-500 hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="accommodation"
                  :checked="isOptionSelected(option)"
                  @change="selectOption(option)"
                  class="mb-1.25 absolute opacity-0"
                />
                <div class="bed-groups-container flex gap-2 items-center justify-center flex-wrap max-w-20">
                  <template v-if="option.no_accommodation">
                    <div class="no-accommodation-group flex items-center">
                      <span class="no-accommodation-icon">🚫</span>
                      Без размещения
                    </div>
                  </template>
                  <template v-else>
                    <template v-for="roomType in availableRoomTypes" :key="roomType.type">
                      <div
                        v-if="option[roomType.type] > 0"
                        class="bed-group flex gap-0.5 items-center"
                        :class="`group-${roomType.type}`"
                      >
                        <div
                          v-for="n in option[roomType.type]"
                          :key="n"
                          class="bed-icon inline-flex w-4 h-4"
                          :title="roomType.name"
                        >
                          <img src="/svg/bedd.svg" alt="кровать" class="w-full h-full object-contain" />
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
                <span class="placement-text text-xs text-gray-600 mt-1 text-center block">
                  {{ option.no_accommodation ? 'Все туристы' : `x${getTotalRooms(option)}` }}
                </span>
              </label>
            </div>
          </div>
          <div class="buttom-right flex flex-col gap-2.5">
            <UButton text="Выбрать" size="small" @click="emitSelectedOption" />
          </div>
        </div>
      </div>

      <div class="tourists-data-section">
        <label class="block text-xs text-gray-600 mb-2">Данные о туристах</label>
        <div class="table-wrapper2 w-full overflow-x-auto rounded-lg bg-white shadow-sm mb-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table class="users-table w-full border-collapse table-auto">
            <thead>
              <tr class="bg-header-table bg-gray-50 rounded-t-lg">
                <th class="sticky top-0 z-10 bg-gray-50 p-3 text-left font-medium text-xs text-gray-600 uppercase whitespace-nowrap border-b border-gray-200">ФИО туриста</th>
                <th class="sticky top-0 z-10 bg-gray-50 p-3 text-left font-medium text-xs text-gray-600 uppercase whitespace-nowrap border-b border-gray-200">Email</th>
                <th class="sticky top-0 z-10 bg-gray-50 p-3 text-left font-medium text-xs text-gray-600 uppercase whitespace-nowrap border-b border-gray-200">Телефон</th>
                <th class="sticky top-0 z-10 bg-gray-50 p-3 text-left font-medium text-xs text-gray-600 uppercase whitespace-nowrap border-b border-gray-200">Статус оплаты</th>
                <th style="width: 100px" class="sticky top-0 z-10 bg-gray-50 p-3 text-left font-medium text-xs text-gray-600 uppercase whitespace-nowrap border-b border-gray-200">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in touristsInfo" :key="index" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="p-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{{ item.lastname }} {{ item.firstname }} {{ item.patronymic }}</td>
                <td class="p-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{{ item.email || '-' }}</td>
                <td class="p-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{{ item.phone || '-' }}</td>
                <td class="p-4">
                  <span :class="`status-${item.payment_status} px-2 py-1 rounded text-xs font-medium`">
                    {{ item.payment_status }}
                  </span>
                </td>
                <td class="p-4 sticky right-0 bg-white z-20 shadow-l min-w-[100px]">
                  <div class="actions-container">
                    <div class="user-actions">
                      <div class="more-btn flex justify-center">
                        <img src="/svg/pencil.svg" alt="edit" @click="selectTourist(item)" class="cursor-pointer w-4 h-4 mx-auto" />
                        <!-- <img src="/svg/trash.svg" alt="delete" @click="handleDeleteTourist(item.id)" class="cursor-pointer w-4 h-4"> -->
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <UModal v-show="isShowModal" @close="closeModal">
      <template #headerTitle> Редактировать данные о туристе </template>

      <template #bodyContent>
        <section class="base-info flex flex-col gap-5">
          <div class="base-info__title text-sm font-medium text-gray-900">Персональные данные</div>
          
          <!-- Block 1: Name, Surname, Patronymic -->
          <div class="base-info__block flex flex-wrap gap-3">
            <div class="base-info__column flex flex-col flex-1 min-w-[200px]">
              <label for="name" class="text-xs text-gray-600 mb-1">Имя<span class="text-red-500">*</span></label>
              <UInput
                id="name"
                v-model="customerStore.currentTourist.firstname"
                :inputHeightPx="36"
                placeholder=""
              />
            </div>
            <div class="base-info__column flex flex-col flex-1 min-w-[200px]">
              <label for="secname" class="text-xs text-gray-600 mb-1">Фамилия<span class="text-red-500">*</span></label>
              <UInput
                id="secname"
                v-model="customerStore.currentTourist.lastname"
                :inputHeightPx="36"
                placeholder=""
              />
            </div>
            <div class="base-info__column flex flex-col flex-1 min-w-[200px]">
              <label for="surname" class="text-xs text-gray-600 mb-1">Отчество</label>
              <UInput
                id="surname"
                v-model="customerStore.currentTourist.patronymic"
                :inputHeightPx="36"
                placeholder=""
              />
            </div>
          </div>

          <!-- Block 2: Birth Date, Gender -->
          <div class="base-info__block flex flex-wrap gap-3">
            <div class="base-info__column flex flex-col flex-1 min-w-[200px]">
              <label class="text-xs text-gray-600 mb-1">Дата рождения</label>
              <UInput
                v-model="customerStore.currentTourist.passport_birth_date"
                :inputHeightPx="36"
                placeholder=""
              />
            </div>
            <div class="base-info__column flex flex-col flex-1 min-w-[200px]">
              <label class="text-xs text-gray-600 mb-1">Пол</label>
              <UDropdown
                :list="['Мужской', 'Женский']"
                v-model="customerStore.currentTourist.gender"
                :withSearch="false"
              />
            </div>
          </div>

          <!-- Block 3: Passport Series, Number, Issue Date -->
          <div class="base-info__block flex flex-wrap gap-3">
            <div class="base-info__column flex flex-col flex-1 min-w-[150px]">
              <label class="text-xs text-gray-600 mb-1">Серия документа</label>
              <UInput
                v-model="customerStore.currentTourist.passport_series"
                :inputHeightPx="36"
                placeholder=""
              />
            </div>
            <div class="base-info__column flex flex-col flex-1 min-w-[150px]">
              <label class="text-xs text-gray-600 mb-1">Номер документа</label>
              <UInput
                v-model="customerStore.currentTourist.passport_number"
                :inputHeightPx="36"
                placeholder=""
              />
            </div>
            <div class="base-info__column flex flex-col flex-1 min-w-[150px]">
              <label class="text-xs text-gray-600 mb-1">Дата выдачи документа</label>
              <UInput
                v-model="customerStore.currentTourist.passport_issue_date"
                :inputHeightPx="36"
                placeholder=""
              />
            </div>
          </div>

          <!-- Block 4: Unit Code, Unit Name -->
          <div class="base-info__block flex flex-wrap gap-3">
            <div class="base-info__column flex flex-col flex-1 min-w-[150px]">
              <label class="text-xs text-gray-600 mb-1">Код подразделения</label>
              <UInput
                v-model="customerStore.currentTourist.passport_unit_code"
                :inputHeightPx="36"
                placeholder=""
              />
            </div>
            <div class="base-info__column flex flex-col flex-1 min-w-[200px]">
              <label class="text-xs text-gray-600 mb-1">Кем выдан</label>
              <UInput
                v-model="customerStore.currentTourist.passport_unit_name"
                :inputHeightPx="36"
                placeholder=""
              />
            </div>
          </div>

          <!-- Address Registration -->
          <div class="base-info__column flex flex-col w-full">
            <label class="text-xs text-gray-600 mb-1">Адрес регистрации</label>
            <UInput
              v-model="customerStore.currentTourist.passport_address"
              :inputHeightPx="36"
              placeholder=""
            />
          </div>

          <!-- Block 5: Email, Phone -->
          <div class="base-info__block flex flex-wrap gap-3">
            <div class="base-info__column flex flex-col flex-1 min-w-[200px]">
              <label class="text-xs text-gray-600 mb-1">Email</label>
              <UInput
                v-model="customerStore.currentTourist.email"
                :inputHeightPx="36"
                placeholder=""
              />
            </div>
            <div class="base-info__column flex flex-col flex-1 min-w-[200px]">
              <label class="text-xs text-gray-600 mb-1">Телефон</label>
              <UInput
                v-model="customerStore.currentTourist.phone"
                :inputHeightPx="36"
                placeholder=""
              />
            </div>
          </div>

          <!-- Block 6: Payment Status -->
          <div class="base-info__block flex flex-wrap gap-3">
            <div class="base-info__column flex flex-col flex-1 min-w-[200px]">
              <label class="text-xs text-gray-600 mb-1">Статус оплаты</label>
              <UDropdown
                :list="['Оплачено', 'Не оплачено']"
                v-model="customerStore.currentTourist.payment_status"
                :withSearch="false"
              />
            </div>
          </div>
        </section>
      </template>

      <template #buttons>
        <div class="footer-buttons flex justify-between gap-3">
          <UButton
            text="Удалить туриста"
            size="big"
            variant="secondary"
            action="warning"
            @click="handleDeleteTourist(customerStore.currentTourist.id)"
            :disabled="!customerStore.currentTourist.id"
          />
          <UButton
            text="Сохранить"
            size="big"
            @click="handleSaveTourist(customerStore.currentTourist.id, customerStore.currentTourist)"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>