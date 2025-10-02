<!-- components/ErrorBoundary.vue -->
<template>
  <slot v-if="!hasError" />
  <div v-else class="p-4 bg-red-50 border border-red-200 rounded-lg">
    <h3 class="text-lg font-medium text-red-800">Произошла ошибка</h3>
    <p class="text-red-600 mt-2">{{ errorMessage }}</p>
    <button 
      @click="resetError"
      class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Попробовать снова
    </button>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((error) => {
  hasError.value = true
  errorMessage.value = error.message
  console.error('Error caught by boundary:', error)
  return false // Prevent the error from propagating further
})

const resetError = () => {
  hasError.value = false
  errorMessage.value = ''
}
</script>