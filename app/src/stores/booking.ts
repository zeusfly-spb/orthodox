import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import type { BookingState, ContactPerson, Tourist, PaymentInfo, Customer } from '@/types';
import { bookingApi, bookingParams } from '@/api/bookings';
import { format, parseISO, min, max } from 'date-fns';

export const useBookingStore = defineStore('booking', () => {
  const booking = reactive<BookingState>({
    id: '',
    title: '',
    tourId: '',
    manager: '',
    status: '',
    counts: {
      nights: 0,
      freePlaces: 0,
      people: 0,
    },
    dates: {
      start: '',
      finish: '',
    },
    contactPersons: [],
    client: {
      id: null,
      name: '',
      type: 'individual',
      comment: '',
    },
    tourists: [],
    payment: {
      type: 'full',
      amount: 0,
    },
    mainInfo: {
      tourPrice: 0,
      date: '',
      time: '',
    },
  });

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchBookingStatuses = async () => {
    isLoading.value = true;
    try {
      const response = await bookingParams();
      const { data: bookingStatuses } = response;

      const statusObject = bookingStatuses.find((val: any) => val.type === 'status');
      if (statusObject) {
        return statusObject.children;
      }
    } catch (err) {
      error.value = 'Ошибка при загрузке статусов';
      console.error('Order status fetch error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchBookingData = async (bookingId: string | number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const statuses = await fetchBookingStatuses();
      const bookingsResponse = await bookingApi.getData(bookingId);
      const { data: bookingData } = bookingsResponse;

      const { customers, status } = bookingData;
      const { title, id, night_count, seats, dates, date, price, time } = bookingData.tour;

      // Update booking state
      booking.id = bookingId.toString();
      booking.title = title;
      booking.tourId = id;
      booking.status = statuses[status];
      booking.counts.nights = night_count;
      booking.counts.people = customers.length;
      booking.counts.freePlaces = seats - customers.length;
      booking.dates.start = format(
        min(dates.map((val: any) => parseISO(val.date_start))),
        'yyyy-MM-dd',
      );
      booking.dates.finish = format(
        max(dates.map((val: any) => parseISO(val.date_end))),
        'yyyy-MM-dd',
      );

      booking.mainInfo.tourPrice = price;
      booking.mainInfo.date = date;
      booking.mainInfo.time = time;

      // Set tourists
      booking.tourists = customers.map((customer: any) => ({
        id: customer.id,
        firstname: customer.firstname,
        lastname: customer.lastname,
        patronymic: customer.patronymic,
        email: customer.email,
        phone: customer.phone,
        payment_status: customer.payment_status,
        description: customer.description,
        json_attributes: customer.json_attributes,
        passport_series: customer.passport_series,
        passport_number: customer.passport_number,
        passport_issue_date: customer.passport_issue_date,
        passport_unit_name: customer.passport_unit_name,
        passport_unit_code: customer.passport_unit_code,
        passport_birth_date: customer.passport_birth_date,
        passport_birth_place: customer.passport_birth_place,
        passport_address: customer.passport_address,
        gender: customer.gender,
        snils: customer.snils,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
      }));
    } catch (err) {
      error.value = 'Ошибка при загрузке данных заявки';
      console.error('Booking fetch error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const addContactPerson = (contact: ContactPerson) => {
    booking.contactPersons.push(contact);
  };

  const updateClient = (clientData: Partial<Customer>) => {
    Object.assign(booking.client, clientData);
  };

  const updatePayment = (paymentData: Partial<PaymentInfo>) => {
    Object.assign(booking.payment, paymentData);
  };

  const updateTourists = (tourists: Tourist[]) => {
    booking.tourists = tourists;
  };

  const saveBooking = async () => {
    isLoading.value = true;
    try {
      console.log('Saving booking:', booking);
      // await bookingApi.updateData(booking.id, booking)
    } catch (err) {
      error.value = 'Ошибка при сохранении заявки';
      console.error('Save booking error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Метод для удаления туриста из массива
  const removeTourist = (touristId: number) => {
    const index = booking.tourists.findIndex((t) => t.id === touristId);
    if (index !== -1) {
      booking.tourists.splice(index, 1);
      booking.counts.people = booking.tourists.length;

      // Обновляем свободные места
      if (booking.tourists.length > 0) {
        const tourSeats = booking.counts.freePlaces + booking.tourists.length;
        booking.counts.freePlaces = tourSeats - booking.tourists.length;
      }
    }
  };

  // Метод для обновления данных туриста
  const updateTouristData = (touristId: number, data: Partial<Tourist>) => {
    const tourist = booking.tourists.find((t) => t.id === touristId);
    if (tourist) {
      Object.assign(tourist, data);
    }
  };

  // Метод для добавления нового туриста
  const addTourist = (touristData: Partial<Tourist>) => {
    const newTourist: Tourist = {
      id: Date.now(), // временный ID
      firstname: '',
      lastname: '',
      patronymic: '',
      email: '',
      phone: '',
      payment_status: 'Не оплачено',
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...touristData,
    };

    booking.tourists.push(newTourist);
    booking.counts.people = booking.tourists.length;

    // Обновляем свободные места
    const tourSeats = booking.counts.freePlaces + booking.tourists.length;
    booking.counts.freePlaces = Math.max(0, tourSeats - booking.tourists.length);
  };

  // Метод для преобразования туристов в формат API
  const formatTouristsForApi = (tourists: Tourist[]) => {
    return tourists.map((tourist) => ({
      firstname: tourist.firstname,
      lastname: tourist.lastname,
      patronymic: tourist.patronymic,
      email: tourist.email,
      phone: tourist.phone,
      passport_series: tourist.passport_series,
      passport_number: tourist.passport_number,
      passport_issue_date: tourist.passport_issue_date,
      passport_unit_name: tourist.passport_unit_name,
      passport_unit_code: tourist.passport_unit_code,
      passport_birth_date: tourist.passport_birth_date,
      passport_birth_place: tourist.passport_birth_place,
      passport_address: tourist.passport_address,
      payment_status: tourist.payment_status,
      gender: tourist.gender,
      snils: tourist.snils,
    }));
  };

  // Метод для полного обновления заявки
  const updateBooking = async () => {
    isLoading.value = true;
    try {
      const requestData = {
        tour_id: parseInt(booking.tourId),
        status: booking.status,
        payment_status: booking.payment.type === 'full' ? 'paid' : 'partial',
        description: booking.client.comment,
        customers: formatTouristsForApi(booking.tourists),
      };

      await bookingApi.patchData(booking.id, requestData);
      console.log('Booking updated successfully');
    } catch (err) {
      error.value = 'Ошибка при обновлении заявки';
      console.error('Update booking error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Метод для сохранения только туристов
  const saveTourists = async () => {
    isLoading.value = true;
    try {
      const requestData = {
        customers: formatTouristsForApi(booking.tourists),
      };

      await bookingApi.patchData(booking.id, requestData);
      console.log('Tourists saved successfully');
    } catch (err) {
      error.value = 'Ошибка при сохранении данных туристов';
      console.error('Save tourists error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    booking,
    isLoading,
    error,

    // Actions
    fetchBookingData,
    addContactPerson,
    updateClient,
    updatePayment,
    updateTourists,
    saveBooking,
    removeTourist,
    updateTouristData,
    addTourist,
    saveTourists,
    updateBooking,
  };
});
