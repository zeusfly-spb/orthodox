import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export const useOrderStore = defineStore('orders', () => {
    const error = ref<string | null>(null)
    const orders = ref<object | null>(null)

    return {
        error,
        orders
    }
})