import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAccommodationStore = defineStore('accommodation', () => {
  const roomTypes = ref([
    {
      type: 'no_accommodation',
      name: 'Без размещения в номерах',
      capacity: 0,
      available: Infinity,
    },
    { type: 'single', name: 'Одноместный', capacity: 1, available: 10 },
    { type: 'double', name: 'Двухместный', capacity: 2, available: 5 },
    { type: 'double_extra', name: 'Двухместный с доп. местом', capacity: 3, available: 3 },
  ]);

  const enabledRoomTypes = ref(['single', 'double', 'double_extra']);
  const selectedAccommodation = ref(null);
  const noAccommodationSelected = ref(false); // Флаг для варианта "без размещения"

  // Добавляем peopleCount как реактивное свойство
  const peopleCount = ref(0);

  // Вычисляемое свойство для вариантов размещения
  const accommodationOptions = computed(() => {
    if (noAccommodationSelected.value) {
      // Если выбран вариант без размещения, возвращаем только его
      return [{ no_accommodation: 1 }];
    }

    return findAccommodationOptions(
      peopleCount.value,
      roomTypes.value.filter(
        (room) => enabledRoomTypes.value.includes(room.type) && room.type !== 'no_accommodation',
      ),
    );
  });

  // Функция для поиска вариантов размещения
  const findAccommodationOptions = (
    people: number,
    roomTypes,
    currentCombination = {},
    index = 0,
  ) => {
    if (people === 0) {
      return [{ ...currentCombination }];
    }

    if (index >= roomTypes.length) {
      return [];
    }

    const results = [];
    const room = roomTypes[index];
    const maxRooms = Math.min(Math.floor(people / room.capacity), room.available);

    for (let count = 0; count <= maxRooms; count++) {
      const peopleCovered = count * room.capacity;

      if (peopleCovered <= people) {
        const newCombination = {
          ...currentCombination,
          [room.type]: count,
        };

        const remainingResults = findAccommodationOptions(
          people - peopleCovered,
          roomTypes,
          newCombination,
          index + 1,
        );

        results.push(...remainingResults);
      }
    }

    return results;
  };

  const toggleRoomType = (roomType: string, isEnabled: boolean) => {
    if (noAccommodationSelected.value) {
      // Если выбран вариант без размещения, нельзя включать другие типы номеров
      return;
    }

    if (isEnabled) {
      if (!enabledRoomTypes.value.includes(roomType)) {
        enabledRoomTypes.value.push(roomType);
      }
    } else {
      enabledRoomTypes.value = enabledRoomTypes.value.filter((type) => type !== roomType);
    }
  };

  const toggleNoAccommodation = (isEnabled: boolean) => {
    noAccommodationSelected.value = isEnabled;

    if (isEnabled) {
      // Если включаем "без размещения", отключаем все остальные типы номеров
      enabledRoomTypes.value = [];
      selectedAccommodation.value = { no_accommodation: 1 };
    } else {
      // Если выключаем "без размещения", включаем стандартные типы номеров
      enabledRoomTypes.value = ['single', 'double', 'double_extra'];
      selectedAccommodation.value = null;
    }
  };

  const selectAccommodation = (option) => {
    // Проверяем, выбран ли вариант "без размещения"
    if (option && option.no_accommodation !== undefined) {
      noAccommodationSelected.value = true;
      enabledRoomTypes.value = []; // Отключаем все типы номеров
    } else {
      noAccommodationSelected.value = false;
    }

    selectedAccommodation.value = option;
  };

  const calculateTotalRooms = (option) => {
    if (option?.no_accommodation) {
      return 0; // Для варианта "без размещения" комнат нет
    }
    return Object.values(option).reduce((total, count) => total + count, 0);
  };

  const calculateTotalPeople = (option) => {
    if (option?.no_accommodation) {
      return peopleCount.value; // Для варианта "без размещения" - все люди
    }
    return Object.entries(option).reduce((total, [roomType, count]) => {
      const room = roomTypes.value.find((r) => r.type === roomType);
      return total + count * (room?.capacity || 0);
    }, 0);
  };

  // Метод для получения названия варианта размещения
  const getAccommodationName = (option) => {
    if (option?.no_accommodation) {
      return 'Без размещения в номерах';
    }

    const parts = [];
    Object.entries(option).forEach(([roomType, count]) => {
      if (count > 0) {
        const room = roomTypes.value.find((r) => r.type === roomType);
        if (room) {
          parts.push(`${room.name} ×${count}`);
        }
      }
    });

    return parts.join(' + ');
  };

  // Метод для обновления количества людей и пересчета вариантов
  const updatePeopleCount = (count: number) => {
    peopleCount.value = count;
  };

  // Метод для сброса выбора размещения
  const resetAccommodation = () => {
    noAccommodationSelected.value = false;
    enabledRoomTypes.value = ['single', 'double', 'double_extra'];
    selectedAccommodation.value = null;
  };

  return {
    // State
    roomTypes,
    enabledRoomTypes,
    selectedAccommodation,
    noAccommodationSelected,
    peopleCount,

    // Getters
    accommodationOptions,

    // Actions
    toggleRoomType,
    toggleNoAccommodation,
    selectAccommodation,
    calculateTotalRooms,
    calculateTotalPeople,
    getAccommodationName,
    findAccommodationOptions,
    updatePeopleCount,
    resetAccommodation,
  };
});
