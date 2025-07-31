<script setup lang="ts">
import { reactive } from 'vue'
import { Trash2, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { toast } from 'vue-sonner'

export interface DayItem {
  title: string
  description: string
}

const props = defineProps<{
  modelValue: DayItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: DayItem[]]
}>()

const newDay = reactive<DayItem>({
  title: '',
  description: '',
})

const addDay = () => {
  if (!newDay.title.trim() || !newDay.description.trim()) {
    toast.error('Заполните название и описание дня')
    return
  }

  const updatedDays = [...props.modelValue, { ...newDay }]
  emit('update:modelValue', updatedDays)

  // Сброс формы
  newDay.title = ''
  newDay.description = ''
}

const removeDay = (index: number) => {
  const updatedDays = [...props.modelValue]
  updatedDays.splice(index, 1)
  emit('update:modelValue', updatedDays)
}
</script>

<template>
  <div class="space-y-4">
    <Label>Программа по дням</Label>

    <Card class="p-4 mb-4">
      <div class="grid grid-cols-1 gap-4">
        <div class="space-y-2">
          <Label for="day-title">Название дня</Label>
          <Input id="day-title" v-model="newDay.title" placeholder="Например: День 1: Прибытие" />
        </div>
        <div class="space-y-2">
          <Label for="day-description">Описание дня</Label>
          <Textarea
            id="day-description"
            v-model="newDay.description"
            placeholder="Подробное описание программы дня"
            rows="3"
          />
        </div>
        <Button
          type="button"
          @click="addDay"
          :disabled="!newDay.title.trim() || !newDay.description.trim()"
          class="mt-2"
        >
          <Plus class="mr-2 h-4 w-4" />
          Добавить день
        </Button>
      </div>
    </Card>

    <div v-if="modelValue.length" class="space-y-4">
      <Card v-for="(day, index) in modelValue" :key="index" class="p-4 relative group">
        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="removeDay(index)"
            class="text-destructive"
          >
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>

        <div class="space-y-4">
          <div>
            <Label>День {{ index + 1 }}</Label>
            <h3 class="font-medium mt-1">{{ day.title }}</h3>
          </div>
          <div>
            <Label>Описание</Label>
            <p class="mt-1 whitespace-pre-wrap">{{ day.description }}</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
