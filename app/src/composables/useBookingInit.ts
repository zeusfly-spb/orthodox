import { useBookingStore } from '@/stores/booking'
import { useTourStore } from '@/stores/tour'
import { useCustomerStore } from '@/stores/customer'
import { useOrderStore } from '@/stores/order'

export const useBookingInit = () => {
  const bookingStore = useBookingStore()
  const tourStore = useTourStore()
  const customerStore = useCustomerStore()
  const orderStore = useOrderStore()

  const initializeBookingData = async (bookingId: string | number) => {
    await Promise.all([
      tourStore.fetchTours(),
      customerStore.fetchClientNames(),
      orderStore.fetchOrderStatuses()
    ])
    
  }

  return {
    initializeBookingData
  }
}