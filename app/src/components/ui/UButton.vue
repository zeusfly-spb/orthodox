<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    text: String,
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => [
        'primary',
        'secondary',
        ].includes(value)
    },
    size: {
        type: String,
        default: 'medium',
        validator: (value) => [
        'big',
        'medium',
        'small',
        ].includes(value)
    },
    action: {
        type: String,
        default: 'normal',
        validator: (value) => [
        'normal',
        'disabled',
        'warning'
        ].includes(value)
    },
    svgPath: {
        type: String,
        default: ''
    }
})

</script>
<template>
    <button :class="[`btn ${props.variant}-${props.action} ${props.size}`, {'spbn': props.svgPath}]">
        <img v-if="props.svgPath" :src="props.svgPath" alt="icon">
        {{ props.text }}
    </button>
</template>
<style lang="scss" scoped>
.btn{
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
}
.primary{
    &-normal{
        border: none;
        background-color: #10B981;
        color: #FFFFFF;

        &:hover{
            background-color: #13A575;
            transition: .3s;
        }
        &:focus{
            background-color: #149168;
        }
    }
    &-disabled{
        background-color: #EBEDEF;
        color: #8F95B2;
    }
    &-warning{
        background-color: red;
        color: #EBEDEF;
    }
}

.secondary{
    &-normal{
        background-color: #fff;
        color: #10B981;
        border: 1px solid #10B981;

        &:hover{
            color: #13A575;
            border-color: #13A575;
            transition: .3s;
        }
        &:focus{
            color: #149168;
            border-color: #149168;
        }
    }
    &-disabled{
        border: 1px solid #D4D6D9;
        color: #9FA6AF;
    }
    &-warning{
        background-color: white;
        border: 1px solid #D14343;
        color: #D14343;
    }
}

.small{
    padding: 6px 20px;
    height: 36px;
    border-radius: 10px;
}
.medium{
    padding: 12px 28px;
    height: 48px;
    border-radius: 12px;
}
.big{
    padding: 16px 32px;
    height: 56px;
    border-radius: 12px;
}
.spbn{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>