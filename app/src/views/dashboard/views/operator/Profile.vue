<script setup>

import UButton from '@/components/ui/UButton.vue'
import { onMounted, ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Users from './Users.vue'
import { fetchOperator, fixOperatorById } from '@/api/operators'
import UModal from '@/components/ui/UModal.vue'
import UInput from '@/components/ui/UInput.vue'
import UBanner from '@/components/ui/UBanner.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import AppDatePicker from '@/components/app/AppDatePicker.vue'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover' 
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Trash2 } from 'lucide-vue-next'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useProfileStore } from '@/stores/profile'


const router = useRouter()
const profile = useProfileStore()
const operator = ref('')
const actionProfileList = ref(['Создать профиль', 'Данные о паломнической службе', 'Реквизиты', 'FAQ', 'Туры паломнической службы'])

const activeTabName = ref(profile.tabList[0].title)
const isShowModal = ref(false)
const isCalendarOpen = ref(false)
const hasErrorAlert = ref(false)

const modalFields = reactive({
    name: '',
    description: '',
    email: '',
    phone: '',
    legal_name: '',
    opf: '',
    inn: '',
    ogrn: '',
    ogrn_date: '',
    kpp: '',
    okpo: '',
    legal_address: '',
    real_address: '',
    postal_address: ''
})

const activeTab = computed(() => {
    return profile.tabList.find(tab => tab.title === activeTabName.value)
})

const dashOffset = computed(() => {
    const circumference = 2 * Math.PI * 18;
    return circumference - (operator.value.profile_filled / 100) * circumference || 0;
});

function pickTab(tabTitle) {
    activeTabName.value = tabTitle
}

function showModal(){
    isShowModal.value = true
}
function closeModal(){
    isShowModal.value = false
}

async function sendForm() {
    try {
        await fixOperatorById(localStorage.getItem('tour_operator_id'), modalFields)
    }
    catch(error){
        profile.error = error.response?.data?.message || error.message
        console.error('Request failed:', profile.error)
        hasErrorAlert.value = true
        
        setTimeout(() => {
            hasErrorAlert.value = false
        }, 3000)
    }
}

onMounted(async () => {
    if(localStorage.getItem('tour_operator_id')){
        try {
            operator.value = await fetchOperator()
        } catch (error) {
            profile.error = error.response?.data?.message || error.message
            console.error('Request failed:', profile.error)
            hasErrorAlert.value = true
        
            setTimeout(() => {
                hasErrorAlert.value = false
            }, 3000)
        }

        for (const key in modalFields) {
            if (key !== 'isShowModal' && operator.value[key]) {
                modalFields[key] = operator.value[key]
            } else {
                modalFields[key] = operator.value['requisite'][key]
            }
        }
    } else {
        router.push({name: 'login'})
    }
})
</script>

<template>
    <div class="main-content">
        <div class="content">
            <div class="white-bg">
                <div class="page-header">
                    <h1 class="page-title-g"><img src="/svg/logo-prof.svg">{{ operator.name }}</h1>
                    <div class="actions">
                        <UButton 
                            text="Редактировать" 
                            variant="primary" 
                            size="big" 
                            action="normal" 
                            @click="showModal"
                        />
                    </div>
                </div>
                <UBanner>
                    <template #title>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</template>
                    <template #description>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus temporibus sit, impedit adipisci perferendis incidunt accusantium neque, fuga, molestiae harum quae maiores expedita beatae sapiente voluptatibus? Aut distinctio atque facilis!</template>
                </UBanner>
                <div class="bg-bread-proc">
                    <div class="circular-progress">
                        <div class="progress-circle">
                            <svg class="progress-ring" width="48" height="48" viewBox="0 0 48 48">
                                <circle class="progress-ring-circle-bg" cx="24" cy="24" r="18" stroke-width="6"
                                    fill="transparent" />
                                <circle class="progress-ring-circle" cx="24" cy="24" r="18" stroke-width="6"
                                    fill="transparent" stroke-dasharray="113.1" :stroke-dashoffset="dashOffset" />
                            </svg>
                        </div>
                        <div class="progress-description">
                            <h3>Профиль Паломнической службы заполнен на {{ operator.profile_filled }}%</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                ut labore et dolore magna aliqua.</p>
                        </div>
                    </div>
                    <div class="breadcrumbs">
                        <span 
                            v-for="(item, i) in actionProfileList"
                            :class="['breadcrumb-item']"
                        >
                            {{ (`${i+1}. ${item}`) }}
                            <span v-show="i < actionProfileList.length - 1">></span>
                        </span>
                    </div>
                </div>
                <div class="profile-tabs">
                    <div 
                        v-for="tab in profile.tabList"
                        :class="['tab', {'active': activeTabName === tab.title}]"
                        @click="pickTab(tab.title)"
                    >
                        {{ (`${tab.title.toUpperCase()}`) }}
                    </div>
                </div>
            </div>
            <component :is="activeTab.component" :operator="activeTab.title !== 'FAQ'? operator : ''" />
            <Users v-show="activeTab.title === profile.tabList[0].title" />
        </div>
    </div>

    <UModal v-show="isShowModal" @close="closeModal">
        <template #headerTitle>
            Редактирование
        </template>
        
        <template #bodyContent>
            <section class="base-info">
                <div class="base-info__title">Основная информация</div>
                <div class="base-info__block">
                    <label for="title">Название<span>*</span></label>
                    <UInput id="title" v-model="modalFields.name" :inputHeightPx="26" placeholder=""/>
                </div>
                <div class="base-info__block">
                    <label for="title">Описание</label>
                    <Textarea v-model="modalFields.description" class="textarea-style"/>
                </div>
            </section>
            <section class="contacts">
                <div class="contacts__title">Контакты</div>
                <div class="contacts__block">
                    <label for="email">Email</label>
                    <UInput id="email" v-model="modalFields.email" :inputHeightPx="26" placeholder=""/>
                </div>
                <div class="contacts__block">
                    <label for="phone">Телефон</label>
                    <UInput id="phone" v-model="modalFields.phone" :inputHeightPx="26" placeholder=""/>
                </div>
            </section>
            <section class="requisites">
                <div class="requisites__title">Реквизиты</div>
                <div class="requisites__block">
                    <label for="requisites">Юридическое наименование<span>*</span></label>
                    <UInput id="requisites" v-model="modalFields.legal_name" :inputHeightPx="26" placeholder=""/>
                </div>
                <div class="requisites__block">
                    <label for="opf">ОПФ (сокращенно)</label>
                    <UInput id="opf" v-model="modalFields.opf" :inputHeightPx="26" placeholder=""/>
                </div>
                <div class="requisites__block">
                    <label for="inn">ИНН</label>
                    <UInput id="inn" v-model="modalFields.inn" :inputHeightPx="26" placeholder=""/>
                </div>
                <div class="requisites__block">
                    <label for="ogrn">ОГРН</label>
                    <UInput id="ogrn" v-model="modalFields.ogrn" :inputHeightPx="26" placeholder=""/>
                </div>
                <div class="requisites__block">
                    <label for="ogrn">Дата ОГРН</label>
                    <div class="flex">
                    <Popover>
                        <PopoverTrigger as-child>
                        <Button variant="outline" class="w-full justify-start text-left font-normal flex gap-2" @click="isCalendarOpen = true">
                            <CalendarIcon class="mr-2 h-4 w-4" />
                            <span>{{ modalFields.ogrn_date || 'Выберите дату' }}</span>
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-auto p-0">
                            <AppDatePicker v-if="isCalendarOpen" v-model="modalFields.ogrn_date" @addDate="isCalendarOpen = false"/>
                        </PopoverContent>
                    </Popover>
                    <Button
                        v-if="modalFields.ogrn_date"
                        type="button"
                        variant="ghost"
                        size="sm"
                        @click="modalFields.ogrn_date = null"
                    >
                        <Trash2 class="h-4 w-4 text-destructive" />
                    </Button>
                </div>
                </div>
                <div class="requisites__block">
                    <label for="kpp">КПП</label>
                    <UInput id="kpp" v-model="modalFields.kpp" :inputHeightPx="26" placeholder=""/>
                </div>
                <div class="requisites__block">
                    <label for="okpo">ОКПО</label>
                    <UInput id="okpo" v-model="modalFields.okpo" :inputHeightPx="26" placeholder=""/>
                </div>
            </section>
            <section class="addresses">
                <div class="addresses__title">Адреса</div>
                <div class="addresses__block">
                    <label for="jur-address">Юридический адрес</label>
                    <UInput id="jur-address" v-model="modalFields.legal_address" :inputHeightPx="26" placeholder=""/>
                </div>
                <div class="addresses__block">
                    <label for="fac-address">Фактический адрес</label>
                    <UInput id="fac-address" v-model="modalFields.real_address" :inputHeightPx="26" placeholder=""/>
                </div>
                <div class="addresses__block">
                    <label for="mail-address">Почтовый адрес</label>
                    <UInput id="mail-address" v-model="modalFields.postal_address" :inputHeightPx="26" 
                    placeholder=""/>
                </div>
            </section>
        </template>
        
        <template #buttons>
            <UButton text="Отмена" size="small" variant="secondary" @click="closeModal"/>
            <UButton text="Сохранить" size="small" @click="sendForm"/>
        </template>
    </UModal>
    <Alert variant="destructive" v-show="hasErrorAlert" class="fixed top-4 right-4 w-[350px] p-2 z-50 shadow-lg">
        <AlertTitle>Ошибка!</AlertTitle>
        <AlertDescription>
            {{ profile.error }}
        </AlertDescription>
    </Alert>
</template>

<style lang="scss" scoped>
body {
    min-height: 100vh;
    background-color: #f9f9f9;
    transition: all 0.3s;
}

.white-bg {
    padding: 32px;
    background: #fff;
}

.circular-progress {
    display: flex;
    align-items: center;
    gap: 24px;
}

.bg-bread-proc {
    background: rgba(249, 249, 250, 1);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
}

.progress-circle {
    position: relative;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
}

.progress-ring {
    width: 48px;
    height: 48px;
    transform: rotate(-90deg);
}

.progress-ring-circle-bg {
    stroke: #F1F1F4;
    stroke-width: 6;
    fill: transparent;
    r: 18;
    cx: 24;
    cy: 24;
}

.progress-ring-circle {
    stroke: #10B981;
    stroke-width: 6;
    fill: transparent;
    r: 18;
    cx: 24;
    cy: 24;
}

.progress-description h3 {
    font-size: 18px;
    font-weight: 500;
    color: #353535;
    margin-bottom: 8px;
}

.progress-description p {
    font-size: 14px;
    color: #6A6E75;
    line-height: 1.4;
    font-weight: 400;
    margin: 0;
}

.profile-tabs {
    display: flex;
    border-bottom: 1px solid #E2E8F0;
}

.tab {
    padding: 12px 16px;
    font-weight: 500;
    color: #6A6E75;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    padding-bottom: 12px;
}

.tab.active {
    color: #10B981;
}

.tab.active:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #10B981;
}

.tab:hover {
    color: #10B981;
}

.breadcrumbs {
    display: flex;
    border-top: 1px solid rgba(212, 214, 217, 1);
    margin-top: 20px;
    padding-top: 20px !important;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 14px;
    color: #6A6E75;
    background: transparent;
}

.breadcrumb{
    &-item {
        padding: 0;
        border-radius: 0;
        background: transparent;
        color: #6A6E75;

        &.active {
            background: transparent;
            color: #10B981;
            font-weight: 500;
        }
    }

    &-separator {
        color: #D1D5DB;
        margin: 0 4px;
    }
}

/* Стили карточек */
.page-title-g img {
    float: left;
    margin: -3px 15px 0px 0px;
}

.page-title-g {
    max-width: 800px;
    white-space: normal;
}

.main-content {
    flex: 1;
    margin-left: 250px;
    transition: all 0.3s;
    min-width: 0;
}

.content {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 15px;
}

.actions {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}
.base-info, .contacts, .requisites {margin-bottom: 20px;}
.base-info, .contacts, .requisites, .addresses {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__title {
        font-size: 16px;
    }
    &__block {
        display: flex;
        flex-direction: column;
        
        & label {
            font-size: 14px;
        }
    }
}

.requisites {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    &__title {
        grid-column: 1/4;
    }

    &__block {
        &:nth-child(2) {
            grid-column: 1/4;
        }
        &:nth-child(3) {
            grid-column: 1/4;
        }
        &:last-child {
            grid-column: 2/4;
        }
    }
}
label span {
    color: red;
}
.textarea-style{
    padding: 5px 10px;
    max-width: 596px;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
