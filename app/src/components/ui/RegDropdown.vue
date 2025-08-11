<script setup>
import { defineEmits, ref, computed, defineProps, shallowRef } from 'vue';

const props = defineProps({
    list: {
        type: Object,
        require: true
    },
    placeholder: {
        type: String,
        default: ''
    }
})
const isShow = shallowRef(false)
const selectedService = shallowRef('')
const searchQuery = ref('')

const emit = defineEmits('update');

function closeDropdown(){
    isShow.value = false
    searchQuery.value = ''
}

function selectService(key, value){
    selectedService.value = value
    emit('update', key)
    closeDropdown()
}

const filteredList = computed(() => {
  return Object.entries(props.list).filter(([key, value]) => 
    String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

</script>
<template>
<div class="dropdown" @click.stop="isShow = true">
    <div v-if="!selectedService" class="dropdown__placeholder">
        <div class="dropdown__placeholder-block">
            <img src="/svg/man-list.svg" />
            <span>Паломническая служба</span>
        </div>
        <img src="/svg/arrow-down.svg" :class="['arrow', {'inversion': isShow}]"/>
    </div>
    <div v-else class="dropdown__value">{{ selectedService }}</div>
    <ul v-show="isShow" class="dropdown__list">
        <div class="dropdown__list-block">
            <div class="dropdown__search-wrapper">
                <input type="text" placeholder="Поиск по паломническим службам..." class="dropdown__search" v-model="searchQuery"/>
                <img src="/svg/search.svg" alt="search" class="search-icon">
            </div>
            <img src="/svg/cross.svg" alt="cross" class="dropdown__close" @click.stop="closeDropdown" />
        </div>
        <li 
            v-for="[key, value] in filteredList" 
            @click.stop="selectService(key, value)"
            class="dropdown__item"
        >{{ value }}</li>
    </ul>
</div>
</template>

<style lang="scss" scoped>

.dropdown {
    width: 100%;
    height: 56px;
    font-weight: 400;
    font-size: 16;
    position: relative;
    padding: 10px 23px;
    outline: 1px solid #D4D6D9;
    border: none;
    border-radius: 12px;
    text-overflow: ellipsis;

    &:focus {
        border: none
    }

    &__value {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    &__placeholder {
        width: calc(100% - 48px);
        position: absolute;
        display: flex;
        justify-content: space-between;
        top: calc(100% / 2 - 9px);
        left: 24px;
        color: #6A6E75;

        &-block {
            display: flex;
            gap: 12px;
            top: calc(100% / 2 - 9px);
            left: 24px;
        }
    }
    &__list{
        width: 100%;
        height: 400px;
        position: absolute;
        z-index: 2;
        top: 57px;
        left: 0;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: #FFFFFF;
        border: #F1F1F4;
        border-radius: 16px;
        overflow-y: scroll;
        overflow-x: hidden;

        &-block{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
    &__search{
        height: 50px;
        width: 90%;
        padding: 16px 16px 16px 52px;
        border-radius: 12px;
        border: 1px solid #D4D6D9;
        outline: none;
        &::placeholder{
            font-weight: 400;
            font-size: 14;
        }
        &-wrapper{
            width: 100%;
            position: relative;
        }
    }
    &__close{
        width: 15px;
        height: 15px;
    }
    &__item{
        cursor: pointer;

        &:hover{
            color: #10B981;
        }
    }
}
.search-icon{
    position: absolute;
    top: calc(100% / 2 - 10px);
    left: 20px;
}
.arrow{
    transition: .3s;
}
.inversion{
    transform: rotate(180deg);
    transition: .3s;
}
</style>