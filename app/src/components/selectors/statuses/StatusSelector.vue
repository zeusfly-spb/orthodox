<template>
  <div class="status-selector">
    <div v-if="displayType === 'dropdown'" class="relative">
      <button
        @click="isOpen = !isOpen"
        class="flex items-center justify-between w-full px-4 py-3 text-left bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
        :class="{
          'ring-2 ring-emerald-500 border-emerald-500': isOpen,
          'border-gray-300': isOpen
        }"
      >
        <div class="flex items-center gap-3">
          <div v-if="selectedOption?.color" :class="['w-3 h-3 rounded-full flex-shrink-0', selectedOption.color]"></div>
          <span class="text-gray-900">{{ selectedLabel || placeholder }}</span>
        </div>
        <svg 
          class="w-4 h-4 text-gray-500 transition-transform duration-200" 
          :class="{ 'rotate-180': isOpen }" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div 
          v-if="isOpen" 
          class="absolute z-20  mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden
          
          "
          v-click-outside="() => isOpen = false"
        >
          <div class="py-2  max-h-60 overflow-y-auto">
            <button
              v-for="option in options"
              :key="option.value"
              @click="selectOption(option)"
              class="flex items-center w-full px-4 py-3 text-sm transition-all duration-150 hover:bg-gray-50 active:bg-gray-100"
              :class="{ 
                'bg-emerald-50 text-emerald-900 border-r-2 border-emerald-500': modelValue === option.value,
                'text-gray-700': modelValue !== option.value
              }"
            >
              <div v-if="option.color" :class="['w-3 h-3 rounded-full mr-3 flex-shrink-0', option.color]"></div>
              <span class="font-medium">{{ option.label }}</span>
              
            </button>
          </div>
        </div>
      </transition>
    </div>

    <div v-else-if="displayType === 'buttons'" class="flex flex-wrap gap-3">
      <button
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        :class="[
          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border-2',
          modelValue === option.value
            ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25 transform scale-105'
            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md active:scale-95'
        ]"
      >
        <div v-if="option.color" :class="['w-3 h-3 rounded-full', option.color]"></div>
        {{ option.label }}
        <div 
          v-if="modelValue === option.value" 
          class="ml-1 w-4 h-4 bg-white/20 rounded-full flex items-center justify-center"
        >
          <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </button>
    </div>

    <div v-else class="space-y-1 bg-white rounded-xl border border-gray-200 p-3">
      <label
        v-for="option in options"
        :key="option.value"
        class="flex items-center cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 active:bg-gray-100"
        :class="{ 'bg-emerald-50 border border-emerald-200': modelValue === option.value }"
      >
      <div class="relative flex items-center">
          <input
            type="radio"
            :value="option.value"
            :checked="modelValue === option.value"
            @change="selectOption(option)"
            class="sr-only"
          />
          <div 
            class="w-5 h-5 border-2 rounded-full mr-3 transition-all duration-200 flex items-center justify-center"
            :class="{
              'border-emerald-500 bg-emerald-500': modelValue === option.value,
              'border-gray-300': modelValue !== option.value
            }"
          >
            <div 
              v-if="modelValue === option.value" 
              class="w-2 h-2 bg-white rounded-full"
            ></div>
          </div>
        </div>
        <div v-if="option.color" :class="['w-3 h-3 rounded-full mr-3', option.color]"></div>
        <span class="text-sm font-medium text-gray-900">{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => {
      return options.every(option => 
        typeof option === 'object' && 
        'value' in option && 
        'label' in option
      )
    }
  },
  placeholder: {
    type: String,
    default: 'Выберите опцию'
  },
  displayType: {
    type: String,
    default: 'dropdown',
    validator: (value) => ['dropdown', 'buttons', 'radio'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue)
})

const selectedLabel = computed(() => {
  return selectedOption.value ? selectedOption.value.label : ''
})

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

// Директива для закрытия по клику вне элемента

</script>

<style scoped>
.status-selector {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Кастомный скроллбар */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>