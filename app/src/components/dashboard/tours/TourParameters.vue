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

const localValue = ref<Record<string, string>>({ ...props.modelValue })

watch(
  () => props.parametersData,
  (parameters) => {
    if (parameters && parameters.length) {
      const newValue: Record<string, string> = { ...localValue.value }
      parameters.forEach((param) => {
        const key = param.type.replace('tour', '').toLowerCase()
        if (!(key in newValue)) {
          newValue[key] = ''
        }
      })
      localValue.value = newValue
    }
  },
  { immediate: true },
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
    <div v-for="param in displayParameters" :key="param.type" class="space-y-2">
      <Label required>{{ param.title }}</Label>
      <Select
        v-model="localValue[param.type.replace('tour', '').toLowerCase()]"
        @update:modelValue="
          (val) => (localValue[param.type.replace('tour', '').toLowerCase()] = val)
        "
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
