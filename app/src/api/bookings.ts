import { createApiClient } from './generic'
import type { Booking } from '@/types/booking'
import api from './httpClient'

export const bookingApi = createApiClient<Booking>('bookings')

export const getBookingByFilter = async (tourId: number): Promise<Booking[]> => {
  const { data } = await api.get<{ data: Booking[] }>(`/manage/bookings?filter[tour.id]=${tourId}`)
  return data.data
}