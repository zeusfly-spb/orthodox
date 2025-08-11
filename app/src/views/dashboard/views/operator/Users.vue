<script setup>

import { defineProps, ref, onMounted, shallowRef, reactive } from 'vue'
import UButton from '@/components/ui/UButton.vue'
import UInput from '@/components/ui/UInput.vue'
import UModal from '@/components/ui/UModal.vue'
import { fetchManagers } from '@/api/operators'
import UsersInTable from './UsersInTable.vue'
import UsersInBlock from './UsersInBlock.vue'
import { pushManagers } from '@/api/operators'


const props = defineProps({
    operator: Object,
})

const managers = ref('')
const filteredManagers = ref('')
const searchQuery = ref('')
const viewSelected = shallowRef('table')
const sortTypeList = shallowRef(['Новые пользователи', 'Имя пользователя', 'Тег'])
const sortType = shallowRef(sortTypeList.value[0])
const isSortTypeListOpened = shallowRef(false)
const isModalOpen = shallowRef(false)

function filter() {
    if (!managers.value || !searchQuery.value) {
        filteredManagers.value = managers.value || [];
        return;
    }
    
    filteredManagers.value = managers.value.filter((item) => 
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
}

const mainInfo = ref([
    {title: 'Фамилия', id: 'second-name', value: ''},
    {title: 'Имя', id: 'first-name', value: ''},
    {title: 'Отчество', id: 'third-name', value: ''}
])

const contacts = reactive(
{
    phone: ''
},
{
    email: ''
})

const emit = defineEmits(['close'])

async function sendManager(){
    await pushManagers({
        avatar: '',
        email: contacts.email,
        firstname: mainInfo.value[1].value,
        lastname: mainInfo.value[0].value,
        patronymic: mainInfo.value[2].value,
        phone: contacts.phone
    })
    closeModal()
}

function closeModal(){
    isModalOpen.value = false
    getManagers()
}

function selectSortType(type){
    sortType.value = type
    // filteredManagers.sort((a, b) => a.age - b.age)
    isSortTypeListOpened.value = false
}

async function getManagers(){
    managers.value = await fetchManagers()
    filteredManagers.value = managers.value;
}

onMounted(() => {
    getManagers()
})
</script>
<template>
<div class="users-section">
    <div class="users-header">
        <div class="users-title">
            <h3>ПОЛЬЗОВАТЕЛИ</h3>
            <span class="users-count">{{ filteredManagers.length }}</span>
        </div>

        <div class="users-toolbar">
            <div class="search-container">
                <UInput 
                    placeholder="Поиск по пользователям"
                    svgPath="/svg/search.svg" 
                    v-model="searchQuery"
                    @input="filter"
                />
                <UButton text="Добавить пользователя" @click="isModalOpen = true" />
            </div>
            <div class="view-controls">
                <div class="sort-dropdown2">
                    <span @click="isSortTypeListOpened = !isSortTypeListOpened">Сортировать по: {{ sortType }}</span>
                    <svg @click="isSortTypeListOpened = !isSortTypeListOpened" width="16" height="16" viewBox="0 0 16 16" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6L8 10L12 6" stroke="#6A6E75" stroke-width="1.5"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <ul class="sort-dropdown2__list" v-show="isSortTypeListOpened">
                        <li 
                            v-for="type in sortTypeList" 
                            v-show="type !== sortType"
                            @click="selectSortType(type)"
                        >
                            {{ type }}
                        </li>
                    </ul>
                </div>

                <div class="view-toggle">
                    <button :class="['view-btn', {'active': viewSelected === 'table'}]" data-view="table" @click="viewSelected = 'table'">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 5.5H17.5M2.5 10H17.5M2.5 14.5H17.5" :stroke="viewSelected === 'table'? '#10B981': '#6A6E75'"
                                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <button :class="['view-btn', {'active': viewSelected === 'blocks'}]" data-view="blocks" @click="viewSelected = 'blocks'">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="6" height="6" rx="1" :stroke="viewSelected === 'blocks'? '#10B981': '#6A6E75'"
                                stroke-width="1.5" />
                            <rect x="11" y="3" width="6" height="6" rx="1" :stroke="viewSelected === 'blocks'? '#10B981': '#6A6E75'"
                                stroke-width="1.5" />
                            <rect x="3" y="11" width="6" height="6" rx="1" :stroke="viewSelected === 'blocks'? '#10B981': '#6A6E75'"
                                stroke-width="1.5" />
                            <rect x="11" y="11" width="6" height="6" rx="1" :stroke="viewSelected === 'blocks'? '#10B981': '#6A6E75'"
                                stroke-width="1.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Табличное представление -->
    <UsersInTable v-show="viewSelected === 'table'" :managers="filteredManagers"/>

    <!-- Блочное представление -->
    <UsersInBlock v-show="viewSelected === 'blocks'" :managers="filteredManagers"/>

    <UModal v-show="isModalOpen" @close="closeModal">
        <template #headerTitle>
            Добавление пользователя
        </template>
        
        <template #bodyContent>
            <section class="main-info">
                <div class="main-info__input" v-for="item in mainInfo">
                    <label :for="item.id">{{ item.title }} <span>*</span></label>
                    <UInput :id="item.id" v-model="item.value" :inputHeightPx="36" placeholder="Заполните" />
                </div>
            </section>
            <section class="contact-info">
                <div class="main-info__input">
                    <label for="phone">Телефон <span>*</span></label>
                    <UInput id="phone" :inputHeightPx="36" placeholder="Заполните" v-model="contacts.phone"/>
                </div>
                <div class="main-info__input">
                    <label for="email">Email <span>*</span></label>
                    <UInput id="email" :inputHeightPx="36" placeholder="Заполните" v-model="contacts.email"/>
                </div>
            </section>
        </template>
        
        <template #buttons>
            <UButton text="Отмена" size="small" variant="secondary" @click="closeModal"/>
            <UButton text="Сохранить" size="small" @click="sendManager"/>
        </template>
    </UModal>
    
</div>
</template>

<style scoped lang="scss">
/* Пользователи */
.users-section {
    background: white;
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
    background: #F1F1F4;
    color: #6A6E75;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 44px;
}

.users-toolbar {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.search-container {
    display: flex;
    gap: 16px;
    width: 100%;
}

.add-user-btn {
    white-space: nowrap;
}

.view-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sort-dropdown2 {
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
    color: #6A6E75;
    font-size: 14px;
    cursor: pointer;
    padding: 8px;

    &__list {
        width: 165px;
        padding: 10px;
        position: absolute;
        top: 30px;
        left: 118px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color:#10B981;
        border-radius: 12px;
        color: #FFFFFF;
    }
}

.view-toggle {
    display: flex;
    gap: 8px;
    background: #F9FAFB;
    border-radius: 8px;
    padding: 4px;
}

.view-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.view-btn.active {
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.view-btn.active svg path {
    stroke: #10B981;
}

/* Стили для выпадающего меню */
.actions-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
    min-width: 200px;
    // display: none;
}

.actions-dropdown.active {
    display: block;
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
    color: #10B981;
}

.actions-container {
    position: relative;
}


label {
    font-size: 14px;
    & span {
        color: red;
    }
}
.wrapper {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.582);
    z-index: 5;
}

.modal {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-radius: 10px;
    background-color: white;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__right {
        cursor: pointer;
    }
}

.main-info {
    display: flex;
    gap: 15px;

    &__input {
        width: 100%;
    }
}

.contact-info {
    display: flex;
    width: 100%;
    gap: 10px;
}

.buttons {
    display: flex;
    gap: 20px;
    align-self: flex-end;
}
</style>