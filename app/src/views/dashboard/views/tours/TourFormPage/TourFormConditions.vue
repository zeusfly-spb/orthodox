<template>
  <div class="bg-white rounded-xl p-6">
    <div class="flex justify-between items-start mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Условия тура</h2>
        <p class="text-gray-600">Укажите условия и требования для участия в туре</p>
      </div>
      <button
        :class="[
          'p-2 rounded-lg transition-colors touchable',
          editMode 
            ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        ]"
        @click="handleEdit"
        title="Режим редактирования"
      >
        <Pencil class="w-4 h-4" />
      </button>
    </div>

    <!-- Режим просмотра -->
    <div v-if="!editMode" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Включено в стоимость -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Включено в стоимость</h3>
        </div>
        
        <div v-if="includedConditions" class="space-y-3">
          <div v-for="(line, index) in includedConditions.split('\n').filter(line => line.trim())" :key="index" class="flex items-start gap-3">
            <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-gray-700">{{ line.trim() }}</span>
          </div>
        </div>
        <div v-else class="text-gray-500 text-sm italic">Нет данных о включенных услугах</div>
      </div>

      <!-- Оплачивается отдельно -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Оплачивается отдельно</h3>
        </div>
        
        <div v-if="excludedConditions" class="space-y-3">
          <div v-for="(line, index) in excludedConditions.split('\n').filter(line => line.trim())" :key="index" class="flex items-start gap-3">
            <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-gray-700">{{ line.trim() }}</span>
          </div>
        </div>
        <div v-else class="text-gray-500 text-sm italic">Нет данных об оплачиваемых отдельно услугах</div>
      </div>
    </div>

    <!-- Режим редактирования -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Включено в стоимость -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Включено в стоимость
        </label>
        <textarea
          v-model="includedConditions"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="6"
          placeholder="Опишите, что включено в стоимость тура..."
        />
      </div>

      <!-- Оплачивается отдельно -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Оплачивается отдельно
        </label>
        <textarea
          v-model="excludedConditions"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="6"
          placeholder="Опишите, что оплачивается отдельно..."
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Pencil } from 'lucide-vue-next';
import type { Tour } from '@/types/tour';

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

const editMode = computed({
  get() {
    return props.editMode;
  },
  set(value: boolean) {
    emit('update:editMode', value);
  },
});

// Computed свойства для работы с conditions
const includedConditions = computed({
  get() {
    if (!tour.value?.conditions || !Array.isArray(tour.value.conditions)) {
      return '';
    }
    const includedCondition = tour.value.conditions.find(c => c.type === 'included');
    return includedCondition?.content || '';
  },
  set(value: string) {
    if (!tour.value) return;
    
    const conditions = [...(tour.value.conditions || [])];
    const includedIndex = conditions.findIndex(c => c.type === 'included');
    
    if (value) {
      const includedCondition = {
        content: value,
        title: 'Включено в стоимость',
        type: 'included' as const
      };
      
      if (includedIndex >= 0) {
        conditions[includedIndex] = includedCondition;
      } else {
        conditions.push(includedCondition);
      }
    } else if (includedIndex >= 0) {
      conditions.splice(includedIndex, 1);
    }
    
    tour.value = {
      ...tour.value,
      conditions
    };
  }
});

const excludedConditions = computed({
  get() {
    if (!tour.value?.conditions || !Array.isArray(tour.value.conditions)) {
      return '';
    }
    const excludedCondition = tour.value.conditions.find(c => c.type === 'excluded');
    return excludedCondition?.content || '';
  },
  set(value: string) {
    if (!tour.value) return;
    
    const conditions = [...(tour.value.conditions || [])];
    const excludedIndex = conditions.findIndex(c => c.type === 'excluded');
    
    if (value) {
      const excludedCondition = {
        content: value,
        title: 'Оплачивается отдельно',
        type: 'excluded' as const
      };
      
      if (excludedIndex >= 0) {
        conditions[excludedIndex] = excludedCondition;
      } else {
        conditions.push(excludedCondition);
      }
    } else if (excludedIndex >= 0) {
      conditions.splice(excludedIndex, 1);
    }
    
    tour.value = {
      ...tour.value,
      conditions
    };
  }
});

const handleEdit = () => {
  editMode.value = !editMode.value;
};
</script>
