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
import AppDatePicker from '@/components/app/AppDatePicker.vue'
import { toast } from 'vue-sonner'
import { useEntityForm } from '@/composables/useEntityForm'

interface FormFields {
  firstname: string
  lastname: string
  patronymic?: string
  email: string
  phone: string
  passport_series: string
  passport_number: string
  passport_issue_date?: string
  passport_unit_name?: string
  passport_unit_code?: string
  passport_birth_date?: string
  passport_birth_place?: string
  passport_address?: string
}

const formTemplate: FormFields = {
  firstname: '',
  lastname: '',
  patronymic: '',
  email: '',
  phone: '',
  passport_series: '',
  passport_number: '',
  passport_issue_date: '',
  passport_unit_name: '',
  passport_unit_code: '',
  passport_birth_date: '',
  passport_birth_place: '',
  passport_address: '',
}

const requiredFields: Array<keyof FormFields> = ['firstname', 'lastname', 'email']

const { form, resetForm, fillForm, validateForm } = useEntityForm<FormFields>(
  formTemplate,
  requiredFields,
)

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

watch(() => props.item, fillForm, { immediate: true })

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
  if (!validateForm()) return
  emit('submit', { ...form })
  emit('update:open', false)
}

const addDate = (field: 'passport_issue_date' | 'passport_birth_date') => {
  if (!form[field]) {
    toast.error('Выберите дату')
    return
  }
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
          <div class="grid grid-cols-3 gap-4">
            <div class="space-y-2">
              <Label for="lastname" required>Фамилия</Label>
              <Input id="lastname" v-model="form.lastname" />
            </div>
            <div class="space-y-2">
              <Label for="firstname" required>Имя</Label>
              <Input id="firstname" v-model="form.firstname" />
            </div>
            <div class="space-y-2">
              <Label for="patronymic">Отчество</Label>
              <Input id="patronymic" v-model="form.patronymic" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="email" required>Email</Label>
              <Input id="email" v-model="form.email" type="email" />
            </div>
            <div class="space-y-2">
              <Label for="phone" required>Телефон</Label>
              <Input id="phone" v-model="form.phone" placeholder="+7 (XXX) XXX-XX-XX" />
            </div>
          </div>

          <div class="border-t pt-4 mt-4">
            <h3 class="text-lg font-medium mb-4">Паспортные данные</h3>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="space-y-2">
                <Label for="passport_series" required>Серия</Label>
                <Input id="passport_series" v-model="form.passport_series" />
              </div>
              <div class="space-y-2">
                <Label for="passport_number" required>Номер</Label>
                <Input id="passport_number" v-model="form.passport_number" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="space-y-2">
                <Label for="passport_issue_date">Дата выдачи</Label>
                <div class="flex gap-2">
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button variant="outline" class="w-full justify-start text-left font-normal">
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        <span>{{ form.passport_issue_date || 'Выберите дату' }}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <AppDatePicker v-model="form.passport_issue_date" />
                    </PopoverContent>
                  </Popover>
                  <Button
                    v-if="form.passport_issue_date"
                    type="button"
                    variant="ghost"
                    size="sm"
                    @click="form.passport_issue_date = ''"
                  >
                    <Trash2 class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div class="space-y-2">
                <Label for="passport_birth_date">Дата рождения</Label>
                <div class="flex gap-2">
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button variant="outline" class="w-full justify-start text-left font-normal">
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        <span>{{ form.passport_birth_date || 'Выберите дату' }}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <AppDatePicker v-model="form.passport_birth_date" />
                    </PopoverContent>
                  </Popover>
                  <Button
                    v-if="form.passport_birth_date"
                    type="button"
                    variant="ghost"
                    size="sm"
                    @click="form.passport_birth_date = ''"
                  >
                    <Trash2 class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="space-y-2">
                <Label for="passport_unit_name">Кем выдан</Label>
                <Input id="passport_unit_name" v-model="form.passport_unit_name" />
              </div>
              <div class="space-y-2">
                <Label for="passport_unit_code">Код подразделения</Label>
                <Input id="passport_unit_code" v-model="form.passport_unit_code" />
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <Label for="passport_birth_place">Место рождения</Label>
              <Input id="passport_birth_place" v-model="form.passport_birth_place" />
            </div>

            <div class="space-y-2">
              <Label for="passport_address">Адрес регистрации</Label>
              <Input id="passport_address" v-model="form.passport_address" />
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
