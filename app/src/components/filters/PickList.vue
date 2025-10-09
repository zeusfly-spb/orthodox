<template>
  <div class="relative w-full">
    <button
      @click="toggleDropdown"
      class="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
    >
      <div class="flex items-center justify-between">
        <span class="text-gray-700">{{ displayText }}</span>
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
        <div v-if="searchable" class="p-3 border-b border-gray-200">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск..."
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div class="max-h-60 overflow-y-auto p-2">
          <div
            v-for="item in filteredItems"
            :key="item[valueKey]"
            @click="selectItem(item)"
            class="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            :class="{ 'bg-blue-50': isSelected(item) }"
          >
            <div
              v-if="multiple"
              class="flex items-center justify-center w-5 h-5 border-2 rounded transition-colors"
              :class="isSelected(item) ? 'bg-primary  border-primary' : 'border-gray-300'"
            >
              <svg
                v-if="isSelected(item)"
                class="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="text-sm text-gray-700">{{ item[labelKey] }}</span>
          </div>

          <div v-if="filteredItems.length === 0" class="px-3 py-4 text-sm text-center text-gray-500">
            Ничего не найдено
          </div>
        </div>

        <div v-if="multiple && selectedItems.length > 0" class="flex items-center justify-between p-3 border-t border-gray-200">
          <span class="text-sm text-gray-600">Выбрано: {{ selectedItems.length }}</span>
          <button
            @click="clearSelection"
            class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            Очистить
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Array, String, Number, Object],
    default: () => []
  },
  items: {
    type: Array,
    required: true
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  placeholder: {
    type: String,
    default: 'Выберите...'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const dropdown = ref(null)

const selectedItems = computed(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }
  return props.modelValue ? [props.modelValue] : []
})

const displayText = computed(() => {
  if (selectedItems.value.length === 0) {
    return props.placeholder
  }
  if (props.multiple) {
    return `Выбрано: ${selectedItems.value.length}`
  }
  const item = props.items.find(i => i[props.valueKey] === selectedItems.value[0])
  return item ? item[props.labelKey] : props.placeholder
})

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items
  return props.items.filter(item =>
    item[props.labelKey].toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const isSelected = (item) => {
  return selectedItems.value.some(selected => 
    (typeof selected === 'object' ? selected[props.valueKey] : selected) === item[props.valueKey]
  )
}

const selectItem = (item) => {
  if (props.multiple) {
    const newValue = [...selectedItems.value]
    const index = newValue.findIndex(selected => 
      (typeof selected === 'object' ? selected[props.valueKey] : selected) === item[props.valueKey]
    )
    
    if (index > -1) {
      newValue.splice(index, 1)
    } else {
      newValue.push(item[props.valueKey])
    }
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', item[props.valueKey])
    isOpen.value = false
  }
}

const clearSelection = () => {
  emit('update:modelValue', [])
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