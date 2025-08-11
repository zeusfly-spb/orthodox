<script setup>

import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isOpened = ref(false)
const dropdownList = ref([
    {
        link:'',
        name: 'Настройки'
    },
    {
        link:'',
        name: 'Сообщения'
    },
    
])

function handleLogout() {
    authStore.logout()
    localStorage.removeItem('tour_operator_id')
    router.push({ name: 'login' });
}
</script>
<template>
    <div class="top-bar">
            <div></div>
            <div class="user-panel">
                <div class="notification">
                    <img src="/svg/Bell.svg" alt="">
                    <span class="notification-badge"></span>
                </div>
                <div class="user-info" @click="isOpened = !isOpened">
                    <img class="user-avatar" :src="authStore.user?.avatar || '/svg/unknown-user.svg'">
                    <div class="user-name">{{ `${authStore.user?.full_name || 'unknown'}` }}</div>
                    <img :class="['verse', {'inverse': isOpened}]" src="/svg/arrow-down.svg">
                </div>
                    <ul :class="['dropdown-menu', `${isOpened? 'opened' : 'closed'}`]">
                        <li v-for="item in dropdownList" class="dropdown-menu__item">
                            <router-link :to="item.link">{{ item.name }}</router-link>
                        </li>
                        <li @click="handleLogout" class="dropdown-menu__item">Выход</li>
                    </ul>
            </div>
        </div>
</template>

<style lang="scss" scoped>
@media (max-width: 768px) {
    .top-bar {
        padding: 15px;
    }
    .actions {display:block;}
    .actions .btn {margin-bottom:15px !important;width:100%;min-width: 100% !important;}
    .notification {
        margin-right: 10px;
    }
}
        
.top-bar {
    font-family: 'Inter', sans-serif;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    background: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1;
    transition: .3s;
}
.user{
    &-info{
        position: relative;
        z-index: 3;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        background-color: white;
    }
    &-avatar{
        height: 42px;
        border-radius: 50%;
    }
    &-panel{
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        gap: 8px;
    }
    &-name{
        font-weight: 400;
        font-size: 14px;
    }
}
.notification {
        display: flex;
        justify-content: center;
        align-items: center;
}
.dropdown-menu{
        font-weight: 400;
        font-size: 14px;
        line-height: 30px;
        position: absolute;
        right: 0px;
        border: 1px solid black;
        border-radius: 10px;
        padding: 10px;
        background-color: white;
        transition: .3s;
    &.opened{
        top: 60px;
        transition: .3s;
    }
    &.closed{
        top: 0;
        height: 0;
        line-height: 0;
        z-index: 0;
        transition: .3s;
    }
    &__item{
        cursor: pointer;
    }
}
.verse{
    transition: .3s;
}
.inverse{
    transform: rotate(180deg);
    transition: .3s;
}
</style>