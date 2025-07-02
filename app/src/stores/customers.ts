import { defineStore } from 'pinia'
import { customerApi } from '@/api/customers'
import { useEntity } from '@/composables/useEntity'
import type { Customer } from '@/types/customer'

export const useCustomersStore = defineStore('customers', () => {
  const { items, currentItem, error, getAll, getOneById, store, update, destroy } =
    useEntity(customerApi)
})
