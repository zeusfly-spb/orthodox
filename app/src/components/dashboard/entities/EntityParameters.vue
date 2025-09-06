<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ParameterItem {
  id: number | string;
  title: string;
  slug: string;
  type: string;
  [key: string]: any;
}

interface Props {
  modelValue: Record<string, number | string>;
  parametersData: {
    id: number | string;
    title: string;
    slug: string;
    type: string;
    children?: ParameterItem[];
  }[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: Props['modelValue']];
}>();

const displayValues = ref<Record<string, string>>({});

// Инициализация при получении данных
watch(
  () => [props.parametersData, props.modelValue],
  ([parameters, modelValue]) => {
    if (parameters && parameters.length) {
      const newDisplayValues: Record<string, string> = {};
      parameters.forEach((param) => {
        const currentId = modelValue?.[param.type];
        if (currentId) {
          const item = param.children?.find((child) => child.id === currentId);
          if (item) {
            newDisplayValues[param.type] = item.slug;
          }
        } else {
          newDisplayValues[param.type] = '';
        }
      });
      displayValues.value = newDisplayValues;
    }
  },
  { immediate: true, deep: true },
);

// Обработчик изменения значения
const handleChange = (paramType: string, slug: string) => {
  const category = props.parametersData.find((p) => p.type === paramType);
  const selectedItem = category?.children?.find((child) => child.slug === slug);

  if (selectedItem) {
    const newValue = {
      ...props.modelValue,
      [paramType]: selectedItem.id,
    };
    emit('update:modelValue', newValue);

    displayValues.value = {
      ...displayValues.value,
      [paramType]: selectedItem.slug,
    };
  }
};

const displayParameters = computed(() => {
  return props.parametersData.map((param) => ({
    type: param.type,
    title: param.title, // param.title.replace(' инфраструктуры', '').replace('ы ', ' '),
    slug: param.slug,
    options: param.children || [],
  }));
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div v-for="param in displayParameters" :key="param.type" class="space-y-2">
      <Label required>{{ param.title }}</Label>
      <Select
        :modelValue="displayValues[param.type]"
        @update:modelValue="(slug) => handleChange(param.type, slug)"
      >
        <SelectTrigger class="w-full">
          <SelectValue :placeholder="`Выберите ${param.title.toLowerCase()}`" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="item in param.options" :key="item.id" :value="item.slug">
            {{ item.title }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
