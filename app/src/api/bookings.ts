import { createApiClient } from './generic';
import type { Booking } from '@/types/booking';
import api from './httpClient';

export const bookingApi = createApiClient<Booking>('bookings');

export const bookingParams = async () => {
  try {
    const response = await api.get('/manage/bookings/parameters');
    return response.data;
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching booking parameters:', error);
    
    // Re-throw the error so callers can handle it appropriately
    throw error;
  }
};

export const getBookingByTourId = async (tourId: number): Promise<Booking[] | never> => {
  try {
   const response = await api.get(`/manage/bookings?filter[tour.id]=${tourId}`);
  return response.data;
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching booking parameters:', error);
    
    // Re-throw the error so callers can handle it appropriately
    throw error;
  }
};