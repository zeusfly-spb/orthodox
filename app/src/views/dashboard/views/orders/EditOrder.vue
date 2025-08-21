<script setup>

import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { tourApi } from '@/api/tours';
import { bookingApi } from '@/api/bookings'
import UInput from '@/components/ui/UInput.vue'
import UDropdown from '@/components/ui/UDropdown.vue'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover' 
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import AppDatePicker from '@/components/app/AppDatePicker.vue'
import { parseISO, min, max, format } from 'date-fns';
import ContactPerson from './ContactPerson.vue';
import Client from './Client.vue';
import PiligrimTourists from './PiligrimTourists.vue';
import ModalTag from './ModalTag.vue';
import FilesTable from '../../FilesTable.vue';
import MainInfo from './MainInfo.vue';

const route = useRoute();
const orderId = route.params.id
const toursTitlesArr = ref([])
const isCalendarOpened = reactive({
    startDate: false,
    finishDate: false
})
const hasErrorAlert = ref(false)
const formFields = reactive({
    title: '',
    tourId: '',
    manager: '',
    counts: {
        nights: '',
        freePlaces: '',
        people: ''
    },
    dates: {
        start: '',
        finish: ''
    },
    guaranteeType: ''
})
const contacts = ref([])
const formCount = ref(1)
const mainInfo = reactive({
    touristsInfo: '',
    tourPrice: '',
    date: '',
    time: ''
})
function handleAddItem(newItem) {
    contacts.value.push(newItem)
    formCount.value++
}
function matchFromQuery(key, value) {
  const keys = key.split('.');
  let current = formFields;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {}; 
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value || 0;
}

onMounted(async () => {
    try {
        const [allToursData, bookingsResponse] = await Promise.all([
          (await tourApi.fetchData())?.data,
          (await bookingApi.getData(orderId))?.data
        ]);

        const {customers, status } = bookingsResponse
        const {title, id, night_count, seats, dates, date, price, time} = bookingsResponse.tour

        // присвоение полученных данных в formFields
        const match = {'title': title, 'tourId': id, 'counts.nights': night_count, 'counts.people': customers.length, 'counts.freePlaces': seats - customers.length, 'guaranteeType': status, 'dates.start': format(min(dates.map(val => parseISO(val.date_start))), 'yyyy-MM-dd'), 'dates.finish': format(max(dates.map(val => parseISO(val.date_end))), 'yyyy-MM-dd')}

        for(const key in match) {
            matchFromQuery(key, match[key])
        }

        toursTitlesArr.value = allToursData.map(val => val.title)

        mainInfo.touristsInfo = customers
        mainInfo.tourPrice = price
        mainInfo.date = date
        mainInfo.time = time
    }
    catch(error) {
        console.error(error)
    }
})
</script>

<template>
    <div class="main-content">
        <div class="content">
            <div class="title-bread-com">Мои заявки / Редактирование заявки #{{ orderId }}</div>
            <div class="grid-tours-fd">
                <div>
                    <div class="section filters">
                        <h2 class="section-title">Общая информация</h2>
                        <label class="info-label">Название паломнического тура</label>
                        <UDropdown :list="toursTitlesArr" v-model="formFields.title" :withSearch="true"/>
                        <div class="info-grid">
                            <div class="info-item">
                                <label class="info-label">Номер тура</label>
                                <div class="input-field">{{ formFields.tourId }}</div>
                            </div>
                            <div class="info-item">
                                <label class="info-label">Номер заявки</label>
                                <div class="input-field">{{ orderId }}</div>
                            </div>
                            <div class="info-item">
                                <label class="info-label">Менеджер</label>
                                <div class="input-field">Иванов А. А.</div>
                            </div>
                        </div>

                        <div class="info-grid">
                            <div class="info-item">
                                <label class="info-label">Кол-во ночей</label>
                                <UInput 
                                    inputType="number" 
                                    v-model="formFields.counts.night_count" 
                                    :allowNegative="false" 
                                    :inputHeightPx="43"
                                />
                            </div>
                            <div class="info-item">
                                <label class="info-label">Кол-во свободных мест</label>
                                <UInput 
                                    inputType="number" 
                                    v-model="formFields.counts.freePlaces" 
                                    :allowNegative="false" 
                                    :inputHeightPx="43"
                                />
                            </div>
                            <div class="info-item">
                                <label class="info-label">Кол-во человек</label>
                                <UInput 
                                    inputType="number" 
                                    v-model="formFields.counts.people" 
                                    :allowNegative="false" 
                                    :inputHeightPx="43"
                                />
                            </div>
                        </div>

                        <div class="info-grid">
                            <div class="info-item">
                                <label class="info-label">Дата начала тура</label>
                                <div class="flex">
                                    <Popover>
                                        <PopoverTrigger as-child>
                                        <Button variant="outline" class="w-full justify-start text-left font-normal flex gap-2" @click="isCalendarOpened.startDate = true">
                                            <CalendarIcon class="mr-2 h-4 w-4" />
                                            <span>{{ formFields.dates.start || 'Выберите дату' }}</span>
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent class="w-auto p-0">
                                            <AppDatePicker v-if="isCalendarOpened.startDate" v-model="formFields.dates.start" @addDate="isCalendarOpened.startDate = false"/>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div class="info-item">
                                <label class="info-label">Дата окончания тура</label>
                                <div class="flex">
                                    <Popover>
                                        <PopoverTrigger as-child>
                                        <Button variant="outline" class="w-full justify-start text-left font-normal flex gap-2" @click="isCalendarOpened.finish = true">
                                            <CalendarIcon class="mr-2 h-4 w-4" />
                                            <span>{{ formFields.dates.finish || 'Выберите дату' }}</span>
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent class="w-auto p-0">
                                            <AppDatePicker v-if="isCalendarOpened.finish" v-model="formFields.dates.finish" @addDate="isCalendarOpened.finish = false"/>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div class="info-item">
                                <label class="info-label">Статус</label>
                                <UDropdown 
                                    :list="['Полная', 'Частичная', 'Без гарантии', 'Гарантийный депозит']" 
                                    v-model="formFields.guaranteeType" 
                                    :withSearch="false"
                                />
                            </div>
                        </div>
                    </div>
                    <ContactPerson 
                        v-for="(item, index) in formCount" 
                        :key="index"
                        :showAddButton="index + 1 === formCount"
                        :countContacts="index + 1" 
                        @add-item="handleAddItem" 
                    />

                    <Client />
                    <PiligrimTourists :touristCount="formFields.counts.people" :maximumCountPlaces="formFields.counts.freePlaces" :touristsInfo="mainInfo.touristsInfo"/>

                    <div class="section filters">
                        <h2 class="section-title">Документы</h2>
                        <div>
                            <div class="table-wrapper2">
                                <FilesTable />
                            </div>
                        </div>
                    </div>
                </div>
                <MainInfo  
                    :name="formFields.title"
                    :price="mainInfo.tourPrice"
                    :touristCount="formFields.counts.people"
                    :nightsCount="formFields.counts.nights"
                    :date="mainInfo.date"
                    :time="mainInfo.time"
                />
            </div>
        </div>
        <!-- Модальное окно для добавления тегов -->
        <ModalTag v-if="false" />
    </div>
        <!-- <Alert variant="destructive" v-show="hasErrorAlert" class="fixed top-4 right-4 w-[350px] p-2 z-50 shadow-lg">
            <AlertTitle>Ошибка!</AlertTitle>
            <AlertDescription>
                {{ profile.error }}
            </AlertDescription>
        </Alert> -->
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

td, th {
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

input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    
    &:checked + .checkbox {
        background-color: rgba(16, 185, 129, 1);
        border-color: rgba(16, 185, 129, 1);
        
        &::after {
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