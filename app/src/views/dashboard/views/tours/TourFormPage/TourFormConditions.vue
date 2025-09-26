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

    <div class="space-y-6">
      <!-- Условия участия -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Условия участия
        </label>
        <textarea
          v-model="currentItem.conditions"
          :disabled="!editMode"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          rows="4"
          placeholder="Опишите условия участия в туре..."
        />
      </div>

      <!-- Требования к участникам -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Требования к участникам
        </label>
        <textarea
          v-model="currentItem.requirements"
          :disabled="!editMode"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          rows="4"
          placeholder="Укажите требования к участникам тура..."
        />
      </div>

      <!-- Что включено в стоимость -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Что включено в стоимость
        </label>
        <textarea
          v-model="currentItem.included_in_price"
          :disabled="!editMode"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          rows="4"
          placeholder="Опишите, что включено в стоимость тура..."
        />
      </div>

      <!-- Что не включено в стоимость -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Что не включено в стоимость
        </label>
        <textarea
          v-model="currentItem.not_included_in_price"
          :disabled="!editMode"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          rows="4"
          placeholder="Опишите, что не включено в стоимость тура..."
        />
      </div>

      <!-- Дополнительные услуги -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Дополнительные услуги
        </label>
        <textarea
          v-model="currentItem.additional_services"
          :disabled="!editMode"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          rows="4"
          placeholder="Опишите дополнительные услуги..."
        />
      </div>

      <!-- Правила отмены -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Правила отмены и возврата
        </label>
        <textarea
          v-model="currentItem.cancellation_policy"
          :disabled="!editMode"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          rows="4"
          placeholder="Опишите правила отмены и возврата средств..."
        />
      </div>

      <!-- Медицинские требования -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Медицинские требования
        </label>
        <textarea
          v-model="currentItem.medical_requirements"
          :disabled="!editMode"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          rows="4"
          placeholder="Укажите медицинские требования для участия в туре..."
        />
      </div>

      <!-- Документы -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Необходимые документы
        </label>
        <textarea
          v-model="currentItem.required_documents"
          :disabled="!editMode"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          rows="4"
          placeholder="Перечислите необходимые документы..."
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

const currentItem = computed({
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

const handleEdit = () => {
  editMode.value = !editMode.value;
};
</script>
