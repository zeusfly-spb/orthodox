<!-- <script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue';
import { Calendar as DatePicker } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { parseDate } from '@/internationalized/date';

const props = defineProps<{
  modelValue?: string | object; // Принимаем строку или объект internationalized date
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void; // Всегда возвращаем строку в формате YYYY-MM-DD
  (e: 'addDate'): void;
}>();

// Конвертируем входное значение в объект даты для календаря
const internalDate = ref(
  props.modelValue
    ? typeof props.modelValue === 'string'
      ? parseDate(props.modelValue)
      : props.modelValue
    : null,
);

// Конвертируем обратно в строку при изменении
watch(internalDate, (val) => {
  if (val) {
    emit('update:modelValue', val.toString());
  }
});
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
      <Button type="button" @click.stop="$emit('addDate')" :disabled="!internalDate" size="sm">
        Добавить дату
      </Button>
    </div>
  </div>
</template> 
парсинг даты не находится
-->
<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue';
import { Calendar as DatePicker } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

interface DateObject {
  year: number;
  month: number;
  day: number;
}

const props = defineProps<{
  modelValue?: string | DateObject;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'addDate'): void;
}>();

// Самописная функция парсинга даты из строки YYYY-MM-DD
const parseDateString = (dateString: string): DateObject | null => {
  if (!dateString) return null;
  
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  
  return { year, month, day };
};

// Самописная функция форматирования даты в строку YYYY-MM-DD
const formatDateToString = (dateObj: DateObject | null): string => {
  if (!dateObj) return '';
  
  const year = dateObj.year.toString().padStart(4, '0');
  const month = dateObj.month.toString().padStart(2, '0');
  const day = dateObj.day.toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// Конвертируем входное значение в объект даты для календаря
const internalDate = ref<DateObject | null>(
  props.modelValue
    ? typeof props.modelValue === 'string'
      ? parseDateString(props.modelValue)
      : props.modelValue
    : null
);

// Конвертируем обратно в строку при изменении
watch(internalDate, (val) => {
  if (val) {
    emit('update:modelValue', formatDateToString(val));
  }
});

// Обработчик выбора даты в календаре
const handleDateSelect = (date: DateObject | undefined) => {
  if (date) {
    internalDate.value = date;
  }
};
</script>

<template>
  <div class="flex flex-col">
    <DatePicker
      :model-value="internalDate"
      mode="single"
      :initial-focus="true"
      class="rounded-md border"
      locale="ru-RU"
      @update:model-value="handleDateSelect"
    />
    <div class="p-2 border-t flex justify-end">
      <Button 
        type="button" 
        @click.stop="$emit('addDate')" 
        :disabled="!internalDate" 
        size="sm"
      >
        Добавить дату
      </Button>
    </div>
  </div>
</template>
