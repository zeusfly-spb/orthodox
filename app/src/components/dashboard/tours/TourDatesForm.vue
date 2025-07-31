<script setup lang="ts">
import { ref } from 'vue'
import { Trash2, Calendar as CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover'
import AppDatePicker from '@/components/app/AppDatePicker.vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const newDate = ref<string>()

const disabledDates = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const addDate = () => {
  if (!newDate.value) {
    toast.error('Выберите дату')
    return
  }

  if (props.modelValue.includes(newDate.value)) {
    toast.error('Эта дата уже добавлена')
    return
  }

  const updatedDates = [...props.modelValue, newDate.value].sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime()
  })

  emit('update:modelValue', updatedDates)
  newDate.value = undefined
}

const removeDate = (index: number) => {
  const updatedDates = [...props.modelValue]
  updatedDates.splice(index, 1)
  emit('update:modelValue', updatedDates)
}
</script>

<template>
  <div class="space-y-2">
    <Label required>Даты проведения</Label>
    <div class="flex gap-2">
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline">
            <CalendarIcon class="mr-2 h-4 w-4" />
            Выбрать дату
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <AppDatePicker v-model="newDate" :disabled-dates="disabledDates" @add-date="addDate" />
        </PopoverContent>
        <PopoverAnchor />
      </Popover>
    </div>
    <div v-if="modelValue.length" class="mt-2 space-y-1">
      <div v-for="(date, index) in modelValue" :key="date" class="flex items-center gap-2">
        <span>{{ date }}</span>
        <Button type="button" variant="ghost" size="sm" @click="removeDate(index)">
          <Trash2 class="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  </div>
</template>
