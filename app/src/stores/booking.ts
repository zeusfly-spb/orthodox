import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { bookingApi } from '@/api/bookings'
import { format, parseISO, min, max } from 'date-fns'

export const useBookingStore = defineStore('booking', () => {
  const booking = reactive({
    id: '',
    title: '',
    tourId: '',
    manager: '',
    status: '',
    counts: {
      nights: 0,
      freePlaces: 0,
      people: 0
    },
    dates: {
      start: '',
      finish: ''
    },
    contactPersons: [],
    client: {
      id: null,
      name: '',
      type: 'individual',
      comment: ''
    },
    tourists: [],
    payment: {
      type: 'full',
      amount: 0
    },
    mainInfo: {
      tourPrice: 0,
      date: '',
      time: ''
    }
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Добавляем метод fetchBookingData
  const fetchBookingData = async (bookingId: string | number) => {
    isLoading.value = true
    error.value = null

    try {
      const bookingsResponse = await bookingApi.getData(bookingId)
      const { data: bookingData } = bookingsResponse

      const { customers, status } = bookingData
      const { title, id, night_count, seats, dates, date, price, time } = bookingData.tour
      
      // Update booking state
      booking.id = bookingId.toString()
      booking.title = title
      booking.tourId = id
      booking.status = status
      booking.counts.nights = night_count
      booking.counts.people = customers.length
      booking.counts.freePlaces = seats - customers.length
      booking.dates.start = format(min(dates.map((val: any) => parseISO(val.date_start))), 'yyyy-MM-dd')
      booking.dates.finish = format(max(dates.map((val: any) => parseISO(val.date_end))), 'yyyy-MM-dd')
      
      booking.mainInfo.tourPrice = price
      booking.mainInfo.date = date
      booking.mainInfo.time = time

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
        updated_at: customer.updated_at
      }))

    } catch (err) {
      error.value = 'Ошибка при загрузке данных заявки'
      console.error('Booking fetch error:', err)
      throw err // Пробрасываем ошибку дальше
    } finally {
      isLoading.value = false
    }
  }

  const addContactPerson = (contact) => {
    booking.contactPersons.push(contact)
  }

  const updateClient = (clientData: Partial) => {
    Object.assign(booking.client, clientData)
  }

  const updatePayment = (paymentData: Partial) => {
    Object.assign(booking.payment, paymentData)
  }

  const updateTourists = (tourists) => {
    booking.tourists = tourists
  }

  const saveBooking = async () => {
    isLoading.value = true
    try {
      console.log('Saving booking:', booking)
      // await bookingApi.updateData(booking.id, booking)
    } catch (err) {
      error.value = 'Ошибка при сохранении заявки'
      console.error('Save booking error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

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
    saveBooking
  }
})