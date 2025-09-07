import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { partnerApi } from '@/api/partners'
import type { Customer } from '@/types/customer'

export const useCustomerStore = defineStore('customer', () => {
  const clientNames = ref<string[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const currentTourist = reactive<Customer>({
    id: 0,
    firstname: '',
    lastname: '',
    patronymic: '',
    email: '',
    phone: '',
    payment_status: '',
    description: '',
    json_attributes: null,
    passport_series: '',
    passport_number: '',
    passport_issue_date: '',
    passport_unit_name: '',
    passport_unit_code: '',
    passport_birth_date: '',
    passport_birth_place: '',
    passport_address: '',
    gender: '',
    snils: '',
    created_at: '',
    updated_at: ''
  })

  // Изменяем структуру для хранения дополнительных услуг
  const extraInfo = reactive({
    basicService: {
      name: '',
      price: ''
    },
    additionalServices: [], // Массив для дополнительных услуг
    description: ''
  })

  // Функция для добавления новой дополнительной услуги
  const addAdditionalService = () => {
    extraInfo.additionalServices.push({
      name: '',
      price: ''
    })
  }

  // Функция для удаления дополнительной услуги
  const removeAdditionalService = (index: number) => {
    extraInfo.additionalServices.splice(index, 1)
  }

  const fetchClientNames = async () => {
    isLoading.value = true
    try {
      const response = await partnerApi.fetchData()
      clientNames.value = response.data.map((item: any) => item.name)
    } catch (err) {
      error.value = 'Ошибка при загрузке клиентов'
      console.error('Client names fetch error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateCustomer = (tourist: Customer) => {
    Object.assign(currentTourist, tourist)
  }

  const updateTourist = async (id: number, data: Partial<Customer>) => {
    isLoading.value = true
    try {
      console.log('Updating tourist:', id, data)
      // await customerApi.updateTourist(id, data)
    } catch (err) {
      error.value = 'Ошибка при обновлении туриста'
      console.error('Update tourist error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteTourist = async (id: number) => {
    isLoading.value = true
    try {
      console.log('Deleting tourist:', id)
      // await customerApi.deleteTourist(id)
    } catch (err) {
      error.value = 'Ошибка при удалении туриста'
      console.error('Delete tourist error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    clientNames,
    currentTourist,
    extraInfo,
    isLoading,
    error,
    fetchClientNames,
    updateCustomer,
    updateTourist,
    addAdditionalService,
    removeAdditionalService
  }
})