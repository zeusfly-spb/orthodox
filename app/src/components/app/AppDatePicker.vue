<script setup lang="ts">
import { ref, watch, defineEmits, defineProps, computed } from 'vue';
import { Calendar as DatePicker } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

const props = defineProps<{
  modelValue?: string;
  minDate?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'addDate'): void;
}>();

// Конвертируем строку в объект Date для календаря
const internalDate = ref<Date | undefined>(
  props.modelValue ? new Date(props.modelValue) : undefined
);

// Конвертируем minDate в объект Date для календаря
const minDateComputed = computed(() => {
  return props.minDate ? new Date(props.minDate) : undefined;
});

// Конвертируем обратно в строку при изменении
watch(internalDate, (newDate) => {
  if (newDate) {
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    emit('update:modelValue', `${year}-${month}-${day}`);
  } else {
    emit('update:modelValue', '');
  }
});

// Обработчик выбора даты
const handleDateSelect = (date: Date | undefined) => {
  internalDate.value = date;
};

// Обработчик кнопки "Добавить дату"
const handleAddDate = () => {
  if (internalDate.value) {
    emit('addDate');
  }
};
</script>

<template>
  <div class="flex flex-col">
    <DatePicker
      v-model="internalDate"
      mode="single"
      :initial-focus="true"
      class="rounded-md border"
      locale="ru-RU"
      :min-date="minDateComputed"
    />
    <div class="p-2 border-t flex justify-end">
      <Button 
        type="button" 
        @click="handleAddDate" 
        :disabled="!internalDate" 
        size="sm"
      >
        Добавить дату
      </Button>
    </div>
  </div>
</template>