<template>
    <div class="tab-container">
      <button 
        class="tab-button"
        :class="{ 'tab-button--active': activeTab === 'Data' }"
        @click="activeTab = 'Data'"
      >
        Данные о туре
      </button>
      <button 
        class="tab-button"
        :class="{ 'tab-button--active': activeTab === 'Params' }"
        @click="activeTab = 'Params'"
      >
        Параметры тура
      </button>
      <button 
        class="tab-button"
        :class="{ 'tab-button--active': activeTab === 'Desc' }"
        @click="activeTab = 'Desc'"
      >
        Описание тура
      </button>
      <button 
        class="tab-button"
        :class="{ 'tab-button--active': activeTab === 'ObjectsTab' }"
        @click="activeTab = 'ObjectsTab'"
      >
        Объекты в туре
      </button>
      <button 
        class="tab-button"
        :class="{ 'tab-button--active': activeTab === 'Program' }"
        @click="activeTab = 'Program'"
      >
        Программа тура
      </button>
      <button 
        class="tab-button"
        :class="{ 'tab-button--active': activeTab === 'Map' }"
        @click="activeTab = 'Map'"
      >
        Карта маршрута
      </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    modelValue: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const activeTab = computed({
    get() {
        return props.modelValue;
    },
    set(value: string) {
        emit('update:modelValue', value);
    }
});
</script>

<style scoped>
.tab-container {
  display: flex;
  gap: 0.25rem; /* space-x-1 */
}

.tab-button {
  padding: 0.5rem 1rem; /* px-4 py-2 */
  background-color: #f3f4f6; /* bg-gray-100 */
  color: #374151; /* text-gray-700 */
  border: 1px solid #e5e7eb; /* border border-gray-200 */
  border-radius: 0.5rem; /* rounded-lg */
  font-weight: 500; /* font-medium */
  transition: all 0.15s ease-in-out; /* transition-colors */
  cursor: pointer;
}

.tab-button:hover {
  background-color: #e5e7eb; /* hover:bg-gray-200 */
}

.tab-button--active {
  background-color: #111827; /* bg-gray-900 */
  color: #ffffff; /* text-white */
  border-color: #111827; /* bg-gray-900 */
}

.tab-button--active:hover {
  background-color: #111827; /* bg-gray-900 */
}
</style>