<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface ParameterItem {
  id: number | string
  title: string
  slug: string
  type: string
  children?: ParameterItem[]
}

interface Props {
  modelValue: Record<string, string>
  parametersData: ParameterItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: Props['modelValue']]
}>()

const localValue = ref<Record<string, string>>({})

watch(
  () => [props.modelValue, props.parametersData],
  ([newVal, parameters]) => {
    if (parameters && parameters.length) {
      // Создаем объект со всеми возможными полями
      const initialValue: Record<string, string> = {}
      parameters.forEach((param) => {
        const key = param.type.replace('tour', '').toLowerCase()
        initialValue[key] = newVal?.[key] || ''
      })
      localValue.value = initialValue
    }
  },
  { immediate: true, deep: true },
)

watch(
  localValue,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true },
)

const displayParameters = computed(() => {
  return props.parametersData.map((param) => ({
    type: param.type,
    title: param.title.replace(' туров', '').replace('ы ', ' '),
    slug: param.slug,
    options: param.children || [],
  }))
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div v-for="param in displayParameters" :key="param.type" class="space-y-3">
      <Label required>{{ param.title }}</Label>
      <Select v-model="localValue[param.type.replace('tour', '').toLowerCase()]">
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
