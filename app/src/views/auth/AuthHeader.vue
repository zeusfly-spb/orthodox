<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    title: String,
    description: String
})
</script>
<template>
    <div class="header">
        <div class="header-title">
            {{ props.title }}
        </div>
        <div class="header-description">
            {{ props.description }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.header {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &-title {
        font-weight: 500;
        font-size: 32px;
        background-color: #fff;
    }

    &-description {
        font-weight: 400;
        font-size: 14px;
        background-color: #fff;
        color: #717173;
        line-height: 22px;
    }
}
</style>