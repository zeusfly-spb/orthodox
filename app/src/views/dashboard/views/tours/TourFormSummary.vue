<template>
    <div class="flex justify-between items-center p-6 bg-gray-50 rounded-lg">
      <div class="text-right">
        <p class="text-sm text-gray-600 mb-1">Всего к оплате:</p>
        <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(tour.price) }}</p>
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-600 mb-1">Оплачено:</p>
        <p class="text-2xl font-bold text-emerald-600">{{ formatCurrency(tour.price) }}</p>
      </div>
    </div>
    
</template>

<script lang="ts" setup>
import type { Tour } from "@/types/tour";
import { computed } from "vue";
import { useToursStore } from "@/stores/tours";

const props = defineProps <{
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

const { formatCurrency } = useToursStore();
</script>