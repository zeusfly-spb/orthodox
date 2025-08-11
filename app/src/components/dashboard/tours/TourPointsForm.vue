<script setup lang="ts">
import { Trash2, Search, Check } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'vue-sonner'
import { ref } from 'vue'
import { cn } from '@/lib/utils'
import { entityApi } from '@/api/entities'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from '@/components/ui/combobox'
import type { Entity } from '@/types/entity.ts'

interface PointItem {
  entity: {
    id: number
    title?: string
    description?: string | null
  }
  time: string
  order_column: number
}

const props = defineProps<{
  modelValue: PointItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PointItem[]]
}>()

const searchQuery = ref('')
const points = ref<Entity[]>([])
const isLoadingPoints = ref(false)

const debounce = (fn: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

const debouncedSearchPoints = debounce(async (query: string) => {
  if (query.length < 2) {
    points.value = []
    return
  }

  try {
    isLoadingPoints.value = true
    const response = await entityApi.fetchData({ 'filter[title]': query })
    points.value = response.data
  } catch (error) {
    toast.error('Ошибка поиска')
    console.error(error)
  } finally {
    isLoadingPoints.value = false
  }
}, 300)

const handleInput = (event: Event) => {
  const query = (event.target as HTMLInputElement).value
  searchQuery.value = query
  debouncedSearchPoints(query)
}

const selectPoint = (point: Entity) => {
  const newPoint: PointItem = {
    entity: {
      id: point.id,
      title: point.title,
      description: point.description,
    },
    time: '',
    order_column: props.modelValue.length + 1,
  }
  emit('update:modelValue', [...props.modelValue, newPoint])
  searchQuery.value = ''
  points.value = []
}

const updatePointTime = (index: number, time: string) => {
  const updatedPoints = [...props.modelValue]
  updatedPoints[index].time = time
  emit('update:modelValue', updatedPoints)
}

const removePoint = (index: number) => {
  const updatedPoints = [...props.modelValue]
  updatedPoints.splice(index, 1)
  emit('update:modelValue', updatedPoints)
}
</script>

<template>
  <div class="space-y-4">
    <Label>Прикрепленные объекты</Label>

    <!-- Search and add new point -->
    <div class="mb-4">
      <Combobox>
        <ComboboxAnchor class="w-full">
          <div class="relative w-full items-center">
            <ComboboxInput
              class="pl-2"
              placeholder="Поиск объектов..."
              :model-value="searchQuery"
              @input="handleInput"
            />
            <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
              <Search class="size-4 text-muted-foreground" />
            </span>
          </div>
        </ComboboxAnchor>

        <ComboboxList
          v-if="points.length > 0 || isLoadingPoints"
          class="w-full max-w-md max-h-60 overflow-y-auto overscroll-contain relative scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-md hover:scrollbar-thumb-gray-500"
        >
          <ComboboxEmpty v-if="isLoadingPoints">
            <div class="w-full px-6">Загрузка...</div>
          </ComboboxEmpty>
          <ComboboxEmpty v-else-if="points.length === 0 && searchQuery.length >= 2">
            <div class="w-full px-6">Объекты не найдены</div>
          </ComboboxEmpty>

          <ComboboxItem
            v-for="point in points"
            :key="point.id"
            :value="point.id.toString()"
            @click="selectPoint(point)"
            class="cursor-pointer"
          >
            <div class="flex flex-col">
              <div class="flex flex-row items-center gap-2">
                <span class="font-medium">{{ point.id }}</span>
                <span class="font-medium">{{ point.title }}</span>
              </div>
              <span v-if="point.description" class="text-sm text-muted-foreground line-clamp-1">
                {{ point.description }}
              </span>
            </div>

            <ComboboxItemIndicator>
              <Check :class="cn('ml-auto h-4 w-4')" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxList>
      </Combobox>
    </div>

    <!-- List of attached points -->
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
            <div class="mt-2">
              <Label>Время посещения</Label>
              <input
                type="time"
                v-model="point.time"
                @change="(e) => updatePointTime(index, e.target.value)"
                class="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
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
