<template>
  <div class="rating-container">
    <span class="param-value">{{ ratingTitle(rating) }}</span>
    <div class="rating-dots">
      <template v-if="editMode">
        <span 
          v-for="i in Array(max).fill(0).map((_, index) => index + 1)" 
          :key="i" 
          class="dot"
          :class="{ 'dot-filled': i <= rating, 'dot-input': i > rating, 'touchable': editMode }"
          @click="rating = i"
          :title="`Переключить на '${ratingTitle(i)}'`"
        />
      </template>
      <template v-else-if="rating">
        <span 
          v-for="i in Array(max).fill(0).map((_, index) => index + 1)" 
          :key="i" 
          class="dot"
          :class="{ 'dot-filled': i <= rating, 'dot-empty': i > rating }"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '@/types/tour';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  currentItem: Tour;
  editMode?: boolean;
  max?: number;
  fieldName: keyof Tour;
}>(), {
  max: 4,
});

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
}>();

const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value: Tour) {
    emit('update:currentItem', value);
  },
});

const rating = computed({
  get() {
    return tour.value[props.fieldName] as number;
  },
  set(value: number) {
    tour.value = { ...tour.value, [props.fieldName]: value };
  },
});

const ratingTitle = (rate: number) => {
  if (!rate) return 'Не указано';
  return {1: 'Ниже среднего', 2: 'Средний', 3: 'Выше среднего', 4: 'Максимальный'}[rate];
};
</script>

<style scoped>
.rating-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.param-value {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
}
.rating-dots {
  display: flex;
  gap: 0.25rem;
}
.dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  transition: all 0.15s ease-in-out;
}
.dot-filled {
  background-color: #10b981;
}
.dot-empty {
  background-color: #d1d5db;
}
.dot-input {
  background-color: #d1d5db;
  cursor: pointer;
}
.dot-input:hover {
  background-color: #10b981;
}
</style>