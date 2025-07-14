<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Trash2, Calendar as CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import AppDatePicker from '@/components/app/AppDatePicker.vue'

export interface FormFields {
  id?: number | string
  title: string
  route: string
  price: number
  duration: number
  description: string
  is_active: boolean
  dates: string[]
  days: string[]
}

const props = withDefaults(
  defineProps<{
    open: boolean
    createTitle?: string
    editTitle?: string
    description?: string
    submitText?: string
    cancelText?: string
    item?: FormFields
  }>(),
  {
    createTitle: 'Добавить данные',
    editTitle: 'Редактировать данные',
    description: '',
    submitText: 'Сохранить',
    cancelText: 'Отмена',
  },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', item: Omit<FormFields, 'id' | 'created_at' | 'updated_at'>): void
}>()

const form = reactive<Omit<FormFields, 'id'>>({
  title: '',
  route: '',
  price: 0,
  duration: 1,
  description: '',
  is_active: true,
  dates: [],
  days: [],
})

const newDay = ref('')

watch(
  () => props.item,
  (newTour) => {
    if (newTour) {
      Object.assign(form, {
        title: newTour.title,
        route: newTour.route,
        price: newTour.price,
        duration: newTour.duration,
        description: newTour.description,
        is_active: newTour.is_active,
        dates: [...newTour.dates.map((item) => item.date)],
        days: [...newTour.days.map((item) => item.description)],
      })
    }
  },
  { immediate: true },
)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      resetForm()
    }
  },
)

const resetForm = () => {
  Object.assign(form, {
    title: '',
    route: '',
    price: 0,
    duration: 1,
    description: '',
    is_active: true,
    dates: [],
    days: [],
  })
  newDate.value = undefined
  newDay.value = ''
}

const newDate = ref<string>() // Храним дату как строку YYYY-MM-DD

const disabledDates = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return (date: Date) => date < today
})

const formatDate = (date: Date | undefined): string => {
  return date?.toISOString().split('T')[0] || ''
}

const addDate = () => {
  if (!newDate.value) {
    toast.error('Выберите дату')
    return
  }

  if (form.dates.includes(newDate.value)) {
    toast.error('Эта дата уже добавлена')
    return
  }

  form.dates.push(newDate.value)
  // Сортируем даты как строки в формате YYYY-MM-DD
  form.dates.sort((a, b) => {
    const dateA = new Date(a).getTime()
    const dateB = new Date(b).getTime()
    return dateA - dateB
  })
  newDate.value = undefined
}

const removeDate = (index: number) => {
  form.dates.splice(index, 1)
}

const addDay = () => {
  if (!newDay.value.trim()) {
    toast.error('Введите описание дня')
    return
  }

  if (form.days.includes(newDay.value)) {
    toast.error('Этот день уже добавлен')
    return
  }

  form.days.push(newDay.value)
  newDay.value = ''
}

const removeDay = (index: number) => {
  form.days.splice(index, 1)
}

const onSubmit = () => {
  if (!form.title || !form.route || form.price <= 0 || form.duration <= 0) {
    toast.error('Заполните обязательные поля')
    return
  }

  if (form.dates.length === 0) {
    toast.error('Добавьте хотя бы одну дату проведения тура')
    return
  }

  emit('submit', form)
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)" :auto-focus="false">
    <DialogContent class="sm:max-w-2xl" @openAutoFocus.prevent>
      <DialogHeader data-autofocus>
        <DialogTitle>
          {{ item ? props.editTitle : props.createTitle }}
        </DialogTitle>
        <DialogDescription>
          {{ props.description }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit">
        <div class="grid gap-4 py-4">
          <!-- Основные поля -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="title" required>Название тура</Label>
              <Input id="title" v-model="form.title" />
            </div>
            <div class="space-y-2">
              <Label for="route" required>Маршрут</Label>
              <Input id="route" v-model="form.route" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="space-y-2">
              <Label for="price" required>Цена (₽)</Label>
              <Input id="price" v-model.number="form.price" type="number" min="0" />
            </div>
            <div class="space-y-2">
              <Label for="duration" required>Длительность (дни)</Label>
              <Input id="duration" v-model.number="form.duration" type="number" min="1" />
            </div>
            <div class="flex items-center space-x-2 pt-7">
              <Checkbox id="is_active" v-model:checked="form.is_active" />
              <Label for="is_active">Активный тур</Label>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="description">Описание тура</Label>
            <Textarea id="description" v-model="form.description" rows="3" />
          </div>

          <!-- Даты проведения -->
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
                  <AppDatePicker v-model="newDate" @add-date="addDate" />
                </PopoverContent>
                <PopoverAnchor />
              </Popover>
            </div>
            <div v-if="form.dates.length" class="mt-2 space-y-1">
              <div v-for="(date, index) in form.dates" :key="date" class="flex items-center gap-2">
                <span>{{ date }}</span>
                <Button type="button" variant="ghost" size="sm" @click="removeDate(index)">
                  <Trash2 class="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Дни программы -->
          <div class="space-y-2">
            <Label>Программа по дням</Label>
            <div class="flex gap-2">
              <Input v-model="newDay" placeholder="Описание дня" />
              <Button type="button" @click="addDay" :disabled="!newDay.trim()"> Добавить </Button>
            </div>
            <div v-if="form.days.length" class="mt-2 space-y-1">
              <div v-for="(day, index) in form.days" :key="index" class="flex items-center gap-2">
                <Label class="p-2 font-bold">{{ index + 1 }}</Label>
                <div class="py-2 my-2 w-full">
                  <div class="p-2 rounded-md border">{{ day }}</div>
                </div>
                <Button type="button" variant="ghost" size="sm" @click="removeDay(index)">
                  <Trash2 class="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" type="button" @click="() => emit('update:open', false)">
            {{ props.cancelText }}
          </Button>
          <Button type="submit">
            {{ props.submitText }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
