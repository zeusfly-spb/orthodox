<script setup>
import { defineProps, defineEmits, reactive, watch, ref, onMounted, computed } from 'vue';
import UInput from '@/components/ui/UInput.vue';
import UButton from '@/components/ui/UButton.vue';
import UDropdown from '@/components/ui/UDropdown.vue';
import UModal from '@/components/ui/UModal.vue';
import { useCustomerStore } from '@/stores/customer';
import { useBookingStore } from '@/stores/booking';
// import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover' 
// import { Button } from '@/components/ui/button'
// import { Calendar as CalendarIcon } from 'lucide-vue-next'
// import AppDatePicker from '@/components/app/AppDatePicker.vue'

const props = defineProps({
    touristCount: Number,
    maximumCountPlaces: Number,
    touristsInfo: Array
})
const emit = defineEmits(['accommodation-selected', 'update:selectedOption']);

const customer = useCustomerStore()
const booking = useBookingStore()

const isShowModal = ref(false)

const innerTouristCount = ref(props.touristCount || 1)
const availableRoomTypes = ref([
    { type: 'single', name: 'Одноместный', capacity: 1, available: 10 },
    { type: 'double', name: 'Двухместный', capacity: 2, available: 5 },
    { type: 'double_extra', name: 'Двухместный с доп. местом', capacity: 3, available: 3 }
])

// Добавляем состояние для выбранных типов номеров
const enabledRoomTypes = ref(['single', 'double', 'double_extra']) // По умолчанию все включены

const accommodationOptions = ref([])
const selectedOption = ref(null)
// const isCalendarOpened = ref(false)

// Вычисляемое свойство для отфильтрованных вариантов
const filteredAccommodationOptions = computed(() => {
    return accommodationOptions.value.filter(option => {
        // Проверяем, что вариант использует только включенные типы номеров
        return Object.keys(option).every(roomType => 
            option[roomType] === 0 || enabledRoomTypes.value.includes(roomType)
        )
    })
})

function closeModal() {
    isShowModal.value = false
}

function selectTourist(tourist) {
    customer.updateCustomer(tourist)
    isShowModal.value = true
}

function handleDeleteTourist(id) {
    customer.deleteTourist(id)
    closeModal()
    booking.fetchBookingData(booking.booking.id)
}
function handleSaveTourist(id, data) {
    customer.updateTourist(id, data)
    closeModal()
    booking.fetchBookingData(booking.booking.id)
}

function calculateOptions() {
    if (innerTouristCount.value < 1) {
        accommodationOptions.value = [];
        return;
    }
    accommodationOptions.value = findAccommodationOptions(
        innerTouristCount.value,
        availableRoomTypes.value.filter(room => enabledRoomTypes.value.includes(room.type))
    );
}

// Функции для работы с типами номеров
function isRoomTypeEnabled(roomType) {
    return enabledRoomTypes.value.includes(roomType);
}

function toggleRoomType(roomType, isEnabled) {
    if (isEnabled) {
        // Добавляем тип, если его нет в списке
        if (!enabledRoomTypes.value.includes(roomType)) {
            enabledRoomTypes.value.push(roomType);
        }
    } else {
        // Удаляем тип из списка
        enabledRoomTypes.value = enabledRoomTypes.value.filter(type => type !== roomType);
    }
    
    // Пересчитываем варианты при изменении фильтра
    calculateOptions();
}

// Остальные функции остаются без изменений
function findAccommodationOptions(people, roomTypes, currentCombination = {}, index = 0) {
    if (people === 0) {
        return [{ ...currentCombination }];
    }
    
    if (index >= roomTypes.length) {
        return [];
    }
    
    const results = [];
    const room = roomTypes[index];
    const maxRooms = Math.min(
        Math.floor(people / room.capacity),
        room.available
    );
    
    for (let count = 0; count <= maxRooms; count++) {
        const peopleCovered = count * room.capacity;
        
        if (peopleCovered <= people) {
            const newCombination = {
                ...currentCombination,
                [room.type]: count
            };
            
            const remainingResults = findAccommodationOptions(
                people - peopleCovered,
                roomTypes,
                newCombination,
                index + 1
            );
            
            results.push(...remainingResults);
        }
    }
    
    return results;
}

function getRoomName(roomType) {
    const room = availableRoomTypes.value.find(r => r.type === roomType);
    return room ? room.name : roomType;
}

function getTotalRooms(option) {
    return Object.values(option).reduce((total, count) => total + count, 0);
}

function calculateTotalPeople(option) {
    return Object.entries(option).reduce((total, [roomType, count]) => {
        const room = availableRoomTypes.value.find(r => r.type === roomType);
        return total + (count * (room?.capacity || 0));
    }, 0);
}

function selectOption(option) {
    selectedOption.value = option;
    console.log('Выбран вариант:', option);
}

function isOptionSelected(option) {
    return selectedOption.value === option;
}

function emitSelectedOption() {
    if (selectedOption.value) {
        // Отправляем выбранный вариант родителю
        emit('accommodation-selected', selectedOption.value);
        
        // Или если используете v-model:
        emit('update:selectedOption', selectedOption.value);
        
        console.log('Отправлено родителю:', selectedOption.value);
    } else {
        console.warn('Не выбран вариант размещения');
        // Можно показать сообщение пользователю
        alert('Пожалуйста, выберите вариант размещения');
    }
}

function getAccommodationString(option) {
    if (!option) return '';
    
    const parts = [];
    
    // Проходим по всем типам номеров в варианте
    Object.entries(option).forEach(([roomType, count]) => {
        if (count > 0) {
            const room = availableRoomTypes.value.find(r => r.type === roomType);
            if (room) {
                parts.push(`${room.name} ×${count}`);
            }
        }
    });
    
    // Добавляем общее количество туристов
    const totalPeople = calculateTotalPeople(option);
    if (parts.length > 0) {
        return `${parts.join(' + ')} / ${totalPeople} турист${getPeopleEnding(totalPeople)}`;
    }
    
    return '';
}

// Функция для правильного окончания слова "турист"
function getPeopleEnding(count) {
    if (count % 10 === 1 && count % 100 !== 11) return '';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'а';
    return 'ов';
}

watch(innerTouristCount, (newValue) => {
    if (newValue < 1) innerTouristCount.value = 1;
    calculateOptions();
    selectedOption.value = null;
});

watch(() => props.touristCount, (newValue) => {
    if (newValue !== undefined && newValue >= 1) {
        innerTouristCount.value = newValue;
    }
});

onMounted(() => {
    calculateOptions();
});
</script>
<template>
    <div class="section filters">
        <h2 class="section-title">Паломники / Туристы</h2>
        <div class="pilgrims-count-container">
            <label class="info-label">Количество туристов</label>
            <UInput 
                class="number-input back-none" 
                v-model="innerTouristCount" 
                inputType="number"
                :inputHeightPx="43"
                :min="1"
            />
        </div>
        <div class="pilgrims-info-container">
            <div class="room-types-section">
                <label class="info-label">Доступные типы номеров</label>
                <div 
                    class="room-types-options" 
                    v-for="(room, index) in availableRoomTypes" 
                    :key="room.type"
                >
                    <label class="room-type-option">
                        <input 
                            type="checkbox" 
                            :checked="isRoomTypeEnabled(room.type)"
                            @change="toggleRoomType(room.type, $event.target.checked)"
                        >
                        <span class="custom-checkbox"></span>
                        <span class="room-type-text">
                            <span class="bed-icons-inline">
                                <span 
                                    v-for="n in room.capacity" 
                                    :key="n"
                                    class="bed-icon"
                                >
                                    <img src="/svg/bedd.svg" alt="кровать">
                                </span>
                            </span>
                            {{ room.name }}
                        </span>
                    </label>
                </div>
            </div>
            <div class="placement-options-section">
                <div>
                    <label class="info-label">Варианты размещения</label>
                    <div class="placement-options">
                        <!-- Динамические варианты размещения с фильтрацией -->
                            <div class="placement-options">
                            <label 
                                class="placement-option"
                                v-for="(option, index) in filteredAccommodationOptions"
                                :key="index"
                            >
                                <input type="checkbox" :checked="isOptionSelected(option)" @change="selectOption(option)">
                                <div class="bed-groups-container">
                                    <!-- Группируем кровати по типам номеров с отступами -->
                                    <template v-for="roomType in availableRoomTypes" :key="roomType.type">
                                        <div 
                                            v-if="option[roomType.type] > 0"
                                            class="bed-group"
                                            :class="`group-${roomType.type}`"
                                        >
                                            <div 
                                                v-for="n in option[roomType.type]" 
                                                :key="n"
                                                class="bed-icon"
                                                :title="roomType.name"
                                            >
                                                <img src="/svg/bedd.svg" alt="кровать" class="bed-icon">
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <span class="placement-text">x{{ getTotalRooms(option) }}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="buttom-right">
                    <UButton 
                        text="Выбрать"
                        size="small"
                        @click="emitSelectedOption"
                    />
                    <!-- <UButton 
                        text="Выбрано"
                        size="small"
                        variant="secondary"
                    /> -->
                </div>
            </div>
        </div>
        <div class="tourists-data-section">
            <label class="info-label">Данные о туристах</label>
            <div class="table-wrapper2">
                <table class="users-table draggable-table">
                    <thead>
                        <tr class="bg-header-table">
                            <th data-column="pilgrims-count" draggable="true">ФИО туриста <span
                                    class="drag-handle">⋮⋮</span></th>
                            <th data-column="manager" draggable="true">Email <span
                                    class="drag-handle">⋮⋮</span></th>
                            <th data-column="places-limit" draggable="true">телефон<span
                                    class="drag-handle">⋮⋮</span></th>
                            <th data-column="group-status" draggable="true">статус оплаты <span
                                    class="drag-handle">⋮⋮</span></th>
                            <th style="width: 100px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- <tr class="bed-i-tabel">
                            <td colspan="5">
                            </td>
                        </tr> -->
                        <tr v-for="(item, index) in touristsInfo" :key="index">
                            <td data-column="pilgrims-count">{{ item.lastname }} {{ item.firstname[0] }}. {{ item.patronymic[0] }}.</td>
                            <td data-column="manager">{{ item.email }}</td>
                            <td data-column="places-limit">{{ item.phone }}</td>
                            <td data-column="request-status">
                                <!-- <div class="status-item">
                                    <span class="status-name">В работе</span>
                                </div> -->
                            </td>
                            <td style="width:100px;">
                                <div class="actions-container">
                                    <div class="user-actions">
                                        <div class="more-btn">
                                            <img src="/svg/pencil.svg" alt="edit" @click="selectTourist(item)">
                                            <img src="/svg/more-horiz.svg" alt="more info">
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
        <template #headerTitle>
            Редактировать данные о туристе
        </template>

        <template #bodyContent>
            <section class="base-info">
                <div class="base-info__title">Персональные данные</div>
                <div class="base-info__block">
                    <div class="base-info__column">
                        <label for="name">Имя<span>*</span></label>
                        <UInput id="name" v-model="customer.customer.firstname" :inputHeightPx="36" placeholder=""/>
                    </div>
                    <div class="base-info__column">
                        <label for="secname">Фамилия<span>*</span></label>
                        <UInput id="secname" v-model="customer.customer.lastname" :inputHeightPx="36" placeholder=""/>
                    </div>
                    <div class="base-info__column">
                        <label for="surname">Отчество</label>
                        <UInput id="surname" v-model="customer.customer.patronymic" :inputHeightPx="36" placeholder=""/>
                    </div>
                </div>
                <div class="base-info__block">
                    <div class="base-info__column">
                        <label>Дата рождения</label>
                        <UInput v-model="customer.customer.passport_birth_date" :inputHeightPx="36" placeholder=""/>
                        <!-- <div class="flex">
                            <Popover>
                                <PopoverTrigger as-child>
                                <Button variant="outline" class="w-full justify-start text-left font-normal flex gap-2" @click="isCalendarOpened = true">
                                    <CalendarIcon class="mr-2 h-4 w-4" />
                                    <span>{{ customer.customer.passport_birth_date || 'Выберите дату' }}</span>
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent class="w-auto p-0">
                                    <AppDatePicker v-if="isCalendarOpened" v-model="customer.customer.passport_birth_date" @addDate="isCalendarOpened = false"/>
                                </PopoverContent>
                            </Popover>
                        </div> -->
                    </div>
                    <div class="base-info__column">
                        <label for="name">Пол</label>
                        <UDropdown 
                            :list="['Мужской', 'Женский']" 
                            v-model="customer.customer.gender" 
                            :withSearch="false"
                        />
                    </div>
                </div>
                <div class="base-info__block">
                    <div class="base-info__column">
                        <label>Серия документа</label>
                        <UInput v-model="customer.customer.passport_series" :inputHeightPx="36" placeholder=""/>
                    </div>
                    <div class="base-info__column">
                        <label>Номер документа</label>
                        <UInput v-model="customer.customer.passport_number" :inputHeightPx="36" placeholder=""/>
                    </div>
                    <div class="base-info__column">
                        <label>Дата выдачи документа</label>
                        <UInput v-model="customer.customer.passport_issue_date" :inputHeightPx="36" placeholder=""/>
                    </div>
                </div>
                <div class="base-info__block">
                    <div class="base-info__column">
                        <label>Код подразделения</label>
                        <UInput v-model="customer.customer.passport_unit_code" :inputHeightPx="36" placeholder=""/>
                    </div>
                    <div class="base-info__block">
                        <div class="base-info__column">
                            <label>Кем выдан</label>
                            <UInput v-model="customer.customer.passport_unit_name" :inputHeightPx="36" placeholder=""/>
                        </div>
                    </div>
                </div>
                <div class="base-info__column">
                    <label>Адрес регистрации</label>
                    <UInput v-model="customer.customer.passport_address" :inputHeightPx="36" placeholder=""/>
                </div>
                <div class="base-info__block">
                    <div class="base-info__column">
                        <label>Email</label>
                        <UInput v-model="customer.customer.email" :inputHeightPx="36" placeholder=""/>
                    </div>
                    <div class="base-info__column">
                        <label>Телефон</label>
                        <UInput v-model="customer.customer.phone" :inputHeightPx="36" placeholder=""/>
                    </div>
                </div>
                <div class="base-info__block">
                    <div class="base-info__column">
                        <label>Статус оплаты</label>
                        <UDropdown 
                            :list="['Оплачено', 'Не оплачено']" 
                            v-model="customer.customer.payment_status" 
                            :withSearch="false"
                        />
                    </div>
                    <!-- <label>Теги туриста</label> -->
                    <!-- <UInput v-model="modalFields.name" :inputHeightPx="26" placeholder=""/> -->
                </div>
            </section>
        </template>
        
        <template #buttons>
            <div class="footer-buttons">
                <UButton text="Удалить туриста" size="big" variant="secondary" action="warning" @click="handleDeleteTourist(customer.customer.id)"/>
                <UButton text="Сохранить" size="big" @click="handleSaveTourist(customer.customer.id, customer.customer)"/>
            </div>
        </template>
    </UModal>
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
}
.filters {
    background: #fff;
    padding: 20px;
    border-radius: 24px;
    margin-bottom: 30px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.info-label {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 4px;
    display: block;
}
.pilgrims-count-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-width: 120px;
}
.pilgrims-count-container .info-label {
    margin-bottom: 0;
    white-space: nowrap;
}

.pilgrims-count-container .number-input {
    width: 40px;
    text-align: center;
    padding: 0;
    -moz-appearance: textfield;
    margin: 0 4px;
}
.pilgrims-count-container .number-input::-webkit-inner-spin-button,
.pilgrims-count-container .number-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.number-input {
    width: 100%;
    padding: 10px 36px 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    -moz-appearance: textfield;
}
.number-input::-webkit-inner-spin-button,
.number-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.pilgrims-info-container {
    background: #f9f9fa;
    border-radius: 12px;
    padding: 16px;
    margin-top: 20px;
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
    align-items: center; 
}
.placement-options-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.room-types-section {
    justify-self: center;
}
.placement-options-section,
.room-types-section {
    margin: 16px 0;
}
.placement-options,
.room-types-options {
    margin-top: 8px;
}
.back-none {
    background: 0 0 !important;
    border: none !important;
}
.placement-option,
.room-type-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}
.custom-checkbox {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    position: relative;
}
input[type="checkbox"] {
    position: absolute;
    opacity: 0;
}
input[type="checkbox"]:checked + .custom-checkbox {
    background-color: rgba(16, 185, 129, 1);
    border-color: rgba(16, 185, 129, 1);
}
input[type="checkbox"]:checked + .custom-checkbox:after {
    content: "";
    position: absolute;
    left: 5px;
    top: 2px;
    width: 4px;
    height: 8px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}
.room-type-text {
    display: flex;
    gap: 12px;
}
.buttom-right {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.table-wrapper2 {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 20px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.draggable-table {
    width: 100%;
    min-width: 1800px;
    border-collapse: collapse;
    table-layout: fixed;
}
.draggable-table th {
    position: sticky;
    top: 0;
    background: #f9f9fa;
    padding: 12px 15px;
    text-align: left;
    font-weight: 500;
    font-size: 12px;
    color: #6a6e75;
    text-transform: uppercase;
    white-space: nowrap;
    border-bottom: 1px solid #e2e8f0;
    z-index: 10;
}
.draggable-table td {
    padding: 12px 15px;
    font-size: 14px;
    color: #353535;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
    white-space: nowrap;
}
.table-wrapper2::-webkit-scrollbar {
    height: 8px;
    background-color: #f5f5f5;
}
.table-wrapper2::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 4px;
}
.table-wrapper2::-webkit-scrollbar-thumb:hover {
    background-color: #a8a8a8;
}
.draggable-table td:last-child,
.draggable-table th:last-child {
    position: sticky;
    right: 0;
    background: #fff;
    z-index: 20;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.05);
}
@media (max-width: 768px) {
    .table-wrapper2 {
        border-radius: 0;
    }
    .draggable-table td,
    .draggable-table th {
        padding: 10px 12px;
        font-size: 13px;
    }
}
.draggable-table {
    min-width: auto !important;
    width: 100%;
    table-layout: auto;
}
.draggable-table td,
.draggable-table th {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    padding: 8px 12px !important;
}
.draggable-table td:last-child,
.draggable-table th:last-child {
    position: sticky;
    right: 0;
    background: #fff;
    z-index: 10;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.05);
    min-width: 100px;
}
.table-wrapper2 {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 20px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    width: 100%;
}
.draggable-table td {
    font-size: 13px;
}
.draggable-table th {
    font-size: 11px;
}
@media (max-width: 768px) {
    .draggable-table td,
    .draggable-table th {
        padding: 6px 8px !important;
        font-size: 12px;
    }
    .draggable-table td:last-child,
    .draggable-table th:last-child {
        min-width: 80px;
    }
}
.table-wrapper2::-webkit-scrollbar {
    height: 6px;
}
.table-wrapper2::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}
.draggable-table thead th {
    position: sticky;
    top: 0;
    z-index: 0;
    background: #f9f9fa;
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
.bg-header-table {
    background: rgba(249, 249, 250, 1);
    -webkit-border-top-left-radius: 14px;
    -webkit-border-top-right-radius: 14px;
    -moz-border-radius-topleft: 14px;
    -moz-border-radius-topright: 14px;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
}
.bg-header-table th {
    background: rgba(249, 249, 250, 1);
}
.bed-icon {
    margin-top: 3px;
}
.bed-icons-inline {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 2px;
    margin: 0 2px;
}

.bed-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.bed-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* Стили для вариантов размещения */
.placement-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.placement-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 70px;
    background: white;
}

.placement-option:hover {
    border-color: #007bff;
    background-color: #f8f9fa;
}

.placement-option input[type="checkbox"] {
    margin-bottom: 5px;
}

.placement-text {
    font-size: 11px;
    color: #666;
    margin-top: 4px;
    text-align: center;
}

/* Стили для доступных номеров */
.room-type-text {
    display: flex;
    align-items: center;
    gap: 6px;
}

.room-types-options .bed-icons-inline {
    gap: 1px;
}

.room-types-options .bed-icon {
    width: 14px;
    height: 14px;
}

.room-type-option input[type="checkbox"] {
    margin-right: 8px;
}
.bed-icons-inline {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 2px;
}

.bed-icon {
    width: 16px;
    height: 16px;
}

.placement-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.placement-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
}

.bed-groups-container {
    display: flex;
    gap: 8px; /* Отступ между группами разных типов номеров */
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 80px;
}

.bed-group {
    display: flex;
    gap: 1px; /* Маленький отступ между кроватями внутри одной группы */
    align-items: center;
}

/* Специфичные отступы для разных типов номеров */
.bed-group.group-single {
    margin-right: 6px;
}

.bed-group.group-double {
    margin: 0 4px;
}

.bed-group.group-double_extra {
    margin-left: 6px;
}

.bed-with-tooltip {
    position: relative;
    display: inline-flex;
}

.bed-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.placement-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 70px;
}

.placement-option:hover {
    border-color: #007bff;
    background-color: #f8f9fa;
}

.placement-text {
    font-size: 11px;
    color: #666;
    margin-top: 4px;
    text-align: center;
}
.more-btn {
    display: flex;
    justify-content: space-evenly;

    & img {
        cursor: pointer;
    }
}
.base-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
    &__block {
        display: flex;
        gap: 12px;
    }
    &__column {
        display: flex;
        flex-direction: column;

        & label {
            font-size: 12px;
            color: #6A6E75;
        }
    }
}

.footer-buttons {
    display: flex;
    justify-content: space-between;
}
</style>