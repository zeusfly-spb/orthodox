import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import type { BookingState, ContactPerson, Tourist, PaymentInfo, Customer } from '@/types/booking';
import { bookingApi, bookingParams } from '@/api/bookings';
import { format, parseISO } from 'date-fns';

// Типы для ответа API
interface StatusChildren {
  [key: string]: string;
}

interface BookingParam {
  title: string;
  type: string;
  children: StatusChildren;
}

interface BookingParamsResponse {
  data: BookingParam[];
}

// Тип для данных туриста из API
interface ApiCustomer {
  id: number;
  firstname: string;
  lastname: string;
  patronymic: string;
  email: string;
  phone: string;
  payment_status: string;
  description: string;
  json_attributes: any;
  passport_series: string;
  passport_number: string;
  passport_issue_date: string;
  passport_unit_name: string;
  passport_unit_code: string;
  passport_birth_date: string;
  passport_birth_place: string;
  passport_address: string;
  gender: string;
  snils: string;
  created_at: string;
  updated_at: string;
}

// Тип для данных тура из API
interface ApiTour {
  title: string;
  id: number;
  night_count: number;
  seats: number;
  date: string;
  date_start: string;
  date_end: string;
  price: number;
  time: string;
}

// Тип для ответа с данными бронирования
interface BookingApiResponse {
  data: {
    customers: ApiCustomer[];
    status: string;
    tour: ApiTour;
  };
}

export const useBookingStore = defineStore('booking', () => {
  // Реактивное состояние бронирования
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
    customer:{
      firstname:'',
      lastname:'',
      payment_status:'pending'
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

  // Состояние загрузки и ошибок
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Загрузка статусов бронирования из API
   * @returns {Promise<StatusChildren | undefined>} Объект со статусами
   */
  const fetchBookingStatuses = async (): Promise<StatusChildren | undefined> => {
    isLoading.value = true;
    try {
      const response = await bookingParams() as BookingParamsResponse;
      const { data: bookingStatuses } = response;

      // Поиск объекта со статусами
      const statusObject = bookingStatuses.find((val: BookingParam) => val.type === 'status');
      if (statusObject) {
        return statusObject.children;
      }
      return undefined;
    } catch (err) {
      error.value = 'Ошибка при загрузке статусов';
      console.error('Order status fetch error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Загрузка данных конкретного бронирования
   * @param {string | number} bookingId - ID бронирования
   */
  const fetchBookingData = async (bookingId: string | number): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      // Загружаем статусы и данные бронирования параллельно для оптимизации
      const [statuses, bookingsResponse] = await Promise.all([
        fetchBookingStatuses(),
        bookingApi.getData(bookingId) as Promise<BookingApiResponse>
      ]);

      const bookingData = bookingsResponse.data;
      const { customers, status, tour } = bookingData;
      const { 
        title, 
        id, 
        night_count, 
        seats, 
        date, 
        date_start, 
        date_end, 
        price, 
        time 
      } = tour;

      // Обновление основного состояния бронирования
      booking.id = bookingId.toString();
      booking.title = title;
      booking.tourId = id.toString(); // Исправлено: приведение к string
      
      // Использование статуса из API или значения по умолчанию
      booking.status = statuses?.[status] || status;
      
      booking.counts.nights = night_count;
      booking.counts.people = customers.length;
      booking.counts.freePlaces = Math.max(0, seats - customers.length); // Исправлено: защита от отрицательных значений
      
      // Форматирование дат
      booking.dates.start = format(parseISO(date_start), 'yyyy-MM-dd');
      booking.dates.finish = format(parseISO(date_end), 'yyyy-MM-dd');

      booking.mainInfo.tourPrice = price;
      booking.mainInfo.date = date;
      booking.mainInfo.time = time;

      // Преобразование клиентов из API в туристов
      booking.tourists = customers.map((customer: ApiCustomer): Tourist => ({
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

  /**
   * Добавление контактного лица
   * @param {ContactPerson} contact - Данные контактного лица
   */
  const addContactPerson = (contact: ContactPerson): void => {
    booking.contactPersons.push(contact);
  };

  /**
   * Обновление данных клиента
   * @param {Partial<Customer>} clientData - Частичные данные клиента
   */
  const updateClient = (clientData: Partial<Customer>): void => {
    Object.assign(booking.client, clientData);
  };

  /**
   * Обновление платежной информации
   * @param {Partial<PaymentInfo>} paymentData - Частичные платежные данные
   */
  const updatePayment = (paymentData: Partial<PaymentInfo>): void => {
    Object.assign(booking.payment, paymentData);
  };

  /**
   * Обновление списка туристов
   * @param {Tourist[]} tourists - Новый список туристов
   */
  const updateTourists = (tourists: Tourist[]): void => {
    booking.tourists = tourists;
    // Автоматическое обновление счетчика людей
    booking.counts.people = tourists.length;
  };

  /**
   * Сохранение бронирования
   */
  const saveBooking = async (): Promise<void> => {
    isLoading.value = true;
    try {
      console.log('Saving booking:', booking);
      await bookingApi.storeData(booking);
    } catch (err) {
      error.value = 'Ошибка при сохранении заявки';
      console.error('Save booking error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Удаление туриста по ID
   * @param {number} touristId - ID туриста
   */
  const removeTourist = (touristId: number): void => {
    const index = booking.tourists.findIndex((t) => t.id === touristId);
    if (index !== -1) {
      booking.tourists.splice(index, 1);
      booking.counts.people = booking.tourists.length;
      
      // Обновление свободных мест (логика требует уточнения бизнес-правил)
      const currentSeats = booking.counts.freePlaces + booking.counts.people;
      booking.counts.freePlaces = Math.max(0, currentSeats - booking.tourists.length);
    }
  };

  /**
   * Обновление данных конкретного туриста
   * @param {number} touristId - ID туриста
   * @param {Partial<Tourist>} data - Данные для обновления
   */
  const updateTouristData = (touristId: number, data: Partial<Tourist>): void => {
    const tourist = booking.tourists.find((t) => t.id === touristId);
    if (tourist) {
      Object.assign(tourist, data);
      tourist.updated_at = new Date().toISOString(); // Автоматическое обновление времени
    }
  };

  /**
   * Добавление нового туриста
   * @param {Partial<Tourist>} touristData - Данные нового туриста
   */
  const addTourist = (touristData: Partial<Tourist>): void => {
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

    // Обновление свободных мест
    const totalSeats = booking.counts.freePlaces + booking.counts.people;
    booking.counts.freePlaces = Math.max(0, totalSeats - booking.tourists.length);
  };

  /**
   * Преобразование туристов в формат для API
   * @param {Tourist[]} tourists - Список туристов
   * @returns {object[]} Данные в формате API
   */
  const formatTouristsForApi = (tourists: Tourist[]): object[] => {
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

  /**
   * Полное обновление заявки
   */
  const updateBooking = async (): Promise<void> => {
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

  /**
   * Сохранение только данных туристов
   */
  const saveTourists = async (): Promise<void> => {
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