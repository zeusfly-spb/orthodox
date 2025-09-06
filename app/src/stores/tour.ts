import { defineStore } from 'pinia';
import { ref } from 'vue';
import { tourApi } from '@/api/tours';
import { useBookingStore } from './booking';

export const useTourStore = defineStore('tour', () => {
  const toursTitles = ref<string[]>([]);
  const allTours = ref<any[]>([]);
  const selectedTour = ref<any>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const bookingStore = useBookingStore();

  const fetchTours = async () => {
    isLoading.value = true;
    try {
      const response = await tourApi.fetchData();
      allTours.value = response.data;
      toursTitles.value = response.data.map((tour: any) => tour.title);
    } catch (err) {
      error.value = 'Ошибка при загрузке туров';
      console.error('Tours fetch error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const findTourByTitle = (title: string) => {
    const foundTour = allTours.value.find((tour) => tour.title === title);
    if (foundTour) {
      selectedTour.value = foundTour;
      updateBookingFromTour(foundTour);
      return foundTour;
    }
    return null;
  };

  const updateBookingFromTour = (tour: any) => {
    bookingStore.booking.tourId = tour.id.toString();
    bookingStore.booking.counts.nights = tour.night_count || 0;
    bookingStore.booking.mainInfo.tourPrice = tour.price || 0;
    bookingStore.booking.dates.start = tour.date_start || '';
    bookingStore.booking.dates.finish = tour.date_end || '';
    bookingStore.booking.mainInfo.date = tour.date || '';
    bookingStore.booking.mainInfo.time = tour.time || '';

    // Обновляем свободные места
    if (tour.seats && bookingStore.booking.counts.people) {
      bookingStore.booking.counts.freePlaces = tour.seats - bookingStore.booking.counts.people;
    }
  };

  return {
    toursTitles,
    allTours,
    selectedTour,
    isLoading,
    error,
    fetchTours,
    findTourByTitle,
    updateBookingFromTour,
  };
});
