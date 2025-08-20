<script setup lang="ts">
import { watch, nextTick, ref, onMounted, reactive } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import { entityApi } from '@/api/entities.ts'
import EntityParameters from '@/components/dashboard/entities/EntityParameters.vue'
import MarkerMap from '@/components/maps/MarkerMap.vue'
import api from '@/api/httpClient'
import { debounce } from 'lodash-es'
import type { AddressSuggestion } from '@/types/addressSuggestion.ts'
import type { Requisite } from '@/types/requisite.ts'

interface FormFields {
  title: string
  description: string
  email: string
  phone: string
  latitude: number | null
  longitude: number | null
  requisite: Requisite | null
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
  latitude: null,
  longitude: null,
  requisite: {
    title: null,
    type: null,
    description: null,
    legal_name: null,
    opf_short: null,
    inn: null,
    ogrn: null,
    ogrn_date: null,
    kpp: null,
    okpo: null,
    legal_address: null,
    real_address: null,
    postal_address: null,
    email: null,
    phone: null,
  },
}

const requiredFields: Array<keyof FormFields> = ['title', 'description']

const parametersData = ref<any>([])
const addressSuggestions = ref<AddressSuggestion[]>([])
const showSuggestions = ref(false)
const isLoadingSuggestions = ref(false)

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
  latitude: null,
  longitude: null,
  parameters: {},
  requisite: {},
})

const resetForm = () => {
  markerData.value = null
  addressSuggestions.value = []
  showSuggestions.value = false

  Object.keys(form).forEach((key) => {
    form[key] = formTemplate[key]
  })
  form.parameters = {}
  form.requisite = {}
}

const handleMarkerUpdate = ({ lat, lng }: { lat: number; lng: number }) => {
  form.latitude = lat
  form.longitude = lng
}

const markerData = ref<{ type: string; coordinates: number[] } | null>(null)

const fetchSuggestions = debounce(async (address: string) => {
  if (address.length < 5) {
    addressSuggestions.value = []
    showSuggestions.value = false
    return
  }

  try {
    isLoadingSuggestions.value = true
    const { data } = await api.post('/manage/suggestions/address', { address })
    addressSuggestions.value = data.data
    showSuggestions.value = true
  } catch (error) {
    toast.error(error.response?.data?.message || 'Ошибка при поиске адреса')
    console.error(error)
    addressSuggestions.value = []
    showSuggestions.value = false
  } finally {
    isLoadingSuggestions.value = false
  }
}, 500)

const selectAddressSuggestion = (suggestion: AddressSuggestion) => {
  if (!form.requisite) {
    form.requisite = { ...formTemplate.requisite! }
  }
  const postal_code = suggestion.postal_code || ''
  const country = suggestion.country || ''
  form.requisite.real_address = suggestion.value
  form.latitude = suggestion.latitude ? parseFloat(suggestion.latitude) : null
  form.longitude = suggestion.longitude ? parseFloat(suggestion.longitude) : null

  if (form.latitude && form.longitude) {
    markerData.value = {
      type: 'Point',
      coordinates: [form.latitude, form.longitude],
    }
  }

  addressSuggestions.value = []
  showSuggestions.value = false
}

const handleAddressInput = () => {
  if (!form.requisite) return

  // Clear coordinates if real_address is changed
  if (form.requisite.real_address.length < 5) {
    form.latitude = null
    form.longitude = null
    markerData.value = null
    addressSuggestions.value = []
    showSuggestions.value = false
  } else {
    fetchSuggestions(form.requisite.real_address)
  }
}

const handleAddressFocus = () => {
  if (addressSuggestions.value.length > 0) {
    showSuggestions.value = true
  }
}

const handleAddressBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

watch(
  () => props.item,
  (newEntity) => {
    if (newEntity) {
      resetForm()

      form.title = newEntity.title || ''
      form.description = newEntity.description || ''
      form.phone = newEntity.phone || ''
      form.email = newEntity.email || ''
      form.latitude = newEntity.location?.coordinates[1] || null
      form.longitude = newEntity.location?.coordinates[0] || null
      form.parameters = {
        entityType: newEntity.entityType?.id,
      }

      if (newEntity.requisite) {
        form.requisite = { ...newEntity.requisite }
      }

      if (newEntity.location) {
        markerData.value = {
          type: newEntity.location.type,
          coordinates: [newEntity.location?.coordinates[1], newEntity.location?.coordinates[0]],
        }
      }
    }
  },
  { immediate: true, deep: true },
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
              <Label for="description">Описание</Label>
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
              <Input id="phone" v-model="form.phone" placeholder="" />
            </div>
          </div>

          <div class="grid gap-4 relative">
            <Label for="real_address">Адрес</Label>
            <div class="flex items-center flex-row gap-4">
              <div class="flex grow gap-2 space-y-2 relative">
                <Input
                  type="text"
                  id="real_address"
                  :model-value="form.requisite?.real_address || ''"
                  @update:model-value="
                    (value) => {
                      if (form.requisite) {
                        form.requisite.real_address = value
                      } else {
                        form.requisite = { ...formTemplate.requisite!, real_address: value }
                      }
                      handleAddressInput()
                    }
                  "
                  @focus="handleAddressFocus"
                  @blur="handleAddressBlur"
                  @keydown.enter.prevent="fetchSuggestions(form.requisite?.real_address || '')"
                  :clearable="false"
                />

                <!-- Dropdown for address suggestions -->
                <div
                  v-if="showSuggestions && addressSuggestions.length > 0"
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  <div
                    v-for="(suggestion, index) in addressSuggestions"
                    :key="index"
                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    @mousedown.prevent="selectAddressSuggestion(suggestion)"
                  >
                    <div class="text-sm font-medium text-gray-500">{{ suggestion.value }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Поля для координат -->
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="space-y-2">
              <Label for="latitude">Широта</Label>
              <Input id="latitude" :model-value="form.latitude" type="number" disabled />
            </div>
            <div class="space-y-2">
              <Label for="longitude">Долгота</Label>
              <Input id="longitude" :model-value="form.longitude" type="number" disabled />
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
