<template>
  <div class="relative w-full">
    <button
      @click="toggleDropdown"
      class="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-gray-700">{{ displayText }}</span>
        </div>
        <svg
          class="w-5 h-5 text-gray-400 transition-transform"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        ref="dropdown"
        class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
      >
        <div class="p-4">
          <div class="mb-4">
            <label class="block mb-2 text-sm font-medium text-gray-700">Быстрый выбор</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="preset in presets"
                :key="preset.label"
                @click="selectPreset(preset)"
                class="px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Начало периода</label>
              <input
                v-model="startDate"
                type="date"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Конец периода</label>
              <input
                v-model="endDate"
                type="date"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div class="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              @click="clearDates"
              class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Очистить
            </button>
            <button
              @click="applyDates"
              class="px-4 py-2 text-sm  text-primary-foreground font-bold  bg-primary rounded-md hover:bg-primary transition-colors"
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ start: null, end: null })
  },
  placeholder: {
    type: String,
    default: 'Выберите период'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const startDate = ref(props.modelValue?.start || '')
const endDate = ref(props.modelValue?.end || '')
const dropdown = ref(null)

const presets = [
  { label: 'Сегодня', days: 0 },
  { label: 'Последние 7 дней', days: 7 },
  { label: 'Последние 30 дней', days: 30 },
  { label: 'Последние 90 дней', days: 90 }
]

const displayText = computed(() => {
  if (!props.modelValue?.start && !props.modelValue?.end) {
    return props.placeholder
  }
  const start = props.modelValue.start ? formatDate(props.modelValue.start) : '...'
  const end = props.modelValue.end ? formatDate(props.modelValue.end) : '...'
  return `${start} - ${end}`
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    startDate.value = props.modelValue?.start || ''
    endDate.value = props.modelValue?.end || ''
  }
}

const selectPreset = (preset) => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - preset.days)
  
  startDate.value = start.toISOString().split('T')[0]
  endDate.value = end.toISOString().split('T')[0]
  
  applyDates()
}

const applyDates = () => {
  emit('update:modelValue', {
    start: startDate.value,
    end: endDate.value
  })
  isOpen.value = false
}

const clearDates = () => {
  startDate.value = ''
  endDate.value = ''
  emit('update:modelValue', { start: null, end: null })
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target) && !event.target.closest('button')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>