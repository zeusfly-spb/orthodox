<template>
    <div class="flex gap-6 mb-8">
      <!-- Thumbnail -->
      <div class="flex-shrink-0">
        <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
          <div class="w-16 h-16 bg-yellow-400 rounded-full"></div>
        </div>
      </div>
      <!-- Main Info -->
      <div class="flex-1">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          {{ tour.title || 'Загрузка данных...'}}
        </h2>
        <p class="text-gray-600 mb-2">
          {{ datesString }}
        </p>
        <Badge
          v-if="tour.tourStatus" 
          :type="tour.tourStatus?.slug" 
          :caption="tour.tourStatus?.title" 
        />
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Badge from "@/components/app/Badge.vue";
import type { Tour } from "@/types/tour";
import { useToursStore } from "@/stores/tours";

const { formattedDate } = useToursStore();

const props = defineProps<{
  currentItem: Tour;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
}>();

const tour = computed({
    get() {
        return props.currentItem;
    },
    set(value) {
        emit('update:currentItem', value);
    }
});

const datesString = computed(() => {
  const first = tour.value.dates[0];
  return `${formattedDate(first.date_start)} / ${formattedDate(first.date_end)}`;
});
</script>

