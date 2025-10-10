<template>
  <TooltipProvider>
    <div class="tour-cost">
      <div class="section-header">
        <div class="section-title-wrapper">
          <h2 class="section-title">Стоимость тура</h2>
          <Tooltip>
            <TooltipTrigger as-child>
              <button class="help-button" type="button" @click.stop>
                <IconQuestionMark />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Информация о стоимости тура</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div class="cost-content">
        <div class="cost-item">
          <label class="cost-label">Стоимость тура</label>
          <Input
            v-if="editMode"
            v-model.number="tourPrice"
            type="number"
            class="cost-input"
            placeholder="Введите стоимость тура"
            min="0"
            step="0.01"
          />
          <div v-else class="cost-display">
            {{ formatCurrency(tourPrice) }} ₽
          </div>
        </div>
      </div>
    </div>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { Tour } from '@/types/tour';
import IconQuestionMark from '@/components/icons/IconQuestionMark.vue';

const props = defineProps<{
  currentItem: Tour;
  editMode: boolean;
}>();

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

const tourPrice = computed({
  get() {
    return tour.value.price || 0;
  },
  set(value: number) {
    tour.value = { ...tour.value, price: value };
  },
});

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
</script>

<style scoped>
.tour-cost {
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.help-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.help-button svg {
  fill: #353535;
  width: 19.5px;
  height: 19.5px;
}

.cost-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cost-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cost-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cost-input {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 12px;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}

.cost-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.cost-display {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}
</style>
