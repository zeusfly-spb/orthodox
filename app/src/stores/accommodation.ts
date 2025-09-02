import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAccommodationStore = defineStore('accommodation', () => {
  const roomTypes = ref([
    { type: 'single', name: 'Одноместный', capacity: 1, available: 10 },
    { type: 'double', name: 'Двухместный', capacity: 2, available: 5 },
    { type: 'double_extra', name: 'Двухместный с доп. местом', capacity: 3, available: 3 }
  ])

  const enabledRoomTypes = ref(['single', 'double', 'double_extra'])
  const selectedAccommodation = ref(null)

  // Добавляем peopleCount как реактивное свойство
  const peopleCount = ref(0)

  // Вычисляемое свойство для вариантов размещения
  const accommodationOptions = computed(() => {
    return findAccommodationOptions(
      peopleCount.value,
      roomTypes.value.filter(room => enabledRoomTypes.value.includes(room.type))
    )
  })

  // Функция для поиска вариантов размещения (должна быть экспортирована)
  const findAccommodationOptions = (people: number, roomTypes, currentCombination, index = 0) => {
    if (people === 0) {
      return [{ ...currentCombination }]
    }
    
    if (index >= roomTypes.length) {
      return []
    }
    
    const results = []
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

  const selectAccommodation = (option) => {
    selectedAccommodation.value = option
  }

  const calculateTotalRooms = (option) => {
    return Object.values(option).reduce((total, count) => total + count, 0)
  }

  const calculateTotalPeople = (option) => {
    return Object.entries(option).reduce((total, [roomType, count]) => {
      const room = roomTypes.value.find(r => r.type === roomType)
      return total + (count * (room?.capacity || 0))
    }, 0)
  }

  // Метод для обновления количества людей и пересчета вариантов
  const updatePeopleCount = (count: number) => {
    peopleCount.value = count
  }

  return {
    // State
    roomTypes,
    enabledRoomTypes,
    selectedAccommodation,
    peopleCount,
    
    // Getters
    accommodationOptions,

    // Actions
    toggleRoomType,
    selectAccommodation,
    calculateTotalRooms,
    calculateTotalPeople,
    findAccommodationOptions, // Экспортируем функцию
    updatePeopleCount
  }
})