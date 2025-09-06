<script setup lang="ts">
import { provide, ref } from 'vue';

const props = defineProps<{
  defaultValue?: string;
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const activeTab = ref(props.defaultValue || props.modelValue || '');

function setActiveTab(value: string) {
  activeTab.value = value;
  emit('update:modelValue', value);
}

provide('activeTab', activeTab);
provide('setActiveTab', setActiveTab);
</script>

<template>
  <div class="flex flex-col w-full">
    <slot />
  </div>
</template>
