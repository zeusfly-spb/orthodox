import { createApiClient } from './generic'
import type { Booking } from '@/types/booking'
import api from './httpClient'

export const bookingApi = createApiClient<Booking>('bookings')

export const bookingParams = async () => {
    const response = await api.get('/manage/bookings/parameters')
    return response.data
}