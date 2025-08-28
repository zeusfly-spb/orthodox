<script setup>

import { defineEmits } from 'vue'

const emit = defineEmits(['close'])

</script>
<template>
    <div class="wrapper" @click="emit('close')">
        <div class="modal" @click.stop>
            <header class="modal__header">
                <div class="modal__left">
                    <slot name="headerTitle"></slot>
                </div>
                <div class="modal__right" @click="emit('close')">
                    <img src="/svg/cross.svg" alt="close">
                </div>
            </header>
            <section class="main-info">
                    <slot name="bodyContent"></slot>
            </section>
            <section class="buttons">
                    <slot name="buttons"></slot>
            </section>
        </div>
    </div>
</template>
<style scoped lang="scss">
.wrapper {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.582);
    z-index: 50;
}

.modal {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-radius: 10px;
    background-color: white;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__right {
        cursor: pointer;
    }
}

.main-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.buttons {
    width: 100%;
}
</style>