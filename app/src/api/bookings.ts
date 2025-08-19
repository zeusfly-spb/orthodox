import { createApiClient } from './generic'
import type { Booking } from '@/types/booking'

export const bookingApi = createApiClient<Booking>('bookings')