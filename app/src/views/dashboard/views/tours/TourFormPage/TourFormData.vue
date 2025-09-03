<template>
	<div>
		<TourFormHeader 
      :currentItem="tour" 
    />

    <TourFormOverview
      v-model:currentItem="tour"
    />

    <TourFormCards 
      v-model:currentItem="tour" 
    /> 

    <TourFormLogistics 
      v-model:currentItem="tour"
    />

    <TourFormObjects
      v-model:currentItem="tour" 
    />

    <TourFormRatings
      v-model:currentItem="tour" 
    />

    <TourFormExtras 
      v-model:currentItem="tour" 
    />

    <TourFormSummary
      v-model:currentItem="tour" 
    />
	</div>
</template>

<script setup lang="ts">
	import type { Tour } from "@/types/tour";
	import { computed } from "vue";
	import TourFormHeader from "./TourFormHeader.vue";
	import TourFormOverview from "./TourFormOverview.vue";
	import TourFormCards from "./TourFormCards.vue";
	import TourFormLogistics from "./TourFormLogistics.vue";
	import TourFormObjects from "./TourFormObjects.vue";
	import TourFormRatings from "./TourFormRatings.vue";
	import TourFormExtras from "./TourFormExtras.vue";
	import TourFormSummary from "./TourFormSummary.vue";

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
</script>