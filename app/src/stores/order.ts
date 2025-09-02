import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bookingParams } from '@/api/bookings'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<object | null>(null)
  const managers = ref<object | null>(null)
  const orderStatusList = ref<object | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchOrderStatuses = async () => {
    isLoading.value = true
    try {
      const response = await bookingParams()
      const { data: bookingStatuses } = response
      
      const statusObject = bookingStatuses.find((val: any) => val.type === 'status')
      if (statusObject) {
        orderStatusList.value = Object.values(statusObject.children)
      }
    } catch (err) {
      error.value = 'Ошибка при загрузке статусов'
      console.error('Order status fetch error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    orders,
    managers,
    orderStatusList,
    isLoading,
    error,
    fetchOrderStatuses
  }
})