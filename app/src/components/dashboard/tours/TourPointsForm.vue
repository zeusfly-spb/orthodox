<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

interface PointEntity {
  id: number
  title: string
  description: string | null
  // other fields from the entity
}

interface PointItem {
  entity: PointEntity
  time: string
  order_column: number
}

const props = defineProps<{
  modelValue: PointItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PointItem[]]
}>()

const removePoint = (index: number) => {
  const updatedPoints = [...props.modelValue]
  updatedPoints.splice(index, 1)
  emit('update:modelValue', updatedPoints)
}
</script>

<template>
  <div class="space-y-4">
    <Label>Прикрепленные объекты</Label>

    <div v-if="modelValue.length" class="space-y-4">
      <Card
        v-for="(point, index) in modelValue"
        :key="index"
        class="p-4 relative group shadow-none"
      >
        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="removePoint(index)"
            class="text-destructive"
          >
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>

        <div class="space-y-4">
          <div>
            <Label>Объект {{ index + 1 }}</Label>
            <h3 class="font-medium mt-1">{{ point.entity.title }}</h3>
            <p class="text-sm text-muted-foreground mt-1">{{ point.time }}</p>
          </div>
          <div v-if="point.entity.description">
            <Label>Описание</Label>
            <p class="mt-1 whitespace-pre-wrap">{{ point.entity.description }}</p>
          </div>
        </div>
      </Card>
    </div>

    <div v-else class="text-muted-foreground text-sm">Нет прикрепленных объектов</div>
  </div>
</template>
