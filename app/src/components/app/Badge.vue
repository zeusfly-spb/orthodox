<template>
  <span
    class="inline-flex items-center rounded-full px-3 py-1 mr-1 text-xs font-medium ring-1 ring-inset"
    :class="type"
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
</script>

<style scoped>
.opublikovano {
  color: #059669;
  background-color: #ecfdf5;
  --tw-ring-color: #d1fae5;
}
.ne-opublikovano {
  color: #e11d48;
  background-color: #fff1f2;
  --tw-ring-color: #ffe4e6;
}
.bazovyi {
  color: #d97706;
  background-color: #fffbeb;
  --tw-ring-color: #fed7aa;
}
.po-zaiavke {
  color: #0284c7;
  background-color: #f0f9ff;
  --tw-ring-color: #e0f2fe;
}
</style>