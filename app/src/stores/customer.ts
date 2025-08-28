import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import type { Customer } from '@/types/customer'
import { format, parseISO, min, max } from 'date-fns'
import { customerApi } from '@/api/customers'

export const useCustomerStore = defineStore('customer', () => {
  // State
  const customer = reactive<Customer>({
    id: '',
    firstname: '',
    lastname: '',
    patronymic: null,
    email: '',
    phone: '',
    payment_status: 'Не оплачено',
    passport_series: null,
    passport_number: null,
    passport_issue_date: null,
    passport_unit_name: null,
    passport_unit_code: null,
    passport_birth_date: null,
    passport_birth_place: null,
    passport_address: null,
    gender: 'Мужской',
    snils: null,
    created_at: '',
    updated_at: ''
  })

  const isLoading = ref(false)
  const error = ref(null)


  const updateCustomer = (data: Partial<Customer>) => {
    Object.assign(customer, data)
  }

  const updateTourist = async (customerId: string | number, data: Partial<Customer>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = customerApi.patchData(customerId, data)
      return response
    }
    catch(e: unknown) {
      error.value = e
      throw e
    }
    finally {
      isLoading.value = false
    }
  }

  const deleteTourist = async (customerId: string | number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = customerApi.deleteData(customerId)
      return response
    }
    catch(e: unknown) {
      error.value = e
      throw e
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    customer,
    updateCustomer,
    deleteTourist,
    updateTourist
  }
})