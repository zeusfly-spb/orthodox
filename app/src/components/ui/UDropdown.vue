<script setup>

import { defineProps, defineEmits, reactive } from 'vue';

const props = defineProps({
    initValue: String,
    list: Array,
})

const emit = defineEmits(['update:modelValue'])

const dropdown = reactive({
    isShowList: false,
    selectedItem: props.initValue
})

function selectItem(item){
    dropdown.selectedItem = item
    emit('update:modelValue', item)
}
</script>

<template>
    <div class="dropdown" @click.stop="dropdown.isShowList = !dropdown.isShowList">
        <div type="text" class="dropdown__input">
            {{ dropdown.selectedItem }} 
            <img :class="{'inverse': dropdown.isShowList}" src="/svg/arrow-down.svg" alt="open list">
        </div>
        <ul class="dropdown__list" v-show="dropdown.isShowList">
            <li 
                v-for="item in props.list"
                v-show="item !== dropdown.selectedItem"
                class="dropdown__item"
                @click="selectItem(item)"
            >
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.dropdown {
    position: relative;

    &__input {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
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

        &:hover {
            border-color: #94a3b8;
        }

        & img{
            width: 10px;
            transition: ease .3s;
        }
    }

    &__list {
        width: 100%;
        padding: 5px;
        position: absolute;
        top: 100%;
        left: 0;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        margin-top: 5px;
        background-color: #f8fafc;
    }

    &__item {
        padding: 5px;

        &:hover {
            background-color: #94a3b8;
            transition: ease .3s;
        }
    }
}
.inverse{
    transform: rotate(180deg);
    transition: ease .3s;
}
</style>