import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import type { Customer } from '@/types/customer'
import type { 
  BookingState, 
  ContactPerson, 
  Tourist, 
  PaymentInfo,
  RoomType,
  AccommodationOption,
} from '@/types/booking'
import { bookingApi } from '@/api/bookings'
import { tourApi } from '@/api/tours'
import { partnerApi } from '@/api/partners'
import { format, parseISO, min, max } from 'date-fns'

export const useBookingStore = defineStore('booking', () => {
  // State
  const booking = reactive<BookingState>({
    orderId: '',
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

  const toursTitles = ref<string[]>([])
  const clientNames = ref<string[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const orders = ref<object | null>(null)
  const managers = ref<object | null>(null)

  // Room types for accommodation
  const roomTypes = ref<RoomType[]>([
    { type: 'single', name: 'Одноместный', capacity: 1, available: 10 },
    { type: 'double', name: 'Двухместный', capacity: 2, available: 5 },
    { type: 'double_extra', name: 'Двухместный с доп. местом', capacity: 3, available: 3 }
  ])

  const enabledRoomTypes = ref(['single', 'double', 'double_extra'])
  const selectedAccommodation = ref<AccommodationOption | null>(null)

  // Getters
  const totalPrice = computed(() => {
    return booking.mainInfo.tourPrice * booking.counts.people
  })

  const paymentAmount = computed({
    get: () => {
      if (booking.payment.type === 'full') {
        return totalPrice.value
      }
      return booking.payment.amount
    },
    set: (value: number) => {
      booking.payment.amount = value
    }
  })

  const accommodationOptions = computed(() => {
    return findAccommodationOptions(
      booking.counts.people,
      roomTypes.value.filter(room => enabledRoomTypes.value.includes(room.type))
    )
  })

  // Actions
  const fetchBookingData = async (bookingId: string | number) => {
    isLoading.value = true
    error.value = null

    try {
      const [allToursData, bookingsResponse] = await Promise.all([
        tourApi.fetchData(),
        bookingApi.getData(bookingId)
      ])

      const { data: toursData } = allToursData
      const { data: bookingData } = bookingsResponse

      const { customers, status } = bookingData
      const { title, id, night_count, seats, dates, date, price, time } = bookingData.tour

      // Update booking state
      booking.id = bookingId
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
        firstname: customer.firstname,
        lastname: customer.lastname,
        patronymic: customer.patronymic,
        email: customer.email,
        phone: customer.phone,
        payment_status: customer.payment_status
      }))

      // Set tours titles
      toursTitles.value = toursData.map((tour: any) => tour.title)

    } catch (err) {
      error.value = 'Ошибка при загрузке данных заявки'
      console.error('Booking fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchClientNames = async () => {
    try {
      const response = await partnerApi.fetchData()
      clientNames.value = response.data.map((item: any) => item.name)
    } catch (err) {
      console.error('Client names fetch error:', err)
    }
  }

  const addContactPerson = (contact: ContactPerson) => {
    booking.contactPersons.push(contact)
  }

  const updateClient = (clientData: Partial<Customer>) => {
    Object.assign(booking.client, clientData)
  }

  const updatePayment = (paymentData: Partial<PaymentInfo>) => {
    Object.assign(booking.payment, paymentData)
  }

  const updateTourists = (tourists: Tourist[]) => {
    booking.tourists = tourists
  }

  const saveBooking = async () => {
    isLoading.value = true
    try {
      // Здесь будет логика сохранения заявки
      console.log('Saving booking:', booking)
      // await bookingApi.updateData(booking.id, booking)
    } catch (err) {
      error.value = 'Ошибка при сохранении заявки'
      console.error('Save booking error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Accommodation functions
  const findAccommodationOptions = (people: number, roomTypes: RoomType[], currentCombination: AccommodationOption = {}, index = 0): AccommodationOption[] => {
    if (people === 0) {
      return [{ ...currentCombination }]
    }
    
    if (index >= roomTypes.length) {
      return []
    }
    
    const results: AccommodationOption[] = []
    const room = roomTypes[index]
    const maxRooms = Math.min(
      Math.floor(people / room.capacity),
      room.available
    )
    
    for (let count = 0; count <= maxRooms; count++) {
      const peopleCovered = count * room.capacity
      
      if (peopleCovered <= people) {
        const newCombination = {
          ...currentCombination,
          [room.type]: count
        }
        
        const remainingResults = findAccommodationOptions(
          people - peopleCovered,
          roomTypes,
          newCombination,
          index + 1
        )
        
        results.push(...remainingResults)
      }
    }
    
    return results
  }

  const toggleRoomType = (roomType: string, isEnabled: boolean) => {
    if (isEnabled) {
      if (!enabledRoomTypes.value.includes(roomType)) {
        enabledRoomTypes.value.push(roomType)
      }
    } else {
      enabledRoomTypes.value = enabledRoomTypes.value.filter(type => type !== roomType)
    }
  }

  const selectAccommodation = (option: AccommodationOption) => {
    selectedAccommodation.value = option
  }

  const calculateTotalRooms = (option: AccommodationOption) => {
    return Object.values(option).reduce((total, count) => total + count, 0)
  }

  const calculateTotalPeople = (option: AccommodationOption) => {
    return Object.entries(option).reduce((total, [roomType, count]) => {
      const room = roomTypes.value.find(r => r.type === roomType)
      return total + (count * (room?.capacity || 0))
    }, 0)
  }

  return {
    // State
    booking,
    toursTitles,
    clientNames,
    isLoading,
    error,
    roomTypes,
    enabledRoomTypes,
    selectedAccommodation,
    accommodationOptions,
    orders,
    managers,
    // Getters
    totalPrice,
    paymentAmount,

    // Actions
    fetchBookingData,
    fetchClientNames,
    addContactPerson,
    updateClient,
    updatePayment,
    updateTourists,
    saveBooking,
    toggleRoomType,
    selectAccommodation,
    calculateTotalRooms,
    calculateTotalPeople
  }
})