<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Calendar as CalendarIcon, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover'
import { toast } from 'vue-sonner'
import AppDatePicker from '@/components/app/AppDatePicker.vue'
import { Card, CardContent } from '@/components/ui/card'
import TourDaysForm from '@/components/dashboard/tours/TourDaysForm.vue'

interface DayItem {
  title: string
  description: string
}

interface FormFields {
  id?: number | string
  title: string
  route: string
  price: number
  duration: number
  description: string
  is_active: boolean
  dates: string[]
  days: DayItem[]
}

const props = withDefaults(
  defineProps<{
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
  (e: 'submit', item: Omit<FormFields, 'id' | 'created_at' | 'updated_at'>): void
  (e: 'cancel'): void
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

const newDate = ref<string>()

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
        days: [...newTour.days],
      })
    }
  },
  { immediate: true },
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
}

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
}
</script>

<template>
  <Card class="mb-8 gap-0 border-none shadow-custom">
    <CardContent>
      <div class="container mx-auto">
        <h2 class="text-2xl font-bold mb-6">
          {{ props.item ? props.editTitle : props.createTitle }}
        </h2>
        <p class="text-muted-foreground mb-6">{{ props.description }}</p>

        <form @submit.prevent="onSubmit">
          <div class="grid gap-4 py-4">
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
                <div
                  v-for="(date, index) in form.dates"
                  :key="date"
                  class="flex items-center gap-2"
                >
                  <span>{{ date }}</span>
                  <Button type="button" variant="ghost" size="sm" @click="removeDate(index)">
                    <Trash2 class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>

            <TourDaysForm v-model="form.days" />
          </div>

          <div class="flex gap-4 mt-6">
            <Button variant="outline" type="button" @click="emit('cancel')">
              {{ props.cancelText }}
            </Button>
            <Button type="submit">
              {{ props.submitText }}
            </Button>
          </div>
        </form>
      </div>
    </CardContent>
  </Card>
</template>
