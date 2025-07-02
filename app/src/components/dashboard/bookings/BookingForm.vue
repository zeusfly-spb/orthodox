<script setup lang="ts">
import { watch, reactive, nextTick } from 'vue'
import { Calendar as CalendarIcon, Trash2 } from 'lucide-vue-next'
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
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AppDatePicker from '@/components/app/AppDatePicker.vue'
import { toast } from 'vue-sonner'

interface Customer {
  firstname: string
  lastname: string
  patronymic?: string
  email: string
  phone: string
  passport_serial_number: string
  passport_series: string
  passport_number: string
  passport_issue_date?: string
  passport_birth_date?: string
}

interface BookingForm {
  tour_id: number | null
  status: string
  description: string
  customers: Customer[]
}

const props = withDefaults(
  defineProps<{
    open: boolean
    tours: Array<{ id: number; title: string }>
    booking?: {
      id?: number
      tour_id: number
      status: string
      description: string
      customers: Customer[]
    }
    createTitle?: string
    editTitle?: string
    description?: string
    submitText?: string
    cancelText?: string
  }>(),
  {
    createTitle: 'Создать бронирование',
    editTitle: 'Редактировать бронирование',
    description: '',
    submitText: 'Сохранить',
    cancelText: 'Отмена',
  },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', booking: BookingForm): void
  (e: 'dismiss'): void
}>()

const customerTemplate: Customer = {
  firstname: '',
  lastname: '',
  patronymic: '',
  email: '',
  phone: '',
  passport_serial_number: '',
  passport_series: '',
  passport_number: '',
}

const form = reactive<BookingForm>({
  tour_id: null,
  status: 'pending',
  description: '',
  customers: [{ ...customerTemplate }],
})

const addCustomer = () => {
  form.customers.push({ ...customerTemplate })
}

const removeCustomer = (index: number) => {
  if (form.customers.length > 1) {
    form.customers.splice(index, 1)
  } else {
    toast.error('Должен быть хотя бы один клиент')
  }
}

const resetForm = () => {
  form.tour_id = null
  form.status = 'pending'
  form.description = ''
  form.customers = [{ ...customerTemplate }]
}

watch(
  () => props.booking,
  (booking) => {
    if (booking) {
      form.tour_id = booking.tour_id
      form.status = booking.status
      form.description = booking.description
      form.customers = booking.customers.map((c) => ({ ...customerTemplate, ...c }))
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      nextTick(() => {
        resetForm()
        emit('dismiss')
      })
    }
  },
)

const validateForm = (): boolean => {
  if (!form.tour_id) {
    toast.error('Выберите тур')
    return false
  }

  for (const [index, customer] of form.customers.entries()) {
    if (!customer.firstname || !customer.lastname || !customer.email || !customer.phone) {
      toast.error(`Заполните обязательные поля для клиента ${index + 1}`)
      return false
    }

    if (
      !customer.passport_serial_number ||
      !customer.passport_series ||
      !customer.passport_number
    ) {
      toast.error(`Заполните паспортные данные для клиента ${index + 1}`)
      return false
    }
  }

  return true
}

const onSubmit = () => {
  if (!validateForm()) return
  emit('submit', { ...form })
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="(value) => emit('update:open', value)" :auto-focus="false">
    <DialogContent class="sm:max-w-[900px]">
      <DialogHeader data-autofocus>
        <DialogTitle>
          {{ booking?.id ? props.editTitle : props.createTitle }}
        </DialogTitle>
        <DialogDescription>
          {{ props.description }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit">
        <div class="grid gap-6 py-4">
          <!-- Tour and Status Selection -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label required>Тур</Label>
              <Select v-model="form.tour_id">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тур" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="tour in tours" :key="tour.id" :value="tour.id">
                    {{ tour.title }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label>Статус</Label>
              <Select v-model="form.status">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидание</SelectItem>
                  <SelectItem value="confirmed">Подтверждено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="description">Примечание</Label>
            <Input id="description" v-model="form.description" />
          </div>

          <!-- Customers Section -->
          <div class="border-t pt-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">Клиенты</h3>
              <Button type="button" variant="outline" @click="addCustomer">
                Добавить клиента
              </Button>
            </div>

            <div
              v-for="(customer, index) in form.customers"
              :key="index"
              class="mb-6 border-b pb-6"
            >
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-medium">Клиент {{ index + 1 }}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  @click="removeCustomer(index)"
                  :disabled="form.customers.length <= 1"
                >
                  Удалить
                </Button>
              </div>

              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="space-y-2">
                  <Label :for="`lastname-${index}`" required>Фамилия</Label>
                  <Input :id="`lastname-${index}`" v-model="customer.lastname" />
                </div>
                <div class="space-y-2">
                  <Label :for="`firstname-${index}`" required>Имя</Label>
                  <Input :id="`firstname-${index}`" v-model="customer.firstname" />
                </div>
                <div class="space-y-2">
                  <Label :for="`patronymic-${index}`">Отчество</Label>
                  <Input :id="`patronymic-${index}`" v-model="customer.patronymic" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="space-y-2">
                  <Label :for="`email-${index}`" required>Email</Label>
                  <Input :id="`email-${index}`" v-model="customer.email" type="email" />
                </div>
                <div class="space-y-2">
                  <Label :for="`phone-${index}`" required>Телефон</Label>
                  <Input
                    :id="`phone-${index}`"
                    v-model="customer.phone"
                    placeholder="+7 (XXX) XXX-XX-XX"
                  />
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="space-y-2">
                  <Label :for="`passport_serial_number-${index}`" required>Серия и номер</Label>
                  <Input
                    :id="`passport_serial_number-${index}`"
                    v-model="customer.passport_serial_number"
                  />
                </div>
                <div class="space-y-2">
                  <Label :for="`passport_series-${index}`" required>Серия</Label>
                  <Input :id="`passport_series-${index}`" v-model="customer.passport_series" />
                </div>
                <div class="space-y-2">
                  <Label :for="`passport_number-${index}`" required>Номер</Label>
                  <Input :id="`passport_number-${index}`" v-model="customer.passport_number" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label :for="`passport_issue_date-${index}`">Дата выдачи</Label>
                  <div class="flex gap-2">
                    <Popover>
                      <PopoverTrigger as-child>
                        <Button
                          variant="outline"
                          class="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon class="mr-2 h-4 w-4" />
                          <span>{{ customer.passport_issue_date || 'Выберите дату' }}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="w-auto p-0">
                        <AppDatePicker v-model="customer.passport_issue_date" />
                      </PopoverContent>
                    </Popover>
                    <Button
                      v-if="customer.passport_issue_date"
                      type="button"
                      variant="ghost"
                      size="sm"
                      @click="customer.passport_issue_date = ''"
                    >
                      <Trash2 class="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div class="space-y-2">
                  <Label :for="`passport_birth_date-${index}`">Дата рождения</Label>
                  <div class="flex gap-2">
                    <Popover>
                      <PopoverTrigger as-child>
                        <Button
                          variant="outline"
                          class="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon class="mr-2 h-4 w-4" />
                          <span>{{ customer.passport_birth_date || 'Выберите дату' }}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="w-auto p-0">
                        <AppDatePicker v-model="customer.passport_birth_date" />
                      </PopoverContent>
                    </Popover>
                    <Button
                      v-if="customer.passport_birth_date"
                      type="button"
                      variant="ghost"
                      size="sm"
                      @click="customer.passport_birth_date = ''"
                    >
                      <Trash2 class="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
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

<style scoped>
[required]::after {
  content: ' *';
  color: hsl(0, 84.2%, 60.2%);
}
</style>
