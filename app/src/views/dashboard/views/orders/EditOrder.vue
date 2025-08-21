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

        const {customers, status} = bookingsResponse
        const {title, id, night_count, seats, dates} = bookingsResponse.tour

        // присвоение полученных данных в formFields
        const match = {'title': title, 'tourId': id, 'counts.nights': night_count, 'counts.people': customers.length, 'counts.freePlaces': seats - customers.length, 'guaranteeType': status, 'dates.start': format(min(dates.map(val => parseISO(val.date_start))), 'yyyy-MM-dd'), 'dates.finish': format(max(dates.map(val => parseISO(val.date_end))), 'yyyy-MM-dd')}

        for(const key in match) {
            matchFromQuery(key, match[key])
        }

        toursTitlesArr.value = allToursData.map(val => val.title)
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
                    <PiligrimTourists :touristCount="formFields.counts.people" :maximumCountPlaces="formFields.counts.freePlaces" />

                    <div class="section filters">
                        <h2 class="section-title">Документы</h2>
                        <div>
                            <div class="table-wrapper2">
                                <table class="users-table">
                                    <thead>
                                        <tr>
                                            <th>Наименование документа</th>
                                            <th>Пользователи, имеющие доступ</th>
                                            <th>Дата загрузки</th>
                                            <th style="width: 100px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div class="name-dog">

                                                    <div><img src="/svg/dog.svg"></div>
                                                    <div>
                                                        <div class="name-dogov-tab"> Договор на оказание туристических
                                                            услуг</div>
                                                        <div class="avtor-dog-tab">Автор: Олег Киселев </div>
                                                    </div>
                                                </div>

                                            </td>


                                            <td>
                                                <div class="stacked-avatars2">
                                                    <div class="avatar3">MK</div>
                                                    <div class="avatar3">OB</div>
                                                    <div class="avatar3">MM</div>
                                                    <span class="plus-count">+4</span>
                                                </div>

                                            </td>
                                            <td>
                                                <div class="date-rekz">2024-03-07 </div>
                                            </td>
                                            <td>
                                                <div class="actions-container">
                                                    <div class="user-actions">

                                                        <button class="edit-btn">
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M1.5 12.375V15H4.125L12.91 6.215L10.285 3.59L1.5 12.375ZM14.5325 4.2175C14.825 3.925 14.825 3.45 14.5325 3.1575L12.3425 0.9675C12.05 0.675 11.575 0.675 11.2825 0.9675L9.6475 2.6025L12.2725 5.2275L14.5325 4.2175Z"
                                                                    fill="#6A6E75"></path>
                                                            </svg>
                                                        </button>
                                                        <button class="more-btn">
                                                            <svg width="4" height="16" viewBox="0 0 4 16" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z"
                                                                    fill="#6A6E75"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="name-dog">

                                                    <div><img src="/svg/dog.svg"></div>
                                                    <div>
                                                        <div class="name-dogov-tab"> Договор на оказание туристических
                                                            услуг</div>
                                                        <div class="avtor-dog-tab">Автор: Олег Киселев </div>
                                                    </div>
                                                </div>

                                            </td>


                                            <td>
                                                <div class="stacked-avatars2">
                                                    <div class="avatar3">MK</div>
                                                    <div class="avatar3">OB</div>
                                                    <div class="avatar3">MM</div>
                                                    <span class="plus-count">+4</span>
                                                </div>

                                            </td>
                                            <td>
                                                <div class="date-rekz">2024-03-07 </div>
                                            </td>
                                            <td>
                                                <div class="actions-container">
                                                    <div class="user-actions">

                                                        <button class="edit-btn">
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M1.5 12.375V15H4.125L12.91 6.215L10.285 3.59L1.5 12.375ZM14.5325 4.2175C14.825 3.925 14.825 3.45 14.5325 3.1575L12.3425 0.9675C12.05 0.675 11.575 0.675 11.2825 0.9675L9.6475 2.6025L12.2725 5.2275L14.5325 4.2175Z"
                                                                    fill="#6A6E75"></path>
                                                            </svg>
                                                        </button>
                                                        <button class="more-btn">
                                                            <svg width="4" height="16" viewBox="0 0 4 16" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z"
                                                                    fill="#6A6E75"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="name-dog">

                                                    <div><img src="/svg/dog.svg"></div>
                                                    <div>
                                                        <div class="name-dogov-tab"> Договор на оказание туристических
                                                            услуг</div>
                                                        <div class="avtor-dog-tab">Автор: Олег Киселев </div>
                                                    </div>
                                                </div>

                                            </td>


                                            <td>
                                                <div class="stacked-avatars2">
                                                    <div class="avatar3">MK</div>
                                                    <div class="avatar3">OB</div>
                                                    <div class="avatar3">MM</div>
                                                    <span class="plus-count">+4</span>
                                                </div>

                                            </td>
                                            <td>
                                                <div class="date-rekz">2024-03-07 </div>
                                            </td>
                                            <td>
                                                <div class="actions-container">
                                                    <div class="user-actions">

                                                        <button class="edit-btn">
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M1.5 12.375V15H4.125L12.91 6.215L10.285 3.59L1.5 12.375ZM14.5325 4.2175C14.825 3.925 14.825 3.45 14.5325 3.1575L12.3425 0.9675C12.05 0.675 11.575 0.675 11.2825 0.9675L9.6475 2.6025L12.2725 5.2275L14.5325 4.2175Z"
                                                                    fill="#6A6E75"></path>
                                                            </svg>
                                                        </button>
                                                        <button class="more-btn">
                                                            <svg width="4" height="16" viewBox="0 0 4 16" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z"
                                                                    fill="#6A6E75"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="name-dog">

                                                    <div><img src="/svg/dog.svg"></div>
                                                    <div>
                                                        <div class="name-dogov-tab"> Договор на оказание туристических
                                                            услуг</div>
                                                        <div class="avtor-dog-tab">Автор: Олег Киселев </div>
                                                    </div>
                                                </div>

                                            </td>


                                            <td>
                                                <div class="stacked-avatars2">
                                                    <div class="avatar3">MK</div>
                                                    <div class="avatar3">OB</div>
                                                    <div class="avatar3">MM</div>
                                                    <span class="plus-count">+4</span>
                                                </div>

                                            </td>
                                            <td>
                                                <div class="date-rekz">2024-03-07 </div>
                                            </td>
                                            <td>
                                                <div class="actions-container">
                                                    <div class="user-actions">

                                                        <button class="edit-btn">
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M1.5 12.375V15H4.125L12.91 6.215L10.285 3.59L1.5 12.375ZM14.5325 4.2175C14.825 3.925 14.825 3.45 14.5325 3.1575L12.3425 0.9675C12.05 0.675 11.575 0.675 11.2825 0.9675L9.6475 2.6025L12.2725 5.2275L14.5325 4.2175Z"
                                                                    fill="#6A6E75"></path>
                                                            </svg>
                                                        </button>
                                                        <button class="more-btn">
                                                            <svg width="4" height="16" viewBox="0 0 4 16" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z"
                                                                    fill="#6A6E75"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="name-dog">

                                                    <div><img src="/svg/dog.svg"></div>
                                                    <div>
                                                        <div class="name-dogov-tab"> Договор на оказание туристических
                                                            услуг</div>
                                                        <div class="avtor-dog-tab">Автор: Олег Киселев </div>
                                                    </div>
                                                </div>

                                            </td>


                                            <td>
                                                <div class="stacked-avatars2">
                                                    <div class="avatar3">MK</div>
                                                    <div class="avatar3">OB</div>
                                                    <div class="avatar3">MM</div>
                                                    <span class="plus-count">+4</span>
                                                </div>

                                            </td>
                                            <td>
                                                <div class="date-rekz">2024-03-07 </div>
                                            </td>
                                            <td>
                                                <div class="actions-container">
                                                    <div class="user-actions">

                                                        <button class="edit-btn">
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M1.5 12.375V15H4.125L12.91 6.215L10.285 3.59L1.5 12.375ZM14.5325 4.2175C14.825 3.925 14.825 3.45 14.5325 3.1575L12.3425 0.9675C12.05 0.675 11.575 0.675 11.2825 0.9675L9.6475 2.6025L12.2725 5.2275L14.5325 4.2175Z"
                                                                    fill="#6A6E75"></path>
                                                            </svg>
                                                        </button>
                                                        <button class="more-btn">
                                                            <svg width="4" height="16" viewBox="0 0 4 16" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z"
                                                                    fill="#6A6E75"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="name-dog">

                                                    <div><img src="/svg/dog.svg"></div>
                                                    <div>
                                                        <div class="name-dogov-tab"> Договор на оказание туристических
                                                            услуг</div>
                                                        <div class="avtor-dog-tab">Автор: Олег Киселев </div>
                                                    </div>
                                                </div>

                                            </td>


                                            <td>
                                                <div class="stacked-avatars2">
                                                    <div class="avatar3">MK</div>
                                                    <div class="avatar3">OB</div>
                                                    <div class="avatar3">MM</div>
                                                    <span class="plus-count">+4</span>
                                                </div>

                                            </td>
                                            <td>
                                                <div class="date-rekz">2024-03-07 </div>
                                            </td>
                                            <td>
                                                <div class="actions-container">
                                                    <div class="user-actions">

                                                        <button class="edit-btn">
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M1.5 12.375V15H4.125L12.91 6.215L10.285 3.59L1.5 12.375ZM14.5325 4.2175C14.825 3.925 14.825 3.45 14.5325 3.1575L12.3425 0.9675C12.05 0.675 11.575 0.675 11.2825 0.9675L9.6475 2.6025L12.2725 5.2275L14.5325 4.2175Z"
                                                                    fill="#6A6E75"></path>
                                                            </svg>
                                                        </button>
                                                        <button class="more-btn">
                                                            <svg width="4" height="16" viewBox="0 0 4 16" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z"
                                                                    fill="#6A6E75"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="filters">
                        <h2 class="section-title">Детали заказа</h2>

                        <div class="order-item">
                            <div class="header-sec-right-col">
                                <div><img src="/img/mini-sob.png"></div>
                                <div>
                                    <div class="order-title3">Паломничество по Святым Местам</div>
                                    <div class="order-meta">2024-03-04 16:00 МСК / 8 ночей</div>
                                    <div class="order-price-3">от 25 400 ₽</div>
                                </div>

                            </div>
                            <div class="tourist-item2">
                                <div class="tourist-name2">Турист 1</div>
                                <div class="tourist-price2">25 400 ₽</div>
                            </div>

                            <div class="tourist-item2">
                                <div class="tourist-name2">Турист 2</div>
                                <div class="tourist-price2">25 400 ₽</div>
                            </div>

                            <div class="total-price2">
                                <div>Общая стоимость:</div>
                                <div class="tot-pr">52 120 ₽</div>
                            </div>

                            <hr>

                            <div class="payment-options2">
                                <label class="payment-option">
                                    <input type="checkbox">
                                    <span class="checkbox"></span>
                                    <span>Полная оплата</span>
                                </label>
                                <label class="payment-option">
                                    <input type="checkbox" checked>
                                    <span class="checkbox"></span>
                                    <span>Частичная оплата</span>
                                </label>
                            </div>

                            <div class="partial-payment-section">
                                <label class="info-label">Сумма частичной оплаты</label>
                                <input type="text" class="amount-input" value="25 400 ₽">

                                <label class="info-label">Дата полной оплаты</label>
                                <div class="date-input-wrapper">
                                    <input type="text" class="date-range-input" id="endDateInput" value="2024-03-12">
                                    <div class="calendar-icon">
                                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M5.6668 0.966797C6.0534 0.966797 6.3668 1.2802 6.3668 1.6668V4.1668C6.3668 4.5534 6.0534 4.8668 5.6668 4.8668C5.2802 4.8668 4.9668 4.5534 4.9668 4.1668V1.6668C4.9668 1.2802 5.2802 0.966797 5.6668 0.966797Z"
                                                fill="%2364748B"></path>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M12.3328 0.966797C12.7194 0.966797 13.0328 1.2802 13.0328 1.6668V4.1668C13.0328 4.5534 12.7194 4.8668 12.3328 4.8668C11.9462 4.8668 11.6328 4.5534 11.6328 4.1668V1.6668C11.6328 1.2802 11.9462 0.966797 12.3328 0.966797Z"
                                                fill="%2364748B"></path>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M1.2168 7.575C1.2168 7.1884 1.5302 6.875 1.9168 6.875H16.0835C16.4701 6.875 16.7835 7.1884 16.7835 7.575C16.7835 7.9616 16.4701 8.275 16.0835 8.275H1.9168C1.5302 8.275 1.2168 7.9616 1.2168 7.575Z"
                                                fill="%2364748B"></path>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M3.00234 4.53895C2.48558 5.09546 2.1998 5.94077 2.1998 7.08346V14.1668C2.1998 15.3095 2.48558 16.1548 3.00234 16.7113C3.51039 17.2584 4.34156 17.6335 5.66647 17.6335H12.3331C13.6581 17.6335 14.4892 17.2584 14.9973 16.7113C15.514 16.1548 15.7998 15.3095 15.7998 14.1668V7.08346C15.7998 5.94077 15.514 5.09546 14.9973 4.53895C14.4892 3.99182 13.6581 3.6168 12.3331 3.6168H5.66647C4.34156 3.6168 3.51039 3.99182 3.00234 4.53895ZM1.97643 3.58631C2.82256 2.6751 4.07472 2.2168 5.66647 2.2168H12.3331C13.9249 2.2168 15.1771 2.6751 16.0232 3.58631C16.8606 4.48813 17.1998 5.72616 17.1998 7.08346V14.1668C17.1998 15.5241 16.8606 16.7621 16.0232 17.6639C15.1771 18.5752 13.9249 19.0335 12.3331 19.0335H5.66647C4.07472 19.0335 2.82256 18.5752 1.97643 17.6639C1.13903 16.7621 0.799805 15.5241 0.799805 14.1668V7.08346C0.799805 5.72616 1.13903 4.48813 1.97643 3.58631Z"
                                                fill="%2364748B"></path>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M9.12891 11.4168C9.12891 11.0302 9.44231 10.7168 9.82891 10.7168H9.83639C10.223 10.7168 10.5364 11.0302 10.5364 11.4168C10.5364 11.8034 10.223 12.1168 9.83639 12.1168H9.82891C9.44231 12.1168 9.12891 11.8034 9.12891 11.4168Z"
                                                fill="%2364748B"></path>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M5.21094 11.4168C5.21094 11.0302 5.52434 10.7168 5.91094 10.7168H5.91842C6.30502 10.7168 6.61842 11.0302 6.61842 11.4168C6.61842 11.8034 6.30502 12.1168 5.91842 12.1168H5.91094C5.52434 12.1168 5.21094 11.8034 5.21094 11.4168Z"
                                                fill="%2364748B"></path>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M5.21094 14.7498C5.21094 14.3632 5.52434 14.0498 5.91094 14.0498H5.91842C6.30502 14.0498 6.61842 14.3632 6.61842 14.7498C6.61842 15.1364 6.30502 15.4498 5.91842 15.4498H5.91094C5.52434 15.4498 5.21094 15.1364 5.21094 14.7498Z"
                                                fill="%2364748B"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="action-buttons3">
                            <button class="btn btn-outline t-center">В архив</button>
                            <button class="btn btn-primary t-center">Сохранить</button>
                        </div>
                    </div>
                </div>
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