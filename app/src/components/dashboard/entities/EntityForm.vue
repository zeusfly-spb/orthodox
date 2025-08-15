<script setup lang="ts">
import { watch, nextTick, ref, onMounted, reactive } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import { entityApi } from '@/api/entities.ts'
import EntityParameters from '@/components/dashboard/entities/EntityParameters.vue'
import MarkerMap from '@/components/maps/MarkerMap.vue'
import { MapPinHouse } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import api from '@/api/httpClient'

interface FormFields {
  title: string
  description: string
  email: string
  phone: string
  address: string
  latitude: number | null
  longitude: number | null
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
  (e: 'submit', item: FormFields): void
  (e: 'dismiss'): void
}>()

const formTemplate: FormFields = {
  title: '',
  description: '',
  email: '',
  phone: '',
  address: '',
}

const requiredFields: Array<keyof FormFields> = ['title', 'description']

const parametersData = ref<any>([])

const fetchParameters = async () => {
  try {
    const response = await entityApi.getData('parameters')
    parametersData.value = response.data
  } catch (error) {
    toast.error('Ошибка при загрузке параметров')
    console.error(error)
  }
}

onMounted(() => {
  fetchParameters()
})

const form = reactive<Omit<FormFields, 'id'>>({
  title: '',
  description: '',
  phone: '',
  email: '',
  address: '',
  latitude: null,
  longitude: null,
  parameters: {},
})

const resetForm = () => {
  markerData.value = null

  Object.assign(form, {
    title: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    latitude: null,
    longitude: null,
    parameters: {},
  })
}

const handleMarkerUpdate = ({ lat, lng }: { lat: number; lng: number }) => {
  form.latitude = lat
  form.longitude = lng
}

const markerData = ref<{ type: string; coordinates: number[] } | null>(null)

const findPoint = async (address: string) => {
  try {
    const response = await api.post('/manage/suggestions/address', { address })
    const lat = response.data.data.latitude
    const lng = response.data.data.longitude

    markerData.value = {
      type: 'Point',
      coordinates: [lat, lng],
    }

    handleMarkerUpdate({ lat, lng })
  } catch (error) {
    toast.error(error.response.data.message || 'Ошибка при загрузке координат')
    console.error(error)
  }
}

watch(
  () => props.item,
  (newEntity) => {
    if (newEntity) {
      const parameters = {
        entityType: newEntity.entityType?.id,
      }

      Object.assign(form, {
        title: newEntity.title,
        description: newEntity.description,
        phone: newEntity.phone,
        email: newEntity.email,
        address: newEntity.requisite?.real_address,
        latitude: newEntity.location?.coordinates[1],
        longitude: newEntity.location?.coordinates[0],
        parameters,
      })

      if (newEntity.location) {
        markerData.value = {
          type: newEntity.location.type,
          coordinates: [newEntity.location?.coordinates[1], newEntity.location?.coordinates[0]],
        }
      }
    }
  },
  { immediate: true },
)

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) {
      await nextTick()
      resetForm()
      emit('dismiss')
    }
  },
)

const onSubmit = () => {
  if (!form.title || Object.keys(form.parameters).length === 0) {
    toast.error('Заполните обязательные поля')
    return
  }

  emit('submit', { ...form })
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="(value) => emit('update:open', value)" :auto-focus="false">
    <DialogContent class="sm:max-w-[800px]" @openAutoFocus.prevent>
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
          <div class="grid gap-4">
            <div class="space-y-2">
              <EntityParameters v-model="form.parameters" :parameters-data="parametersData" />
            </div>
            <div class="space-y-2">
              <Label for="title" required>Название</Label>
              <Input id="title" v-model="form.title" />
            </div>
            <div class="space-y-2">
              <Label for="description" required>Описание</Label>
              <Textarea id="description" v-model="form.description" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" v-model="form.email" type="email" />
            </div>
            <div class="space-y-2">
              <Label for="phone">Телефон</Label>
              <Input id="phone" v-model="form.phone" placeholder="+7 (XXX) XXX-XX-XX" />
            </div>
          </div>

          <div class="grid gap-4">
            <Label for="address">Адрес</Label>
            <div class="flex items-center flex-row gap-4">
              <div class="flex grow gap-2 space-y-2">
                <Input id="address" v-model="form.address" />
              </div>
              <div class="flex shrink space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        class="border-emerald-500 text-emerald-500 hover:text-emerald-600"
                        :disabled="!form.address"
                        @click="findPoint(form.address)"
                      >
                        <MapPinHouse class="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Найти на карте</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <!-- Поля для координат -->
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="space-y-2">
              <Label for="latitude">Широта</Label>
              <Input id="latitude" v-model="form.latitude" type="number" disabled />
            </div>
            <div class="space-y-2">
              <Label for="longitude">Долгота</Label>
              <Input id="longitude" v-model="form.longitude" type="number" disabled />
            </div>
          </div>

          <!-- Карта -->
          <div class="flex flex-col size-full my-4">
            <MarkerMap
              :height="'480px'"
              :zoom="14"
              :marker-data="markerData"
              @update:coordinates="handleMarkerUpdate"
            />
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

<style scoped>
[required]::after {
  content: ' *';
  color: hsl(0, 84.2%, 60.2%);
}
</style>
