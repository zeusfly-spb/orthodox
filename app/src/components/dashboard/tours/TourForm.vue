<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'vue-sonner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import TourDaysForm from '@/components/dashboard/tours/TourDaysForm.vue'
import TourDatesForm from '@/components/dashboard/tours/TourDatesForm.vue'
import TourParameters from '@/components/dashboard/tours/TourParameters.vue'
import TourPointsForm from '@/components/dashboard/tours/TourPointsForm.vue'
import { tourApi } from '@/api/tours.ts'
import RouteMap from '@/components/maps/RouteMap.vue'

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
  points: PointItem[]
  parameters: Record<string, string>
}

const parametersData = ref<any>([])

const fetchParameters = async () => {
  try {
    const response = await tourApi.getData('parameters')
    parametersData.value = response.data
  } catch (error) {
    toast.error('Ошибка при загрузке параметров')
    console.error(error)
  }
}

onMounted(() => {
  fetchParameters()
})

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
  points: [],
  parameters: {},
})

watch(
  () => props.item,
  (newTour) => {
    if (newTour) {
      const parameters = {
        tourType: newTour.tourType?.id,
        tourCategory: newTour.tourCategory?.id,
        tourTransport: newTour.tourTransport?.id,
        tourStatus: newTour.tourStatus?.id,
      }

      Object.assign(form, {
        title: newTour.title,
        route: newTour.route,
        price: newTour.price,
        duration: newTour.duration,
        description: newTour.description,
        is_active: newTour.is_active,
        dates: Array.isArray(newTour.dates)
          ? newTour.dates.map((item) => (typeof item === 'object' ? item.date : item))
          : [],
        days: Array.isArray(newTour.days) ? [...newTour.days] : [],
        points: Array.isArray(newTour.points) ? [...newTour.points] : [],
        parameters,
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
    points: [],
  })
}

const onSubmit = () => {
  if (!form.title || !form.route || form.price <= 0 || form.duration <= 0) {
    toast.error('Заполните обязательные поля')
    return
  }

  emit('submit', form)
}

// Map click handling
const mapRef = ref()

const openPoint = (id) => {
  mapRef.value?.flyToPointById(id)
}

const handleMarkerClick = (id) => {
  console.log('Клик по маркеру с entity ID:', id)
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="flex justify-end-safe gap-4 mb-8">
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

    <Card class="mb-8 gap-0 border-none shadow-custom">
      <CardContent>
        <div>
          <h2 class="text-2xl font-bold mb-6">
            {{ props.item ? props.editTitle : props.createTitle }}
          </h2>
          <p class="text-muted-foreground mb-6">{{ props.description }}</p>

          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-3">
                <Label for="title" required>Название тура</Label>
                <Input id="title" v-model="form.title" />
              </div>
              <div class="space-y-3">
                <Label for="route" required>Маршрут</Label>
                <Input id="route" v-model="form.route" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div class="space-y-3">
                <Label for="price" required>Цена (₽)</Label>
                <Input id="price" v-model.number="form.price" type="number" min="0" />
              </div>
              <div class="space-y-3">
                <Label for="duration" required>Длительность (дни)</Label>
                <Input id="duration" v-model.number="form.duration" type="number" min="1" />
              </div>
              <div class="flex items-center space-x-2 pt-7">
                <Checkbox id="is_active" v-model:checked="form.is_active" />
                <Label for="is_active">Активный тур</Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card class="mb-8 gap-0 border-none shadow-custom">
      <CardContent>
        <TourParameters v-model="form.parameters" :parameters-data="parametersData" />
      </CardContent>
    </Card>

    <Card class="mb-8 gap-0 border-none shadow-custom">
      <CardContent>
        <div class="space-y-3">
          <Label for="description">Описание тура</Label>
          <Textarea id="description" v-model="form.description" rows="3" />
        </div>
      </CardContent>
    </Card>

    <Card class="mb-8 gap-0 border-none shadow-custom">
      <CardContent>
        <div>
          <TourDaysForm v-model="form.days" />
        </div>
      </CardContent>
    </Card>

    <Card class="mb-8 gap-0 border-none shadow-custom">
      <CardContent>
        <div>
          <TourDatesForm v-model="form.dates" />
        </div>
      </CardContent>
    </Card>

    <Card class="mb-8 gap-0 border-none shadow-custom">
      <CardContent>
        <div>
          <TourPointsForm v-model="form.points" />
        </div>
      </CardContent>
    </Card>

    <Card class="mb-8 gap-0 border-none shadow-custom">
      <CardHeader>
        <div class="flex flex-row flex-wrap items-center gap-4 mb-4">
          <Button
            variant="outline"
            type="button"
            v-for="point in form.points"
            :key="point.entity.id"
            @click="openPoint(point.entity.id)"
          >
            {{ point.entity.title }}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <RouteMap
            ref="mapRef"
            :height="'480px'"
            :points="form.points"
            @marker-click="handleMarkerClick"
          />
        </div>
      </CardContent>
    </Card>
  </form>
</template>
