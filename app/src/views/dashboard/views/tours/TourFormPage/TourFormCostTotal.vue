<template>
  <div class="tour-cost">
    <div v-if="!editMode" class="view-mode">
      <div class="view-header">
        <h2 class="section-title">Стоимость тура</h2>
        <button
          :class="[
            'p-2 rounded-lg transition-colors touchable',
            editMode
              ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'
          ]"
          @click="handleEdit"
        >
          <Pencil class="w-4 h-4" />
        </button>
      </div>
      <div class="view-content">
        <div class="view-cost-row">
          <span class="cost-name">Стоимость тура</span>
          <span class="cost-price">{{ formatCurrency(tourPrice) }} ₽</span>
        </div>
      </div>
    </div>

    <div v-else class="edit-mode">
      <div class="section-header">
        <div class="section-title-wrapper">
          <h2 class="section-title">Стоимость тура</h2>
          <TooltipProvider>
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
          </TooltipProvider>
          <button
            :class="[
              'p-2 rounded-lg transition-colors touchable ml-auto',
              editMode
                ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'
            ]"
            @click="handleEdit"
          >
            <Pencil class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="cost-content">
        <div class="cost-item">
          <label class="cost-label">Стоимость тура</label>
          <Input
            v-model.number="tourPrice"
            type="number"
            class="cost-input"
            placeholder="Введите стоимость тура"
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { Tour } from '@/types/tour';
import IconQuestionMark from '@/components/icons/IconQuestionMark.vue';
import { Pencil } from 'lucide-vue-next';

const props = defineProps<{
  currentItem: Tour;
  editMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
  (e: 'update:editMode', value: boolean): void;
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

const editModeLocal = computed({
  get() {
    return props.editMode;
  },
  set(value) {
    emit('update:editMode', value);
  },
});

const handleEdit = () => {
  editModeLocal.value = !editModeLocal.value;
};

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

.view-mode {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.view-cost-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6B7280;
  font-size: 0.875rem;
}

.cost-name {
  color: #6B7280;
}

.cost-price {
  color: #111827;
  font-weight: 500;
}

.edit-mode {
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
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
  font-size: 0.75rem;
  font-weight: 400;
  color: #9CA3AF;
}

.cost-input {
  font-size: 0.875rem;
  color: #111827;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}

.cost-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
</style>
