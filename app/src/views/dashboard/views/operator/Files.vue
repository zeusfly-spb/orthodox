<script setup>

import { onMounted, ref } from 'vue';
import { fetchFiles } from '@/api/files'
import { format } from 'date-fns';

const files = ref('')
const titleList = ['Наименование документа', 'Пользователи, имеющие доступ', 'Дата загрузки', '']

onMounted(async() => {
    files.value = await fetchFiles()
})
</script>

<template>
<div class="tab-content" id="files-tab">
    <div class="profile-section">
        <div class="table-wrapper2">
            <table class="users-table">
                <thead class="users-table__head">
                    <tr class="users-table__title">
                        <th v-for="title in titleList" >{{ title }}</th>
                    </tr>
                </thead>
                <tbody class="users-table__body">
                    <tr v-for="file in files" class="users-table__body-row">
                        <td>
                            <div class="name-dog">
                                <div><img src="/svg/dog.svg"></div>
                                <div>
                                    <div class="name-dogov-tab">{{ file.original_name }}</div>
                                    <!-- <div class="avtor-dog-tab">Автор: Олег Киселев </div> -->
                                </div>
                            </div>
                        </td>
                        <td>
                            <!-- <div class="stacked-avatars2">
                                <div class="avatar3">MK</div>
                                <div class="avatar3">OB</div>
                                <div class="avatar3">MM</div>
                                <span class="plus-count">+4</span>
                            </div> -->
                        </td>
                        <td>
                            <div class="date-rekz">{{ format(new Date(file.updated_at), 'dd.MM.yyyy') }}</div>
                        </td>
                        <td>
                            <div class="actions-container">
                                <div class="user-actions">
                                    <button class="edit-btn">
                                        <img src="/svg/pencil.svg" alt="edit">
                                    </button>
                                    <button class="more-btn">
                                        <img src="/svg/more-horiz.svg" alt="edit">
                                    </button>
                                </div>
                                <!-- <div class="actions-dropdown">
                                    <a href="#" class="dropdown-item">Очистить сессию</a>
                                    <a href="#" class="dropdown-item">Войти как</a>
                                    <a href="#" class="dropdown-item">Изменить пароль</a>
                                    <a href="#" class="dropdown-item">Деактивировать</a>
                                    <a href="#" class="dropdown-item">Удалить пользователя</a>
                                </div> -->
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- <div class="pagination-all">
            <div class="nmumber-itt">1/2</div>
            <div class="pagination">
                <button class="page-btn">Назад</button>
                <button class="page-btn active">Далее</button>
            </div>
        </div> -->
    </div>
</div>
</template>

<style scoped lang="scss">
/*FAQ*/
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
    border: 2px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
    position: relative;
    margin-left: -10px;
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

.users-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid #F1F1F4;
    border-radius: 12px;
    overflow: hidden; 
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    background: white;

    &__head {
        height: 44px;
        text-align: left;
        background-color: #F9F9FA;
    }

    &__title {
        font-weight: 500;
        font-size: 11px;
        line-height: 16px;
        text-transform: uppercase;
        color: #6A6E75;

        & th {
            &:first-child {
                padding: 0 16px;
            }
            &:last-child {
                width: 100px;
                padding: 0 16px;
            }
        }
    }

    &__body-row {
        height: 76px;
        & td {
            &:first-child {
                padding: 0 16px;
            }
            &:last-child {
                width: 100px;
                padding: 0 16px;
            }
        }
    }
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

.user-actions {
    display: flex;
    gap: 16px;
}

/* Пагинация */
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

/* Main content styles */
.main-content {
    flex: 1;
    margin-left: 250px;
    transition: all 0.3s;
    min-width: 0;
}

/* Table styles */
.table-wrapper2 {
    overflow-x: auto;
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
</style>
