<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
import { Calendar as DatePicker } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { parseDate } from '@internationalized/date'

const props = defineProps<{
  modelValue?: string | object // Принимаем строку или объект internationalized date
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void // Всегда возвращаем строку в формате YYYY-MM-DD
  (e: 'addDate'): void
}>()

// Конвертируем входное значение в объект даты для календаря
const internalDate = ref(
  props.modelValue
    ? typeof props.modelValue === 'string'
      ? parseDate(props.modelValue)
      : props.modelValue
    : null,
)

// Конвертируем обратно в строку при изменении
watch(internalDate, (val) => {
  if (val) {
    emit('update:modelValue', val.toString())
  }
})
</script>

<template>
  <div class="flex flex-col">
    <DatePicker
      v-model="internalDate"
      mode="single"
      :initial-focus="true"
      class="rounded-md border"
      locale="ru-RU"
    />
    <div class="p-2 border-t flex justify-end">
      <Button type="button" @click="$emit('addDate')" :disabled="!internalDate" size="sm">
        Добавить дату
      </Button>
    </div>
  </div>
</template>
