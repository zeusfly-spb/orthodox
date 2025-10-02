<!-- components/selectors/date/DatePeriodPicker.vue -->
<template>
  <div class="relative" ref="containerRef">
    <div 
      class="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg bg-white cursor-pointer text-sm min-w-[200px]"
      @click="togglePicker"
    >
      <span class="text-gray-700 truncate">
        {{ displayText }}
      </span>
    </div>

    <div 
      v-if="isOpen"
      v-click-outside="closePicker"
      class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[300px]"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-sm font-medium text-gray-900">Выберите период</h3>
          <button @click="closePicker" class="text-gray-400 hover:text-gray-600">
            Закрыть
          </button>
        </div>
        
        <!-- Простой выбор дат -->
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Начальная дата</label>
            <input
              v-model="localStart"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Конечная дата</label>
            <input
              v-model="localEnd"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div class="flex gap-2 pt-2">
            <button
              @click="applyDates"
              class="flex-1 px-3 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors text-sm"
            >
              Применить
            </button>
            <button
              @click="clearDates"
              class="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
            >
              Очистить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'


const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ start: '', end: '' })
  },
  startPlaceholder: {
    type: String,
    default: 'Начальная дата'
  },
  endPlaceholder: {
    type: String,
    default: 'Конечная дата'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const containerRef = ref(null)
const localStart = ref('')
const localEnd = ref('')

// Инициализация локальных значений
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    localStart.value = newValue.start || ''
    localEnd.value = newValue.end || ''
  }
}, { immediate: true })

const displayText = computed(() => {
  if (!props.modelValue) return props.startPlaceholder
  
  const { start, end } = props.modelValue
  if (start && end) {
    return `${formatDate(start)} - ${formatDate(end)}`
  } else if (start) {
    return `С ${formatDate(start)}`
  } else if (end) {
    return `По ${formatDate(end)}`
  }
  return props.startPlaceholder
})

function togglePicker() {
  isOpen.value = !isOpen.value
}

function closePicker() {
  isOpen.value = false
}

function applyDates() {
  emit('update:modelValue', {
    start: localStart.value,
    end: localEnd.value
  })
  closePicker()
}

function clearDates() {
  localStart.value = ''
  localEnd.value = ''
  emit('update:modelValue', { start: '', end: '' })
  closePicker()
}

function formatDate(dateString) {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU')
  } catch (error) {
    console.warn('Error formatting date:', error)
    return dateString
  }
}

// Директива для клика вне элемента
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

onMounted(() => {
  // Безопасная инициализация
})

onUnmounted(() => {
  // Очистка
})
</script>