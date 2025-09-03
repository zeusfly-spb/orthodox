<script setup>

import { ref, defineEmits, defineProps } from 'vue';

const props = defineProps({
    id: String,
    inputType: {
        type: String,
        default: 'text',
        validator: (value) => [
        'text',
        'password',
        'email'
        ].includes(value)
    },
    firstIconPath: String,
    secondIconPathBefore: String,
    secondIconPathAfter: String,
    placeholder: String,
    size:{
        type: String,
        default: 'big',
        validator: (value) => [
        'big',
        'medium',
        'small'
        ].includes(value)
    },
})

const isActive = ref(false)
const text = ref('')
const emit = defineEmits('update')

function sendEmit(){
    emit('update', text.value)
}

function inFocus(){
    isActive.value = true
}

function outFocus(){
    if(!text.value){
        isActive.value = false
    }
}
</script>
<template>
    <div class="input-wrapper">
        <input 
            :type="inputType" 
            :class="['input', `input-${size}`]"
            v-model="text"
            @input="sendEmit"
            :id="props.id"
            @focus="inFocus"
            @blur="outFocus"
        />
        <label 
            class="input-wrapper__placeholder left"
            :for="props.id"
            v-show="props.firstIconPath"
        >
            <img :src="props.firstIconPath" />
        </label>
        <label 
            :class="['input-wrapper__placeholder center', {'active': isActive}]"
            :for="props.id"
            v-show="props.placeholder"
        >
            <span>{{ props.placeholder }}</span>
        </label>
        <label 
            class="input-wrapper__placeholder right"
            :for="props.id"
            v-show="!isActive && props.secondIconPathAfter"
        >
            <img :src="props.secondIconPathBefore" />
        </label>
        <label 
            class="input-wrapper__placeholder right"
            v-show="isActive && props.secondIconPathAfter"
            :for="props.id"
        >
        <div class="input-wrapper__placeholder-block-after">
            <img :src="props.secondIconPathAfter" />
        </div>
        </label>
        
    </div>
</template>
<style lang="scss" scoped>
.input {
    padding: 20px 0 0 52px;
    outline: 1px solid #D4D6D9;
    border: none;
    border-radius: 12px;
    font-weight: 400;
    font-size: 16;
    font-size: 16px;
    color: #353535;

    &-big{
        width: 100%;
        height: 56px;
    }
    &-medium{
        width: 100%;
        height: 48px;
    }
    &-small{
        width: 100%;
        height: 36px;
    }

    &:focus {
        border: none
    }

    &-wrapper {
        position: relative;
        width: 100%;

        &__placeholder {
            position: absolute;
            top: calc(100% / 2 - 9px);
            
            &.left{
                left: 24px;
            }
            &.center{
                color: #6A6E75;
                left: 52px;
                transition: ease-in .3s;

                &.active {
                    font-size: 14px;
                    top: calc(100% / 2 - 15px);
                    transition: ease-in .3s;
                }
            }
            &.right{
                right: 24px;
            }

            &-block {
                height: 16px;
                display: flex;
                gap: 12px;
                top: calc(100% / 2 - 9px);
                left: 24px;

                & .active {
                    font-weight: 400;
                    font-size: 12px;
                    top: calc(100% / 2);
                    transition: .3s;
                }

                &-after {
                    right: 0;
                }
            }
        }
    }
}
</style>