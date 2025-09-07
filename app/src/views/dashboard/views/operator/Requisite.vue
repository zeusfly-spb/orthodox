<script setup>

import { reactive, defineProps } from 'vue'

const props = defineProps({
    operator: Object,
})

const requisiteList = reactive([
    {title: 'Наименование юридического лица', value: props.operator.requisite.legal_name},
    {title: 'Реестровый номер', value: ''},
    {title: 'Индивидуальный Номер Налогоплательщика', value: props.operator.requisite.inn},
    {title: 'Основной Государственный Регистрационный Номер', value: props.operator.requisite.legal_name},
    {title: 'Банк', value: props.operator.requisite.legal_name},
    {title: 'Корреспондентский счёт', value: props.operator.requisite.legal_name},
    {title: 'Расчётный счёт', value: props.operator.requisite.legal_name},
])

</script>
<template>
    <div class="tab-content active" id="requisites-tab">
        <div class="profile-section">
            <div class="table-wrapper2">
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>Наименование реквизита</th>
                            <th>Перевозчик</th>
                            <th style="width: 100px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div class="name-rek">
                                    {{ props.operator.requisite.legal_name }}
                                </div>
                            </td>
                            <td>
                                <div class="desc-rekv">Паломническая служба 1</div>
                            </td>
                            <td>
                                <div class="actions-container">
                                    <div class="user-actions">
                                        <button class="copy-btn">
                                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M6.25 3.125C6.25 2.77982 6.52982 2.5 6.875 2.5H16.875C17.2202 2.5 17.5 2.77982 17.5 3.125V13.125C17.5 13.4702 17.2202 13.75 16.875 13.75H13.125C12.7798 13.75 12.5 13.4702 12.5 13.125C12.5 12.7798 12.7798 12.5 13.125 12.5H16.25V3.75H7.5V6.875C7.5 7.22018 7.22018 7.5 6.875 7.5C6.52982 7.5 6.25 7.22018 6.25 6.875V3.125Z"
                                                    fill="#353535" />
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M2.5 6.875C2.5 6.52982 2.77982 6.25 3.125 6.25H13.125C13.4702 6.25 13.75 6.52982 13.75 6.875V16.875C13.75 17.2202 13.4702 17.5 13.125 17.5H3.125C2.77982 17.5 2.5 17.2202 2.5 16.875V6.875ZM3.75 7.5V16.25H12.5V7.5H3.75Z"
                                                    fill="#353535" />
                                            </svg>
                                        </button>
                                        <button class="edit-btn">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1.5 12.375V15H4.125L12.91 6.215L10.285 3.59L1.5 12.375ZM14.5325 4.2175C14.825 3.925 14.825 3.45 14.5325 3.1575L12.3425 0.9675C12.05 0.675 11.575 0.675 11.2825 0.9675L9.6475 2.6025L12.2725 5.2275L14.5325 4.2175Z"
                                                    fill="#6A6E75" />
                                            </svg>
                                        </button>
                                        <button class="more-btn">
                                            <svg width="4" height="16" viewBox="0 0 4 16" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z"
                                                    fill="#6A6E75" />
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
            <div class="pagination-all">
                <div class="nmumber-itt">1/2</div>
                <div class="pagination">
                    <button class="page-btn">Назад</button>
                    <button class="page-btn active">Далее</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
:root {
    --primary-color: #4CAF50;
    --primary-hover: #3e8e41;
    --text-color: #333;
    --light-gray: #f5f5f5;
    --border-color: #ddd;
    --sidebar-width: 250px;
    --collapsed-sidebar: 80px;
}
.requisites-form {
    max-width: 800px;
    margin: 0 auto;
}

.requisites-row {
    display: flex;
    margin-bottom: 16px;
    align-items: center;
}

.requisites-label {
    width: 350px;
    font-weight: 500;
    color: #6A6E75;
    font-size: 14px;
    flex-shrink: 0;
}

.requisites-value {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: #F9FAFB;
    border-radius: 8px;
    font-size: 14px;
    color: #353535;
}

.requisites-actions {
    display: flex;
    gap: 8px;
    margin-left: 16px;
}

.requisites-timer,
.requisites-check,
.requisites-more {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
}

.requisites-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #E2E8F0;
}

.requisites-buttons {
    display: flex;
    gap: 12px;
}

.requisites-btn {
    padding: 8px 16px;
    background: #F1F1F4;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #353535;
}

.requisites-btn:hover {
    background: #E2E8F0;
}

.profile-section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.table-wrapper2 {
    overflow-x: auto;
}
.users-table {
    width: 100%;
    border-collapse: collapse;
}

.users-table th {
    text-align: left;
    padding: 12px 16px;
    background: #F9FAFB;
    font-weight: 500;
    color: #6A6E75;
    font-size: 12px;
    text-transform: uppercase;
}

.users-table td {
    padding: 16px;
    border-bottom: 1px solid #E2E8F0;
    vertical-align: middle;
}

.desc-rekv {
    font-weight: 500;
    font-style: Medium;
    font-size: 14px;
    line-height: 100%;
    color: rgba(53, 53, 53, 1);
}

.name-rek {
    font-weight: 400;
    font-style: Regular;
    font-size: 14px;
    line-height: 20px;
    color: rgba(53, 53, 53, 1);
}
.actions-container {
    position: relative;
}

.user-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}
.copy-btn:hover {
    color: #4CAF50;
}

.edit-btn,
.more-btn,
.copy-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

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
    display: none;
}

.actions-dropdown.active {
    display: block;
}

.pagination-all {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 30px;
    align-self: center;
    align-items: center;
    grid-gap: 24px;
}

.nmumber-itt {
    font-weight: 500;
    font-style: Medium;
    font-size: 14px;
    line-height: 20px;
    color: rgba(106, 110, 117, 1);
}

.pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 0px;
    gap: 10px;
    flex-wrap: wrap;
}

.page-btn:hover {
    background: #fff;
    color: rgba(16, 185, 129, 1);
    border-color: rgba(16, 185, 129, 1);
}

.page-btn {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    background: white;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 500;
    font-style: Medium;
    font-size: 13px;
    line-height: 24px;
    white-space: nowrap;
}

.page-btn.active {
    background: #fff;
    color: rgba(16, 185, 129, 1);
    border-color: rgba(16, 185, 129, 1);
}
</style>