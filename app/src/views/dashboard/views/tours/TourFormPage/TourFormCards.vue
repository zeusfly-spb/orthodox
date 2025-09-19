<template>
  <div v-if="isLoading">
    <Spinner />
  </div>
  <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p class="text-sm text-gray-500 mb-1">Количество мест в туре</p>
      <p class="text-lg font-semibold text-gray-900">{{ tour.seats - tour.customers_count }} / {{ tour.seats }}</p>
    </div>

    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p class="text-sm text-gray-500 mb-1">Гид</p>
      <div class="flex-1">
        <select 
          v-if="editMode"
          v-model="selectedGuide" 
          :disabled="isLoadingEntities"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option :value="{ id: '', title: '--' }">
            Выберите гида
          </option>
          <option 
            v-for="guide in [...guides, ...(selectedGuide ? [selectedGuide] : [])]" 
            :key="`guide-${guide.title}`" 
            :value="guide"
          >
            {{ guide.title }}
          </option>
        </select>
        <p v-else class="text-lg font-semibold text-gray-900">
          {{ selectedGuide?.title || '--' }}
        </p>
        <div v-if="entitiesError" class="text-red-500 text-sm mt-1">
          {{ entitiesError }}
        </div>
      </div>
    </div>

    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p class="text-sm text-gray-500 mb-1">Стоимость</p>
      <p class="text-sm text-gray-600 mb-1">
        {{ formatCurrency(tour.price) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Tour } from '@/types/tour';
import type { Entity } from '@/types/entity';
import type { Service } from '@/types/service';
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useToursStore } from '@/stores/tours';

const { formatCurrency } = useToursStore();

const props = defineProps<{
  currentItem: Tour;
  editMode: boolean;
  guide: Entity | null;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
  (e: 'update:guide', value: Entity | null): void;
}>();

const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value) {
    emit('update:currentItem', value);
  },
});

const toursStore = useToursStore();
const { isLoadingEntities, entitiesError, fetchEntities } = toursStore;

const isLoading = computed(() => toursStore.isLoadingEntities);
const selectedGuide = computed({
  get() {
    return props.guide;
  },
  set(value) {
    emit('update:guide', value);
  },
});
const guides = computed(() => toursStore.guides.filter(guide => guide.id !== selectedGuide.value?.id));

const focusFirstInput = async () => {
  await nextTick();
  
  const firstInput = document.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])') as HTMLElement;
  
  if (firstInput) {
    firstInput.focus();
  }
};

watch(() => props.editMode, async (newValue) => {
  if (newValue) {
    await focusFirstInput();
  }
});
</script>
