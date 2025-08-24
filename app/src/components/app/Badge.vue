<template>
  <span
    class="inline-flex items-center rounded-full px-3 py-1 mr-1 text-xs font-medium ring-1 ring-inset"
    :class="`text-${color}-600 bg-${color}-50 ring-${color}-100`"
  >
    {{ caption }}
  </span>
</template>

<script setup lang="ts">
import {computed} from "vue";
type Kind = 'opublikovano' | 'ne-opublikovano' | 'bazovyi' | 'po-zaiavke';
const props = defineProps<{
  type: {
    type: Kind,
    required: true,
  },
  caption: {
    type: String
  }
}>();
const color = computed(() => ({opublikovano: 'emerald', 'ne-opublikovano': 'rose', bazovyi: 'amber', 'po-zaiavke': 'sky'}[props.type]));
</script>
