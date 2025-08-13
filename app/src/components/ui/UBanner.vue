<script setup>

import { ref } from 'vue';

const isOpened = ref(true)
</script>

<template>
<div class="hide-banner" v-show="isOpened">
    <div><img src="/svg/hide-b.svg"></div>
    <div>
        <div class="title-banners"><slot name="title"></slot></div>
        <div class="desc-banners"><slot name="description"></slot>&nbsp;</div>
    </div>
    <img src="/svg/cancel.svg" class="absl-cancel" @click="isOpened = false">
</div>
</template>

<style scoped>
.title-banners {
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    color: rgba(53, 53, 53, 1);
}

.desc-banners {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: rgba(106, 110, 117, 1);
}

.hide-banner {
    background: rgba(249, 249, 250, 1);
    -webkit-border-radius: 16px;
    -moz-border-radius: 16px;
    border-radius: 16px;
    padding: 24px;
    display: grid;
    position: relative;
    grid-template-columns: 50px 1fr;
    grid-gap: 24px;
    margin-bottom: 24px;
}

.absl-cancel {
    position: absolute;
    right: 24px;
    top: 24px;
}
</style>