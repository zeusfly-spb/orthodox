<script setup>

import { defineProps } from 'vue';

const props = defineProps({
    managers: Array
})

</script>

<template>
    <div class="users-view table-view active">
        <div class="table-wrapper2">
            <table class="users-table">
                <thead>
                    <tr>
                        <th>Имя пользователя</th>
                        <th>Теги</th>
                        <th style="width: 100px;"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="manager in props.managers" :key="manager.id">
                        <td>
                            <div class="user-info2">
                                <div class="user-avatar2"><img :src="manager.avatar || '/svg/unknown-user.svg'"></div>
                                <div>
                                    <div class="user-name2">{{ manager.name }}</div>
                                    <div class="user-role" v-for="role in manager.roles">{{ role.name }}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="tags-container">
                                <span class="tag">Lorem ipsum dolor</span>
                                <span class="tag-gr">Lorem ipsum dolor</span>
                            </div>
                        </td>
                        <td>
                            <div class="actions-container">
                                <div class="user-actions">
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
    display: flex;
    align-items: center;
    gap: 4px;
    color: #6A6E75;
    font-size: 14px;
    cursor: pointer;
    padding: 8px;
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

.users-view {
    display: none;
}

.users-view.active {
    display: block;
}

/* Табличное представление */
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

.user-role {
    font-size: 12px;
    color: #6A6E75;
    margin-top: 5px;
    font-weight: 400;
    font-style: Regular;
    font-size: 14px;
    line-height: 20px;
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
    color: #10B981;
    border-radius: 44px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 500;
}

.tag-gr {
    background: rgba(106, 110, 117, 0.12);
    color: rgba(106, 110, 117, 1);
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

.edit-btn:hover svg path,
.more-btn:hover svg path {
    fill: #10B981;
}

.edit-column {
    position: sticky;
    right: 0;
    background: white;
    border-left: 1px solid #E2E8F0;
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

/* Блочное представление */
.users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}

.user-card {
    background: #F9FAFB;
    border-radius: 12px;
    padding: 16px;
    position: relative;
}

.user-card .user-info2 {
    margin-bottom: 12px;
}

.user-card .edit-btn {
    position: absolute;
    top: 16px;
    right: 16px;
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
    display: none;
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
</style>