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
  Object.assign(form, {
    title: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    latitude: '',
    longitude: '',
    parameters: {},
  })
}

const handleMarkerUpdate = ({ lat, lng }: { lat: number; lng: number }) => {
  form.latitude = lat
  form.longitude = lng
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
            <div class="space-y-2">
              <Label for="address">Адрес</Label>
              <Input id="address" v-model="form.address" />
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
              :marker-data="item?.location"
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
