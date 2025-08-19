<script setup>

import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { tourApi } from '@/api/tours';
import { getBookingByFilter } from '@/api/bookings'
import UInput from '@/components/ui/UInput.vue'
import UDropdown from '@/components/ui/UDropdown.vue'

const route = useRoute();
const orderId = route.params.id
const infoAboutAllTours = reactive({
    tours: [],
    toursTitlesArr: []
})

const hasErrorAlert = ref(false)
const bookings = ref('')
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
        const [currentTourResponse, allToursData, /*bookingsResponse*/] = await Promise.all([
          (await tourApi.getData(orderId))?.data,
          (await tourApi.fetchData())?.data,
        //   (await getBookingByFilter(orderId))?.data
        ]);
        const {title, id, night_count, seats, bookings} = currentTourResponse
        const match = {'title': title, 'tourId': id, 'counts.nights': night_count, 'counts.people': seats, 'counts.freePlaces': seats - bookings.length}
        // formFields.numbers.tour

        for(const key in match) {
            matchFromQuery(key, match[key])
        }

        infoAboutAllTours.toursTitlesArr = allToursData.map(item => item.title);
        console.log(currentTourResponse)
    }
    catch(error) {
        console.error(error)
    }
})
</script>

<template>
    <div class="main-content">
        <div class="content">
            <div class="title-bread-com">Мои заявки / Редактирование & создание заявки #189</div>
            <div class="grid-tours-fd">
                <div>
                    <div class="section filters">
                        <h2 class="section-title">Общая информация</h2>
                        <label class="info-label">Название паломнического тура</label>
                        <div class="filter-item mar-bb30">
                            <div class="custom-select">
                                 <UDropdown :list="infoAboutAllTours.toursTitlesArr" v-model="formFields.title" :withSearch="true"/>
                            </div>
                        </div>

                        <div class="info-grid">
                            <div class="info-item">
                                <label class="info-label">Номер тура</label>
                                <div type="text" class="input-field">{{ formFields.tourId }}</div>
                            </div>
                            <div class="info-item">
                                <label class="info-label">Номер заявки</label>
                                <div type="text" class="input-field">{{ orderId }}</div>
                            </div>
                            <div class="info-item">
                                <label class="info-label">Менеджер</label>
                                <input type="text" class="input-field" value="Иванов А. А.">
                            </div>
                        </div>

                        <div class="info-grid">
                            <div class="info-item">
                                <label class="info-label">Кол-во ночей</label>
                                <div class="number-input-container">
                                    <div type="number" class="number-input">{{ formFields.counts.nights }}</div>
                                    <div class="number-controls">
                                        <button class="number-up" @click="formFields.counts.nights++">+</button>
                                        <button class="number-down" @click="formFields.counts.nights--">-</button>
                                    </div>
                                </div>
                            </div>
                            <div class="info-item">
                                <label class="info-label">Кол-во свободных мест</label>
                                <div class="number-input-container">
                                    <input type="number" class="number-input" :value="formFields.counts.freePlaces">
                                    <div class="number-controls">
                                        <button class="number-up" @click="formFields.counts.freePlaces++">+</button>
                                        <button class="number-down" @click="formFields.counts.freePlaces--">-</button>
                                    </div>
                                </div>
                            </div>
                            <div class="info-item">
                                <label class="info-label">Кол-во человек</label>
                                <div class="number-input-container">
                                    <input type="number" class="number-input" :value="formFields.counts.people">
                                    <div class="number-controls">
                                        <button class="number-up" @click="formFields.counts.people++">+</button>
                                        <button class="number-down" @click="formFields.counts.people--">-</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="info-grid">
                            <div class="info-item">
                                <label class="info-label">Дата начала тура</label>
                                <div class="date-input-wrapper">
                                    <input type="text" class="date-range-input" id="startDateInput" value="2024-03-04">
                                    <div class="calendar-icon">
                                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M5.6668 0.966797C6.0534 0.966797 6.3668 1.2802 6.3668 1.6668V4.1668C6.3668 4.5534 6.0534 4.8668 5.6668 4.8668C5.2802 4.8668 4.9668 4.5534 4.9668 4.1668V1.6668C4.9668 1.2802 5.2802 0.966797 5.6668 0.966797Z"
                                                fill="%2364748B" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M12.3328 0.966797C12.7194 0.966797 13.0328 1.2802 13.0328 1.6668V4.1668C13.0328 4.5534 12.7194 4.8668 12.3328 4.8668C11.9462 4.8668 11.6328 4.5534 11.6328 4.1668V1.6668C11.6328 1.2802 11.9462 0.966797 12.3328 0.966797Z"
                                                fill="%2364748B" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M1.2168 7.575C1.2168 7.1884 1.5302 6.875 1.9168 6.875H16.0835C16.4701 6.875 16.7835 7.1884 16.7835 7.575C16.7835 7.9616 16.4701 8.275 16.0835 8.275H1.9168C1.5302 8.275 1.2168 7.9616 1.2168 7.575Z"
                                                fill="%2364748B" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M3.00234 4.53895C2.48558 5.09546 2.1998 5.94077 2.1998 7.08346V14.1668C2.1998 15.3095 2.48558 16.1548 3.00234 16.7113C3.51039 17.2584 4.34156 17.6335 5.66647 17.6335H12.3331C13.6581 17.6335 14.4892 17.2584 14.9973 16.7113C15.514 16.1548 15.7998 15.3095 15.7998 14.1668V7.08346C15.7998 5.94077 15.514 5.09546 14.9973 4.53895C14.4892 3.99182 13.6581 3.6168 12.3331 3.6168H5.66647C4.34156 3.6168 3.51039 3.99182 3.00234 4.53895ZM1.97643 3.58631C2.82256 2.6751 4.07472 2.2168 5.66647 2.2168H12.3331C13.9249 2.2168 15.1771 2.6751 16.0232 3.58631C16.8606 4.48813 17.1998 5.72616 17.1998 7.08346V14.1668C17.1998 15.5241 16.8606 16.7621 16.0232 17.6639C15.1771 18.5752 13.9249 19.0335 12.3331 19.0335H5.66647C4.07472 19.0335 2.82256 18.5752 1.97643 17.6639C1.13903 16.7621 0.799805 15.5241 0.799805 14.1668V7.08346C0.799805 5.72616 1.13903 4.48813 1.97643 3.58631Z"
                                                fill="%2364748B" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M9.12891 11.4168C9.12891 11.0302 9.44231 10.7168 9.82891 10.7168H9.83639C10.223 10.7168 10.5364 11.0302 10.5364 11.4168C10.5364 11.8034 10.223 12.1168 9.83639 12.1168H9.82891C9.44231 12.1168 9.12891 11.8034 9.12891 11.4168Z"
                                                fill="%2364748B" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M5.21094 11.4168C5.21094 11.0302 5.52434 10.7168 5.91094 10.7168H5.91842C6.30502 10.7168 6.61842 11.0302 6.61842 11.4168C6.61842 11.8034 6.30502 12.1168 5.91842 12.1168H5.91094C5.52434 12.1168 5.21094 11.8034 5.21094 11.4168Z"
                                                fill="%2364748B" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M5.21094 14.7498C5.21094 14.3632 5.52434 14.0498 5.91094 14.0498H5.91842C6.30502 14.0498 6.61842 14.3632 6.61842 14.7498C6.61842 15.1364 6.30502 15.4498 5.91842 15.4498H5.91094C5.52434 15.4498 5.21094 15.1364 5.21094 14.7498Z"
                                                fill="%2364748B" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="info-item">
                                <label class="info-label">Дата окончания тура</label>
                                <div class="date-input-wrapper">
                                    <input type="text" class="date-range-input" id="endDateInput" value="2024-03-12">
                                    <div class="calendar-icon">
                                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M5.6668 0.966797C6.0534 0.966797 6.3668 1.2802 6.3668 1.6668V4.1668C6.3668 4.5534 6.0534 4.8668 5.6668 4.8668C5.2802 4.8668 4.9668 4.5534 4.9668 4.1668V1.6668C4.9668 1.2802 5.2802 0.966797 5.6668 0.966797Z"
                                                fill="%2364748B" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M12.3328 0.966797C12.7194 0.966797 13.0328 1.2802 13.0328 1.6668V4.1668C13.0328 4.5534 12.7194 4.8668 12.3328 4.8668C11.9462 4.8668 11.6328 4.5534 11.6328 4.1668V1.6668C11.6328 1.2802 11.9462 0.966797 12.3328 0.966797Z"
                                                fill="%2364748B" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M1.2168 7.575C1.2168 7.1884 1.5302 6.875 1.9168 6.875H16.0835C16.4701 6.875 16.7835 7.1884 16.7835 7.575C16.7835 7.9616 16.4701 8.275 16.0835 8.275H1.9168C1.5302 8.275 1.2168 7.9616 1.2168 7.575Z"
                                                fill="%2364748B" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M3.00234 4.53895C2.48558 5.09546 2.1998 5.94077 2.1998 7.08346V14.1668C2.1998 15.3095 2.48558 16.1548 3.00234 16.7113C3.51039 17.2584 4.34156 17.6335 5.66647 17.6335H12.3331C13.6581 17.6335 14.4892 17.2584 14.9973 16.7113C15.514 16.1548 15.7998 15.3095 15.7998 14.1668V7.08346C15.7998 5.94077 15.514 5.09546 14.9973 4.53895C14.4892 3.99182 13.6581 3.6168 12.3331 3.6168H5.66647C4.34156 3.6168 3.51039 3.99182 3.00234 4.53895ZM1.97643 3.58631C2.82256 2.6751 4.07472 2.2168 5.66647 2.2168H12.3331C13.9249 2.2168 15.1771 2.6751 16.0232 3.58631C16.8606 4.48813 17.1998 5.72616 17.1998 7.08346V14.1668C17.1998 15.5241 16.8606 16.7621 16.0232 17.6639C15.1771 18.5752 13.9249 19.0335 12.3331 19.0335H5.66647C4.07472 19.0335 2.82256 18.5752 1.97643 17.6639C1.13903 16.7621 0.799805 15.5241 0.799805 14.1668V7.08346C0.799805 5.72616 1.13903 4.48813 1.97643 3.58631Z"
                                                fill="%2364748B" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M9.12891 11.4168C9.12891 11.0302 9.44231 10.7168 9.82891 10.7168H9.83639C10.223 10.7168 10.5364 11.0302 10.5364 11.4168C10.5364 11.8034 10.223 12.1168 9.83639 12.1168H9.82891C9.44231 12.1168 9.12891 11.8034 9.12891 11.4168Z"
                                                fill="%2364748B" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M5.21094 11.4168C5.21094 11.0302 5.52434 10.7168 5.91094 10.7168H5.91842C6.30502 10.7168 6.61842 11.0302 6.61842 11.4168C6.61842 11.8034 6.30502 12.1168 5.91842 12.1168H5.91094C5.52434 12.1168 5.21094 11.8034 5.21094 11.4168Z"
                                                fill="%2364748B" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M5.21094 14.7498C5.21094 14.3632 5.52434 14.0498 5.91094 14.0498H5.91842C6.30502 14.0498 6.61842 14.3632 6.61842 14.7498C6.61842 15.1364 6.30502 15.4498 5.91842 15.4498H5.91094C5.52434 15.4498 5.21094 15.1364 5.21094 14.7498Z"
                                                fill="%2364748B" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="info-item">
                                <label class="info-label">Тип гарантии</label>
                                <div class="filter-item">
                                    <div class="custom-select">
                                        <div class="filter-trigger filter-trigger-guarantee">
                                            <span>Тип гарантии</span>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#64748B">
                                                <path d="M7 10l5 5 5-5z" />
                                            </svg>
                                        </div>
                                        <div class="filter-dropdown filter-dropdown-guarantee">
                                            <div class="filter-search-container">
                                                <input type="text" class="filter-search-input"
                                                    placeholder="Выбор типа гарантии">
                                            </div>
                                            <div class="filter-options">
                                                <label class="filter-option">
                                                    <input type="checkbox" name="guarantee-type" value="full">
                                                    <span class="option-text">Полная гарантия</span>
                                                    <span class="checkmark"></span>
                                                </label>
                                                <label class="filter-option">
                                                    <input type="checkbox" name="guarantee-type" value="partial">
                                                    <span class="option-text">Частичная гарантия</span>
                                                    <span class="checkmark"></span>
                                                </label>
                                                <label class="filter-option">
                                                    <input type="checkbox" name="guarantee-type" value="none">
                                                    <span class="option-text">Без гарантии</span>
                                                    <span class="checkmark"></span>
                                                </label>
                                                <label class="filter-option">
                                                    <input type="checkbox" name="guarantee-type" value="deposit">
                                                    <span class="option-text">Гарантийный депозит</span>
                                                    <span class="checkmark"></span>
                                                </label>
                                            </div>
                                            <div class="filter-actions">
                                                <button class="filter-clear-btn">Очистить</button>
                                                <button class="filter-apply-btn">Применить</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>





                    <div class="section filters">
                        <h2 class="section-title">Контактное лицо</h2>

                        <div class="contact-person">
                            <div class="contact-title">Контактное лицо 1</div>

                            <div class="info-grid">
                                <div class="info-item">
                                    <label class="info-label">ФИО</label>
                                    <input type="text" class="input-field" value="Иванов Олег Иванович">
                                </div>
                                <div class="info-item">
                                    <label class="info-label">Email</label>
                                    <input type="text" class="input-field" value="Ivanov121@gmail.com">
                                </div>
                                <div class="info-item">
                                    <label class="info-label">Телефон</label>
                                    <input type="text" class="input-field" value="+7 123-123-1234">
                                </div>
                            </div>

                            <div class="info-item">
                                <label class="info-label">Комментарий</label>
                                <textarea class="input-field"
                                    rows="3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</textarea>
                            </div>
                        </div>

                        <button class="add-contact-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="rgba(16, 185, 129, 1)" />
                            </svg>
                            Добавить контактное лицо
                        </button>
                    </div>

                    <div class="section filters">
                        <h2 class="section-title">Заказчик</h2>



                        <div class="customer-info">
                            <div class="info-grid grid-n">
                                <div class="info-item">
                                    <label class="info-label">Тип Заказчика</label>
                                    <div class="filter-item">
                                        <div class="custom-select">
                                            <div class="filter-trigger filter-trigger-customer-type">
                                                <span>Юр. лицо</span>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#64748B">
                                                    <path d="M7 10l5 5 5-5z" />
                                                </svg>
                                            </div>
                                            <div class="filter-dropdown filter-dropdown-customer-type">
                                                <div class="filter-options">
                                                    <label class="filter-option">
                                                        <input type="radio" name="customer-type" value="legal" checked>
                                                        <span class="option-text">Юр. лицо</span>
                                                        <span class="checkmark"></span>
                                                    </label>
                                                    <label class="filter-option">
                                                        <input type="radio" name="customer-type" value="individual">
                                                        <span class="option-text">Физ. лицо</span>
                                                        <span class="checkmark"></span>
                                                    </label>
                                                    <label class="filter-option">
                                                        <input type="radio" name="customer-type" value="entrepreneur">
                                                        <span class="option-text">ИП</span>
                                                        <span class="checkmark"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <label class="info-label">Наименование Заказчика</label>
                                    <div class="filter-item">
                                        <div class="custom-select">
                                            <div class="filter-trigger filter-trigger-customer-name">
                                                <span>АНО "Паломнический центр Московского патриархата" 770...</span>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#64748B">
                                                    <path d="M7 10l5 5 5-5z" />
                                                </svg>
                                            </div>
                                            <div class="filter-dropdown filter-dropdown-customer-name">
                                                <div class="filter-search-container">
                                                    <input type="text" class="filter-search-input"
                                                        placeholder="Поиск по названию">
                                                </div>
                                                <div class="filter-options">
                                                    <label class="filter-option">
                                                        <input type="radio" name="customer-name" value="1" checked>
                                                        <span class="option-text">АНО "Паломнический центр Московского
                                                            патриархата" 770...</span>
                                                        <span class="checkmark"></span>
                                                    </label>
                                                    <label class="filter-option">
                                                        <input type="radio" name="customer-name" value="2">
                                                        <span class="option-text">ООО "Паломнические маршруты"</span>
                                                        <span class="checkmark"></span>
                                                    </label>
                                                    <label class="filter-option">
                                                        <input type="radio" name="customer-name" value="3">
                                                        <span class="option-text">АНО "Православный паломник"</span>
                                                        <span class="checkmark"></span>
                                                    </label>
                                                    <label class="filter-option">
                                                        <input type="radio" name="customer-name" value="4">
                                                        <span class="option-text">ИП Смирнов А.В.</span>
                                                        <span class="checkmark"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="info-item">
                                <label class="info-label">Комментарий</label>
                                <textarea class="input-field"
                                    rows="3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</textarea>
                            </div>
                        </div>

                    </div>


                    <div class="section filters">
                        <h2 class="section-title">Паломники / Туристы</h2>


                        <div class="pilgrims-count-container">
                            <label class="info-label">Количество туристов</label>
                            <div class="number-input-container mar-10">
                                <button class="number-down">-</button>
                                <input type="number" class="number-input back-none" value="2" min="1">
                                <button class="number-up">+</button>
                            </div>
                        </div>
                        <div class="pilgrims-info-container">
                            <div class="room-types-section">
                                <label class="info-label">Доступные типы номеров</label>
                                <div class="room-types-options">
                                    <label class="room-type-option">
                                        <input type="checkbox" checked>
                                        <span class="custom-checkbox"></span>
                                        <span class="room-type-text"><img src="/svg/bedd.svg"> <img
                                                src="/svg/bedd.svg">Двухместный номер</span>

                                    </label>
                                    <label class="room-type-option">
                                        <input type="checkbox">
                                        <span class="custom-checkbox"></span>
                                        <span class="room-type-text"><img src="/svg/bedd.svg"> Одноместный
                                            номер</span>

                                    </label>
                                </div>
                            </div>

                            <div class="placement-options-section">
                                <label class="info-label">Варианты размещения</label>
                                <div class="placement-options">
                                    <label class="placement-option">
                                        <input type="checkbox">
                                        <img src="/svg/bedd.svg"> <img src="/svg/bedd.svg">
                                        <span class="placement-text">x1</span>
                                    </label>
                                    <label class="placement-option">
                                        <input type="checkbox">
                                        <img src="/svg/bedd.svg">
                                        <span class="placement-text">x2</span>
                                    </label>
                                </div>
                            </div>
                            <div class="buttom-right">
                                <button class="btn btn-primary select-btn">

                                    Выбрать
                                </button>
                                <button class="btn btn-outline select-btn">

                                    Выбрано
                                </button>
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
                                        <tr class="bed-i-tabel">
                                            <td colspan="5"><img src="/svg/bed-i.svg"> Двухместный номер / 2 туриста
                                            </td>

                                        </tr>
                                        <tr>

                                            <td data-column="pilgrims-count">Петрова А.К.</td>
                                            <td data-column="manager">sdfg@gmail.com</td>
                                            <td data-column="places-limit">+7 123-123-1234</td>

                                            <td data-column="request-status">
                                                <div class="status-item">
                                                    <span class="status-name">В работе</span>
                                                </div>
                                            </td>

                                            <td style="width:100px;">
                                                <div class="actions-container">
                                                    <div class="user-actions">
                                                        <button class="edit-btn">
                                                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M19.3211 9.74688C19.2937 9.68516 18.632 8.21719 17.1609 6.74609C15.2008 4.78594 12.725 3.75 9.99999 3.75C7.27499 3.75 4.79921 4.78594 2.83905 6.74609C1.36796 8.21719 0.703118 9.6875 0.678899 9.74688C0.643362 9.82681 0.625 9.91331 0.625 10.0008C0.625 10.0883 0.643362 10.1748 0.678899 10.2547C0.706243 10.3164 1.36796 11.7836 2.83905 13.2547C4.79921 15.2141 7.27499 16.25 9.99999 16.25C12.725 16.25 15.2008 15.2141 17.1609 13.2547C18.632 11.7836 19.2937 10.3164 19.3211 10.2547C19.3566 10.1748 19.375 10.0883 19.375 10.0008C19.375 9.91331 19.3566 9.82681 19.3211 9.74688ZM9.99999 15C7.5953 15 5.49452 14.1258 3.75546 12.4023C3.0419 11.6927 2.43483 10.8836 1.95312 10C2.4347 9.11636 3.04179 8.30717 3.75546 7.59766C5.49452 5.87422 7.5953 5 9.99999 5C12.4047 5 14.5055 5.87422 16.2445 7.59766C16.9595 8.307 17.5679 9.11619 18.0508 10C17.4875 11.0516 15.0336 15 9.99999 15ZM9.99999 6.25C9.25831 6.25 8.53329 6.46993 7.9166 6.88199C7.29992 7.29404 6.81927 7.87971 6.53544 8.56494C6.25162 9.25016 6.17735 10.0042 6.32205 10.7316C6.46674 11.459 6.82389 12.1272 7.34834 12.6517C7.87279 13.1761 8.54097 13.5333 9.2684 13.6779C9.99583 13.8226 10.7498 13.7484 11.4351 13.4645C12.1203 13.1807 12.7059 12.7001 13.118 12.0834C13.5301 11.4667 13.75 10.7417 13.75 10C13.749 9.00576 13.3535 8.05253 12.6505 7.34949C11.9475 6.64645 10.9942 6.25103 9.99999 6.25ZM9.99999 12.5C9.50554 12.5 9.02219 12.3534 8.61107 12.0787C8.19994 11.804 7.87951 11.4135 7.69029 10.9567C7.50107 10.4999 7.45157 9.99723 7.54803 9.51227C7.64449 9.02732 7.88259 8.58186 8.23222 8.23223C8.58186 7.8826 9.02731 7.6445 9.51227 7.54804C9.99722 7.45157 10.4999 7.50108 10.9567 7.6903C11.4135 7.87952 11.804 8.19995 12.0787 8.61107C12.3534 9.0222 12.5 9.50555 12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 9.99999 12.5Z"
                                                                    fill="#353535"></path>
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
                                                    <div class="actions-dropdown">
                                                        <a href="#" class="dropdown-item">Очистить сессию</a>
                                                        <a href="#" class="dropdown-item">Войти как</a>

                                                    </div>
                                                </div>
                                            </td>
                                        </tr>



                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>


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
                                                    <div class="actions-dropdown">
                                                        <a href="#" class="dropdown-item">Очистить сессию</a>
                                                        <a href="#" class="dropdown-item">Войти как</a>
                                                        <a href="#" class="dropdown-item">Изменить пароль</a>
                                                        <a href="#" class="dropdown-item">Деактивировать</a>
                                                        <a href="#" class="dropdown-item">Удалить пользователя</a>
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
                                                    <div class="actions-dropdown">
                                                        <a href="#" class="dropdown-item">Очистить сессию</a>
                                                        <a href="#" class="dropdown-item">Войти как</a>
                                                        <a href="#" class="dropdown-item">Изменить пароль</a>
                                                        <a href="#" class="dropdown-item">Деактивировать</a>
                                                        <a href="#" class="dropdown-item">Удалить пользователя</a>
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
                                                    <div class="actions-dropdown">
                                                        <a href="#" class="dropdown-item">Очистить сессию</a>
                                                        <a href="#" class="dropdown-item">Войти как</a>
                                                        <a href="#" class="dropdown-item">Изменить пароль</a>
                                                        <a href="#" class="dropdown-item">Деактивировать</a>
                                                        <a href="#" class="dropdown-item">Удалить пользователя</a>
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
                                                    <div class="actions-dropdown">
                                                        <a href="#" class="dropdown-item">Очистить сессию</a>
                                                        <a href="#" class="dropdown-item">Войти как</a>
                                                        <a href="#" class="dropdown-item">Изменить пароль</a>
                                                        <a href="#" class="dropdown-item">Деактивировать</a>
                                                        <a href="#" class="dropdown-item">Удалить пользователя</a>
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
                                                    <div class="actions-dropdown">
                                                        <a href="#" class="dropdown-item">Очистить сессию</a>
                                                        <a href="#" class="dropdown-item">Войти как</a>
                                                        <a href="#" class="dropdown-item">Изменить пароль</a>
                                                        <a href="#" class="dropdown-item">Деактивировать</a>
                                                        <a href="#" class="dropdown-item">Удалить пользователя</a>
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
                                                    <div class="actions-dropdown">
                                                        <a href="#" class="dropdown-item">Очистить сессию</a>
                                                        <a href="#" class="dropdown-item">Войти как</a>
                                                        <a href="#" class="dropdown-item">Изменить пароль</a>
                                                        <a href="#" class="dropdown-item">Деактивировать</a>
                                                        <a href="#" class="dropdown-item">Удалить пользователя</a>
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
        <div class="modal" id="tagsModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Добавить тег</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                    <div class="modal-tags-container">
                        <div class="tag-input-row">
                            <input type="text" class="modal-tag-input" placeholder="Имя тега">
                            <button class="btn btn-primary add-tag-btn-modal">Добавить</button>
                        </div>
                        <div class="modal-tags-list">
                            <div class="modal-tag-item">
                                <span>Тет 1</span>
                                <svg class="tag-close" width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                                </svg>
                            </div>
                            <div class="modal-tag-item">
                                <span>Тет 1</span>
                                <svg class="tag-close" width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                                </svg>
                            </div>
                            <div class="modal-tag-item">
                                <span>Тет 1</span>
                                <svg class="tag-close" width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                                </svg>
                            </div>
                            <div class="modal-tag-item">
                                <span>Тет 1</span>
                                <svg class="tag-close" width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <!-- <Alert variant="destructive" v-show="hasErrorAlert" class="fixed top-4 right-4 w-[350px] p-2 z-50 shadow-lg">
            <AlertTitle>Ошибка!</AlertTitle>
            <AlertDescription>
                {{ profile.error }}
            </AlertDescription>
        </Alert> -->
</template>
<style scoped lang="scss">
  :root {
    --primary-color: #4caf50;
    --primary-hover: #3e8e41;
    --text-color: #333;
    --light-gray: #f5f5f5;
    --border-color: #ddd;
    --sidebar-width: 250px;
    --collapsed-sidebar: 80px;
}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Inter, sans-serif;
}
body {
    display: flex;
    min-height: 100vh;
    color: var(--text-color);
    background-color: #f9f9f9;
    transition: all 0.3s;
}
.main-content {
    margin-left: 250px;
    flex: 1;
    transition: all 0.3s;
    min-width: 0;
}
.custom-select {
    position: relative;
    width: 100%;
}
.filter-select {
    width: 100%;
    padding: 10px 14px;
    padding-right: 32px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    transition: all 0.2s;
}
.filter-select:focus {
    outline: 0;
    border-color: #94a3b8;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}
.filter-select option[disabled][selected] {
    color: #94a3b8;
}
.search-filters-container {
    display: grid;
    position: relative;
    grid-template-columns: 280px 1fr;
    grid-gap: 24px;
}
.search-container {
    margin-bottom: 16px;
}
.search-container {
    margin-bottom: 16px;
    position: relative;
}
.search-input-wrapper {
    position: relative;
    width: 100%;
}
.search-input {
    width: 100%;
    padding: 12px 16px 12px 42px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    transition: all 0.2s;
}
.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}
.search-input:focus {
    outline: 0;
    border-color: #94a3b8;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}
.search-input:focus + .search-icon path {
    fill: #64748b;
}
.filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
}
.filter-item {
    position: relative;
}
.filter-input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    transition: all 0.2s;
}
.filter-input:focus {
    outline: 0;
    border-color: #94a3b8;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}
@media (max-width: 640px) {
    .filters-grid {
        grid-template-columns: 1fr 1fr;
    }
    .filter-input,
    .filter-select,
    .search-input {
        padding: 10px 12px;
        font-size: 13px;
    }
}
.user-info {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}
.user-avatar {
    width: 42px;
    height: 42px;
    color: #fff;
    display: inline;
    margin-right: 40px;
    font-size: 14px;
    flex-shrink: 0;
    margin-bottom: 10px;
}
.user-name {
    font-weight: 500;
    white-space: nowrap;
}
.dropdown {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
}
.dropdown-item {
    display: block;
    padding: 8px 16px;
    color: var(--text-color);
    text-decoration: none;
    white-space: nowrap;
}
.dropdown-item:hover {
    background-color: rgba(76, 175, 80, 0.1);
    color: rgba(16, 185, 129, 1);
}
.content {
    padding: 30px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}
.actions {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
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
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
}
.btn-primary:hover {
    background-color: #0f9166;
}
.btn-outline {
    background: #fff;
    border: 1px solid rgba(16, 185, 129, 1);
    color: rgba(16, 185, 129, 1);
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
}
.btn-outline:hover {
    background: var(--light-gray);
}
.filters {
    background: #fff;
    padding: 20px;
    border-radius: 24px;
    margin-bottom: 30px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 15px;
}
.filter-group {
    flex: 1;
    min-width: 200px;
}
.filter-label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #666;
}
.filter-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
}
.search-input {
    flex: 2;
    padding-left: 40px !important;
    padding: 10px 15px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 16px;
}
.number-input-container {
    position: relative;
    width: 100%;
}
.number-input {
    width: 100%;
    padding: 10px 36px 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    -moz-appearance: textfield;
    transition: all 0.2s;
}
.number-input::-webkit-inner-spin-button,
.number-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.number-input:focus {
    outline: 0;
    border-color: #94a3b8;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}
.number-controls {
    position: absolute;
    right: 1px;
    top: 1px;
    bottom: 1px;
    width: 24px;
    display: flex;
    flex-direction: column;
    border-radius: 0 7px 7px 0;
    overflow: hidden;
}
.number-down,
.number-up {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e2e8f0;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: background 0.2s;
}
.number-up {
    border-bottom: 1px solid #cbd5e1;
}
.number-down:hover,
.number-up:hover {
    background: #cbd5e1;
}
.number-down svg,
.number-up svg {
    fill: #334155;
}
.status-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}
.status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    font-size: 12px;
}
.status-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90px;
    -webkit-border-radius: 44px;
    -moz-border-radius: 44px;
    color: rgba(16, 185, 129, 1);
    border-radius: 44px;
    margin: 4px;
    padding: 6px 10px;
    font-weight: 500;
    font-style: Medium;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    background: rgba(16, 185, 129, 0.12);
}
.status-name2 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90px;
    -webkit-border-radius: 44px;
    -moz-border-radius: 44px;
    color: rgba(209, 67, 67, 1);
    border-radius: 44px;
    margin: 4px;
    padding: 6px 10px;
    font-weight: 500;
    font-style: Medium;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    background: rgba(209, 67, 67, 0.12);
}
.status-name3 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90px;
    -webkit-border-radius: 44px;
    -moz-border-radius: 44px;
    color: rgba(106, 110, 117, 1);
    border-radius: 44px;
    margin: 4px;
    padding: 6px 10px;
    font-weight: 500;
    font-style: Medium;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    background: rgba(106, 110, 117, 0.12);
}
.status-type {
    color: #666;
    font-weight: 500;
    background: rgba(255, 149, 0, 0.12);
    margin: 4px;
    padding: 6px 10px;
    font-weight: 500;
    font-style: Medium;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    color: rgba(255, 149, 0, 1);
    -webkit-border-radius: 44px;
    -moz-border-radius: 44px;
    border-radius: 44px;
}
.status-type2 {
    color: #666;
    font-weight: 500;
    background: rgba(61, 126, 255, 0.12);
    margin: 4px;
    padding: 6px 10px;
    font-weight: 500;
    font-style: Medium;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    color: rgba(61, 126, 255, 1);
    -webkit-border-radius: 44px;
    -moz-border-radius: 44px;
    border-radius: 44px;
}
.tags-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    margin-bottom: 20px;
}
.tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.tag-item {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(241, 241, 244, 1);
    padding: 6px 12px;
    border-radius: 16px;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: rgba(106, 110, 117, 1);
    white-space: nowrap;
    line-height: 1.5;
}
.tag-close {
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
}
.tag-close:hover {
    opacity: 1;
}
.tag-item:not(.active) .tag-close {
    display: none;
}
.add-tag-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(241, 241, 244, 1);
    border: none;
    color: rgba(106, 110, 117, 1);
    font-size: 12px;
    -webkit-border-radius: 44px;
    -moz-border-radius: 44px;
    border-radius: 44px;
    cursor: pointer;
    border: 1px dashed rgba(159, 166, 175, 1);
    padding: 6px 12px;
}
.add-tag-btn:hover {
    color: #3e8e41;
}
.add-tag-btn svg {
    flex-shrink: 0;
    fill: rgba(106, 110, 117, 1);
}
.tours-container {
    background: #fff;
    border-radius: 24px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    overflow-x: auto;
    width: 100%;
}
.tours-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
}
.tours-count {
    font-weight: 500;
}
.tours-count {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--text-color);
}
.table-wrapper {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    max-height: 500px;
    overflow-y: auto;
    position: relative;
}
table {
    width: 100%;
    border-collapse: collapse;
    min-width: 1000px;
    position: relative;
}
td,
th {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    white-space: nowrap;
}
td {
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0;
    vertical-align: middle;
    color: rgba(53, 53, 53, 1);
}
.number-td {
    color: rgba(106, 110, 117, 1);
}
.title-tour-table {
    font-weight: 500;
    margin-bottom: 6px;
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
th {
    font-weight: 500;
    color: #666;
    position: sticky;
    top: 0;
    color: rgba(106, 110, 117, 1);
    text-transform: uppercase;
    font-size: 11px;
    z-index: 0;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}
tr:hover {
    background-color: rgba(76, 175, 80, 0.05);
}
.tour-type {
    display: block;
    color: rgba(53, 53, 53, 1);
    font-weight: 400;
    font-size: 14px;
    white-space: normal;
    line-height: 20px;
    min-width: 170px;
}
.edit-column {
    position: sticky;
    right: 0;
    background: #fff;
    border-left: 1px solid var(--border-color);
    visibility: hidden;
    opacity: 0;
    transition: all 0.2s;
}
tr:hover .edit-column {
    visibility: visible;
    opacity: 1;
}
.edit-btn {
    background: 0 0;
    border: none;
    cursor: pointer;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}
.edit-btn:hover {
    color: var(--primary-color);
}
.edit-btn svg {
    width: 18px;
    height: 18px;
}
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    align-items: center;
    justify-content: center;
}
.modal-content {
    background: #fff;
    border-radius: 16px;
    width: 100%;
    max-width: 510px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
.modal-header {
    padding: 10px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.modal-header h3 {
    font-weight: 600;
    font-style: Semi Bold;
    font-size: 20px;
    line-height: 100%;
    color: rgba(53, 53, 53, 1);
    margin: 0;
}
.close-modal {
    background: 0 0;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #64748b;
    padding: 0;
    line-height: 1;
}
.modal-body {
    padding: 0 24px 24px 24px;
}
.modal-body p {
    font-size: 14px;
    line-height: 1.5;
    color: #64748b;
    margin-bottom: 20px;
}
.tag-input-row {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
}
.modal-tag-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
}
.modal-tag-input:focus {
    outline: 0;
    border-color: #94a3b8;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}
.add-tag-btn-modal {
    white-space: nowrap;
    padding: 0 16px;
}
.modal-tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.modal-tag-item {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(241, 241, 244, 1);
    padding: 6px 12px;
    border-radius: 16px;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: rgba(106, 110, 117, 1);
}
.modal-tag-item svg {
    cursor: pointer;
    opacity: 0.7;
    fill: #000;
    transition: opacity 0.2s;
}
.modal-tag-item svg:hover {
    opacity: 1;
}
.filter-trigger {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.filter-trigger:hover {
    border-color: #94a3b8;
}
.filter-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 280px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    margin-top: 5px;
}
.content,
.main-content,
.tours-container {
    overflow: visible !important;
}
@media (max-width: 768px) {
    .filter-dropdown {
        width: 100%;
        left: 0 !important;
        right: auto !important;
        transform: none !important;
    }
    .filters-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
}
.filter-search-container {
    padding: 12px;
    border-bottom: 1px solid #e2e8f0;
}
.filter-search-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 14px;
}
.filter-search-input:focus {
    outline: 0;
    border-color: #94a3b8;
}
.filter-options {
    padding: 8px 0;
}
.filter-option {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    justify-content: space-between;
    flex-direction: row-reverse;
}
.filter-option:hover {
    background-color: rgba(16, 185, 129, 0.05);
}
.filter-option input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}
.checkmark {
    position: relative;
    height: 16px;
    width: 16px;
    min-width: 16px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    margin-left: 12px;
    margin-right: 0;
}
.filter-option input:checked ~ .checkmark {
    background-color: rgba(16, 185, 129, 1);
    border-color: rgba(16, 185, 129, 1);
}
.checkmark:after {
    content: "";
    position: absolute;
    display: none;
    left: 5px;
    top: 2px;
    width: 4px;
    height: 8px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}
.filter-option input:checked ~ .checkmark:after {
    display: block;
}
.option-text {
    font-size: 14px;
    color: #353535;
    margin-right: auto;
}
.filter-actions {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    border-top: 1px solid #e2e8f0;
}
.filter-apply-btn,
.filter-clear-btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
}
.filter-clear-btn {
    background: 0 0;
    border: 1px solid #e2e8f0;
    color: #64748b;
    margin-right: 10px;
}
.filter-clear-btn:hover {
    background: #f8fafc;
}
.filter-apply-btn {
    background-color: rgba(16, 185, 129, 1);
    color: #fff;
    border: none;
}
.filter-apply-btn:hover {
    background-color: #0f9166;
}
.filters-grid {
    display: flex;
    z-index: 1000;
    position: relative;
    gap: 12px;
    position: relative;
    width: max-content;
    min-width: 100%;
    gap: 12px;
    padding-bottom: 10px;
    scrollbar-width: thin;
    scrollbar-color: rgba(16, 185, 129, 0.5) #f1f1f1;
    -webkit-overflow-scrolling: touch;
}
.filters-grid::-webkit-scrollbar {
    height: 4px;
}
.filters-grid::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
}
.filters-grid::-webkit-scrollbar-thumb {
    background-color: rgba(16, 185, 129, 0.5);
    border-radius: 2px;
}
.filter-item {
    flex: 0 0 auto;
    min-width: 110px;
}
.filter-dropdown {
    max-width: calc(100vw - 20px);
    left: auto;
    right: 0;
}
.price-100 {
    max-width: 130px;
}
.filter-option {
    display: flex;
    align-items: center;
}
.filter-option .checkmark {
    order: 1;
    margin-left: auto;
}
.filter-option .option-text {
    order: 2;
    margin-left: 8px;
    margin-right: auto;
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
}
.custom-radio {
    position: relative;
    width: 16px;
    height: 16px;
    border: 2px solid #cbd5e1;
    border-radius: 50%;
    margin-right: 10px;
    transition: border-color 0.2s;
}
.custom-radio::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    opacity: 0;
    transition: opacity 0.2s;
}
.option-text {
    font-size: 14px;
    color: #1e293b;
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
.info-value {
    font-size: 14px;
    color: #353535;
    font-weight: 500;
}
.input-field {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
}
.number-input-container {
    position: relative;
    width: 100%;
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
.number-controls {
    position: absolute;
    right: 1px;
    top: 1px;
    bottom: 1px;
    width: 24px;
    display: flex;
    flex-direction: column;
    border-radius: 0 7px 7px 0;
    overflow: hidden;
}
.number-down,
.number-up {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e2e8f0;
    border: none;
    padding: 0;
}
.number-up {
    border-bottom: 1px solid #cbd5e1;
}
.btn {
    padding: 8px 16px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
}
.btn-primary {
    background-color: rgba(16, 185, 129, 1);
    color: #fff;
}
.btn-outline {
    background: #fff;
    border: 1px solid rgba(16, 185, 129, 1);
    color: rgba(16, 185, 129, 1);
}
.order-title {
    font-weight: 500;
    margin-bottom: 8px;
    color: #353535;
}
.order-meta {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 12px;
}
.order-price {
    font-weight: 500;
    color: #353535;
}
.order-price-3 {
    font-weight: 500;
    color: #353535;
    font-size: 12px;
}
.tourist-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #e2e8f0;
}
.tourist-name {
    font-weight: 500;
}
.tourist-price {
    color: #353535;
}
.total-price {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    font-weight: 500;
    font-size: 16px;
}
.payment-options {
    display: flex;
    gap: 16px;
    margin-top: 16px;
}
.payment-option {
    display: flex;
    align-items: center;
    gap: 8px;
}
.action-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
}
.contact-person {
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
}
.contact-title {
    font-weight: 500;
    margin-bottom: 16px;
}
.mar-bb30 {
    margin-bottom: 25px;
    position: relative;
    z-index: 0;
}
.add-contact-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(16, 185, 129, 1);
    background: 0 0;
    border: none;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 0;
}
.select-field {
    width: 100%;
    padding: 8px 30px 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
}
.title-bread-com {
    font-weight: 400;
    color: rgba(106, 110, 117, 1);
    font-style: Regular;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 20px;
}
.customer-info {
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
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
}
input[type="checkbox"]:checked + .checkbox {
    background-color: rgba(16, 185, 129, 1);
    border-color: rgba(16, 185, 129, 1);
}
input[type="checkbox"]:checked + .checkbox:after {
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
.date-input {
    position: relative;
}
.date-input:after {
    content: "□";
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
}
.search-filters-container2 {
    display: grid;
    position: relative;
    grid-template-columns: 1fr;
    grid-gap: 24px;
}
.status-name {
    -webkit-border-radius: 44px;
    -moz-border-radius: 44px;
    border-radius: 44px;
    padding: 6px 12px;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    color: rgba(255, 149, 0, 1);
    background: rgba(255, 149, 0, 0.12);
}
.flatpickr-calendar {
    transform: none !important;
    visibility: visible !important;
    opacity: 1 !important;
}
.flatpickr-calendar {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    font-family: Inter, sans-serif;
    border: 1px solid #e2e8f0;
}
.flatpickr-calendar {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
}
.flatpickr-calendar {
    font-family: Inter, sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}
.date-range-input {
    display: none;
}
.date-range-input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    margin-bottom: 10px;
    cursor: pointer;
    opacity: 0;
    height: 0;
    padding: 0;
    border: none;
}
.flatpickr-input {
    display: none !important;
}
.date-range-input {
    width: 100%;
    padding: 10px 35px 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    cursor: pointer;
    position: relative;
}
.date-input-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
}
.date-range-input {
    padding-right: 40px !important;
    background-image: url(data:image/svg+xml;utf8,SVG_REPLACED);
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 18px 20px;
}
.date-input:after {
    display: none !important;
}
.filter-trigger {
    position: relative;
    padding-right: 30px;
}
.calendar-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 20px;
}
.date-range-input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    opacity: 1 !important;
    height: auto !important;
    position: relative;
}
.flatpickr-calendar {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    margin-top: 5px;
    z-index: 1000;
}
.calendar-icon {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 20px;
}
.custom-select {
    position: relative;
    z-index: 100;
}
.date-range-input {
    display: block;
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    opacity: 1;
    height: auto;
}
.flatpickr-calendar {
    font-family: Inter, sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    transform: none !important;
}
.draggable-table th {
    position: relative;
    cursor: pointer;
    user-select: none;
}
.draggable-table th .drag-handle {
    display: inline-block;
    margin-left: 5px;
    color: #64748b;
    font-size: 12px;
    vertical-align: middle;
    cursor: grab;
}
.draggable-table th.placeholder {
    background-color: rgba(16, 185, 129, 0.05);
    border: 1px dashed rgba(16, 185, 129, 0.3);
}
.draggable-table th[data-column="nights-count"],
.draggable-table th[data-column="pilgrims-count"],
.draggable-table th[data-column="places-limit"],
.draggable-table th[data-column="tour-number"] {
    width: 60px;
}
.draggable-table th[data-column="creation-date"],
.draggable-table th[data-column="end-date"],
.draggable-table th[data-column="payment-due"],
.draggable-table th[data-column="start-date"] {
    width: 100px;
}
.draggable-table th[data-column="customer-email"],
.draggable-table th[data-column="customer-phone"] {
    width: 140px;
}
.draggable-table th {
    position: relative;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
}
.draggable-table th .drag-handle {
    display: inline-block;
    margin-left: 5px;
    color: #64748b;
    font-size: 12px;
    vertical-align: middle;
    cursor: grab;
}
.draggable-table th.placeholder {
    background-color: rgba(16, 185, 129, 0.05);
    border: 1px dashed rgba(16, 185, 129, 0.3);
}
@keyframes pulse {
    0% {
        opacity: 0.6;
    }
    50% {
        opacity: 0.3;
    }
    100% {
        opacity: 0.6;
    }
}
.draggable-table td {
    transition: transform 0.3s ease;
}
.draggable-table th[draggable="true"] {
    -webkit-user-drag: element;
}
.status-item {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
}
.status-name {
    background-color: rgba(16, 185, 129, 0.12);
    color: rgba(16, 185, 129, 1);
}
@media (max-width: 1600px) {
    .table-wrapper2 {
        overflow-x: auto;
    }
    .draggable-table {
        min-width: 1800px;
    }
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
.grid-tours-fd {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 16px;
}
#endDateInput,
#startDateInput {
    display: block !important;
    opacity: 1 !important;
    height: auto !important;
}
.pilgrims-count-container {
    max-width: 120px;
}
.pilgrims-count-container .info-label {
    margin-bottom: 0;
    white-space: nowrap;
}
.pilgrims-count-container .number-input-container {
    display: flex;
    align-items: center;
    width: auto;
}
.pilgrims-count-container .number-input {
    width: 40px;
    text-align: center;
    padding: 10px;
    -moz-appearance: textfield;
    margin: 0 4px;
}
.pilgrims-count-container .number-input::-webkit-inner-spin-button,
.pilgrims-count-container .number-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.mar-10 {
    margin-top: 10px;
}
.info-grid.grid-n {
    grid-template-columns: 150px 1fr;
}
.back-none {
    background: 0 0 !important;
    border: none !important;
}
.pilgrims-count-container .number-down,
.pilgrims-count-container .number-up {
    width: 32px;
    height: 32px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    background: #f1f1f4;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    font-size: 16px;
    color: #353535;
}
.pilgrims-count-container .number-down:hover,
.pilgrims-count-container .number-up:hover {
    background: #e2e8f0;
}
.order-section {
    max-width: 600px;
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 16px;
}
.order-section h1 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
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
.order-meta {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 12px;
}
.order-price3 {
    font-weight: 500;
    color: #353535;
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
    font-style: Semi Bold;
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
.payment-option {
    display: flex;
    align-items: center;
    gap: 8px;
}
.header-sec-right-col {
    display: flex;
    align-items: top;
    gap: 20px;
}
.checkbox {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    position: relative;
    vertical-align: middle;
}
input[type="checkbox"] {
    position: absolute;
    opacity: 0;
}
input[type="checkbox"]:checked + .checkbox {
    background-color: #10b981;
    border-color: #10b981;
}
input[type="checkbox"]:checked + .checkbox:after {
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
.partial-payment-section {
    margin-top: 16px;
}
.info-label {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 4px;
    display: block;
}
.info-value {
    font-size: 14px;
    color: #353535;
    font-weight: 500;
    margin-bottom: 12px;
}
.action-buttons3 {
    display: grid;
    position: relative;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
    margin-top: 30px;
}
.t-center {
    text-align: center;
    display: block;
}
.btn-primary {
    background-color: #10b981;
    color: #fff;
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
.date-input-wrapper {
    position: relative;
    width: 100%;
}
.date-input {
    width: 100%;
    padding: 10px 14px 10px 35px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    cursor: pointer;
}
.tag-item svg {
    fill: rgba(106, 110, 117, 1);
}
.textarea-p {
    width: 100%;
    border: 1px solid rgba(212, 214, 217, 1);
    background: rgba(249, 249, 250, 0.32);
    height: 78px;
    border-radius: 10px;
}
.pilgrims-info-container {
    background: #f9f9fa;
    border-radius: 12px;
    padding: 16px;
    margin-top: 20px;
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 24px;
}
.placement-options-section,
.room-types-section {
    margin: 16px 0;
}
.placement-options,
.room-types-options {
    margin-top: 8px;
}
.buttom-right {
    text-align: right;
}
.room-type-text img {
    margin-bottom: -2px;
    margin-right: 6px;
}
.room-type-text {
    margin-bottom: 10px;
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
.select-btn {
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.data-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #353535;
}
.tourist-header {
    display: grid;
    grid-template-columns: 2fr 2fr 2fr 1fr;
    padding: 8px 0;
    border-bottom: 1px solid #e2e8f0;
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
}
.tourist-item {
    padding: 12px 0;
    border-bottom: 1px solid #e2e8f0;
}
.tourist-info {
    display: grid;
    grid-template-columns: 2fr 2fr 2fr 1fr;
    align-items: center;
}
.tourist-email,
.tourist-name {
    font-size: 14px;
    color: #353535;
}
.payment-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #353535;
}
.bed-i-tabel td img {
    margin-bottom: -6px;
    margin-right: 10px;
}
.bed-i-tabel td {
    background: rgba(241, 241, 244, 1) !important;
    font-weight: 500;
    font-style: Medium;
    color: rgba(106, 110, 117, 1);
    font-size: 11px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0;
    vertical-align: middle;
    text-transform: uppercase;
}
.list-container {
    max-width: 500px;
}
.list-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
.input-container {
    display: flex;
    align-items: center;
    flex-grow: 1;
}
.input-field2 {
    width: 300px;
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    margin-right: 10px;
}
.checkbox-list {
    margin: 20px 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}
.checkbox-list label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 4px;
    background: #f8fafc;
}
.info-label-4 {
    width: 300px !important;
}
.info-grid-p {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
}
.tag-item4 {
    display: flex;
    align-items: center;
    gap: 4px;
    background: 0 0;
    padding: 6px 12px;
    border-radius: 16px;
    border: 1px solid rgba(212, 214, 217, 1);
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: rgba(106, 110, 117, 1);
    white-space: nowrap;
}

.clear {
    clear: both;
}
.tab {
    padding: 12px 16px;
    font-weight: 500;
    color: #6a6e75;
    cursor: pointer;
    position: relative;
}
.contact-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
}
.contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6a6e75;
    font-size: 14px;
    padding-left: 25px;
    position: relative;
    margin-bottom: 0;
}
.contact-item a {
    color: #6a6e75;
    text-decoration: none;
}
.contact-item a:hover {
    text-decoration: underline;
}
.contact-item svg {
    flex-shrink: 0;
}
.contact-item::before {
    content: "";
    position: absolute;
    top: 3px;
    left: -3px;
    margin-left: 0;
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    line-height: 20px;
    background-repeat: no-repeat;
}
.info-row {
    display: flex;
    margin-bottom: 12px;
}
.info-label {
    font-weight: 500;
    color: #6a6e75;
    width: 250px;
    flex-shrink: 0;
}
.info-value {
    color: #353535;
}
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.status-name {
    display: inline-block;
    background: rgba(16, 185, 129, 0.12);
    color: #10b981;
    border-radius: 44px;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 500;
    margin-right: 8px;
    margin-bottom: 4px;
}
.tab-content {
    display: none;
}
.users-section {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.users-header {
    margin-bottom: 20px;
}
.users-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}
.users-title h3 {
    font-size: 16px;
    font-weight: 500;
    color: #353535;
    margin: 0;
}
.users-count {
    background: #f1f1f4;
    color: #6a6e75;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 44px;
}
.search-container {
    display: flex;
    gap: 16px;
    width: 100%;
}
.add-user-btn {
    white-space: nowrap;
}
.table-wrapper {
    overflow-x: auto;
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
.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}
.user-info2 {
    display: flex;
    align-items: center;
    gap: 20px;
}
.user-avatar2 {
    width: 58px;
    height: 58px;
    flex: 0 0 auto;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
}
.user-avatar2 img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.user-name {
    font-weight: 500;
    flex: 1;
    color: #353535;
    margin-bottom: 4px;
}
.user-name2 {
    font-weight: 500;
    font-style: Medium;
    font-size: 16px;
    line-height: 24px;
    color: rgba(53, 53, 53, 1);
}
.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.tag {
    background: rgba(16, 185, 129, 0.12);
    color: #10b981;
    border-radius: 44px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 500;
}
.actions {
    display: flex;
    gap: 12px;
    align-items: center;
}
.edit-btn,
.more-btn {
    background: 0 0;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.edit-btn:hover svg path,
.more-btn:hover svg path {
    fill: #10b981;
}
.edit-column {
    position: sticky;
    right: 0;
    background: #fff;
    border-left: 1px solid #e2e8f0;
    visibility: hidden;
    opacity: 0;
    transition: all 0.2s;
}
tr:hover .edit-column {
    visibility: visible;
    opacity: 1;
}
.user-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}
.users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}
.actions-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
    min-width: 200px;
    display: none;
}
.dropdown-item {
    padding: 8px 16px;
    display: block;
    color: #353535;
    text-decoration: none;
    font-size: 14px;
}
.dropdown-item:hover {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10b981;
}
.actions-container {
    position: relative;
}
.stacked-avatars {
    position: relative;
    display: inline-flex;
    height: 32px;
    margin-right: 10px;
}
.avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #fff;
    background-size: cover;
    background-position: center;
    position: relative;
    margin-left: -10px;
}
.avatar:first-child {
    margin-left: 0;
}
.avatar-count {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
    background: #10b981;
    color: #fff;
    font-weight: 500;
    position: relative;
    margin-left: -10px;
    z-index: 0;
}
.date-rekz {
    font-weight: 400;
    font-style: Regular;
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
.avatar3:nth-child(3) {
    background-color: rgba(214, 224, 255, 1);
}
.plus-count {
    margin-left: 5px;
    font-weight: 400;
    font-style: Regular;
    font-size: 14px;
    color: rgba(53, 53, 53, 1);
}
.avtor-dog-tab {
    font-weight: 400;
    font-style: Regular;
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
/* Дополнения для выпадающего меню действий */
.actions-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 100;
    min-width: 200px;
    display: none;
    padding: 8px 0;
}

.actions-dropdown.active {
    display: block;
    animation: fadeIn 0.2s ease-in-out;
}

.dropdown-item {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #353535;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.2s ease;
}

.dropdown-item:hover {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10B981;
}

.dropdown-item svg {
    flex-shrink: 0;
}

.dropdown-divider {
    height: 1px;
    background: #E2E8F0;
    margin: 8px 0;
}

/* Анимация появления */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Дополнительные стили для кнопок в выпадающем меню */
.dropdown-btn {
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    padding: 8px 16px;
    font-size: 14px;
    color: #353535;
    display: flex;
    align-items: center;
    gap: 8px;
}

.dropdown-btn:hover {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10B981;
}

/* Стили для опасных действий в выпадающем меню */
.dropdown-item.danger,
.dropdown-btn.danger {
    color: #EF4444;
}

.dropdown-item.danger:hover,
.dropdown-btn.danger:hover {
    background-color: rgba(239, 68, 68, 0.1);
}

/* Стили для активного состояния выпадающего списка */
.filter-dropdown.active {
    max-height: 400px;
    opacity: 1;
    overflow-y: auto;
}

/* Стили для стрелки в триггере фильтра */
.filter-trigger svg {
    transition: transform 0.2s;
    flex-shrink: 0;
}

.filter-trigger.active svg {
    transform: rotate(180deg);
}

/* Стили для счетчика выбранных элементов */
.filter-selected-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background-color: rgba(16, 185, 129, 1);
    color: white;
    border-radius: 50%;
    font-size: 12px;
    margin-left: 8px;
}

/* Позиционирование для выпадающих списков справа */
.filter-dropdown.right-adjusted {
    left: auto;
    right: 0;
    transform: translateX(0);
}

/* Стили для радио-кнопок в выпадающих списках */
.filter-option input[type="radio"] {
    position: absolute;
    opacity: 0;
}

.filter-option input[type="radio"] + .checkmark {
    border-radius: 50%;
}

.filter-option input[type="radio"]:checked + .checkmark {
    background-color: rgba(16, 185, 129, 1);
    border-color: rgba(16, 185, 129, 1);
}

.filter-option input[type="radio"]:checked + .checkmark:after {
    content: "";
    position: absolute;
    display: block;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Анимация для выпадающих списков */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.filter-dropdown {
    animation: fadeIn 0.2s ease-out;
}

/* Стили для скролла в выпадающих списках */
.filter-dropdown::-webkit-scrollbar {
    width: 6px;
}

.filter-dropdown::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.filter-dropdown::-webkit-scrollbar-thumb {
    background-color: rgba(16, 185, 129, 0.5);
    border-radius: 3px;
}
</style>