<template>
  <div>
    <TourFormHeader 
      :currentItem="tour" 
      v-model:editMode="editing" 
    />

    <TourFormOverview 
      v-model:currentItem="tour" 
      :editMode="editing" 
    />

    <TourFormCards v-model:currentItem="tour" />

    <TourFormLogistics v-model:currentItem="tour" />

    <TourFormObjects v-model:currentItem="tour" />

    <TourFormRatings v-model:currentItem="tour" v-model:editMode="editing" />

    <TourFormExtras v-model:currentItem="tour" />

    <TourFormSummary v-model:currentItem="tour" />
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '@/types/tour';
import { computed } from 'vue';
import TourFormHeader from './TourFormHeader.vue';
import TourFormOverview from './TourFormOverview.vue';
import TourFormCards from './TourFormCards.vue';
import TourFormLogistics from './TourFormLogistics.vue';
import TourFormObjects from './TourFormObjects.vue';
import TourFormRatings from './TourFormRatings.vue';
import TourFormExtras from './TourFormExtras.vue';
import TourFormSummary from './TourFormSummary.vue';
import { ref } from 'vue';


const props = defineProps<{
  currentItem: Tour;
  editMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
  (e: 'update:editMode', value: boolean): void;
}>();

const editing = computed({
  get() {
    return props.editMode;
  },
  set(value) {
    emit('update:editMode', value);
  },
});

const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value) {
    emit('update:currentItem', value);
  },
});
</script>
