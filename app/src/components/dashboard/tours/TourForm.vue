<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'vue-sonner'
import { Card, CardContent } from '@/components/ui/card'
import TourDaysForm from '@/components/dashboard/tours/TourDaysForm.vue'
import TourDatesForm from '@/components/dashboard/tours/TourDatesForm.vue'

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
  <form @submit.prevent="onSubmit">
    <Card class="mb-8 gap-0 border-none shadow-custom">
      <CardContent>
        <div class="container mx-auto">
          <h2 class="text-2xl font-bold mb-6">
            {{ props.item ? props.editTitle : props.createTitle }}
          </h2>
          <p class="text-muted-foreground mb-6">{{ props.description }}</p>

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
          </div>
        </div>
      </CardContent>
    </Card>

    <Card class="mb-8 gap-0 border-none shadow-custom">
      <CardContent>
        <div class="container mx-auto">
          <TourDatesForm v-model="form.dates" />
        </div>
      </CardContent>
    </Card>

    <Card class="mb-8 gap-0 border-none shadow-custom">
      <CardContent>
        <div class="container mx-auto">
          <TourDaysForm v-model="form.days" />
        </div>
      </CardContent>
    </Card>

    <div class="flex justify-end-safe gap-4 mt-6">
      <Button
        variant="outline"
        type="button"
        class="px-8 py-6 border-emerald-500 text-emerald-500 hover:text-emerald-600"
        @click="emit('cancel')"
      >
        {{ props.cancelText }}
      </Button>
      <Button
        type="submit"
        class="bg-emerald-500 text-white shadow hover:bg-emerald-500/90 px-8 py-6"
      >
        {{ props.submitText }}
      </Button>
    </div>
  </form>
</template>
