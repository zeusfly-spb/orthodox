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
import { toast } from 'vue-sonner'
import AppDatePicker from '@/components/app/AppDatePicker.vue'

interface Requisite {
  id?: number
  title: string
  type: string | null
  description: string | null
  legal_name: string
  opf_short: string | null
  inn: string
  ogrn: string
  ogrn_date: string | null
  kpp: string
  okpo: string
  legal_address: string
  real_address: string
  postal_address: string | null
  email: string | null
  phone: string | null
}

const props = withDefaults(
  defineProps<{
    open: boolean
    requisite?: Requisite
    createTitle?: string
    editTitle?: string
    description?: string
    submitText?: string
    cancelText?: string
  }>(),
  {
    createTitle: 'Создать реквизиты',
    editTitle: 'Редактировать реквизиты',
    description: '',
    submitText: 'Сохранить',
    cancelText: 'Отмена',
  },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', requisite: Requisite): void
  (e: 'dismiss'): void
}>()

const form = reactive<Requisite>({
  title: '',
  type: null,
  description: null,
  legal_name: '',
  opf_short: null,
  inn: '',
  ogrn: '',
  ogrn_date: null,
  kpp: '',
  okpo: '',
  legal_address: '',
  real_address: '',
  postal_address: null,
  email: null,
  phone: null,
})

const resetForm = () => {
  form.title = ''
  form.type = null
  form.description = null
  form.legal_name = ''
  form.opf_short = null
  form.inn = ''
  form.ogrn = ''
  form.ogrn_date = null
  form.kpp = ''
  form.okpo = ''
  form.legal_address = ''
  form.real_address = ''
  form.postal_address = null
  form.email = null
  form.phone = null
}

watch(
  () => props.requisite,
  (requisite) => {
    if (requisite) {
      Object.assign(form, requisite)
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
  if (!form.title) {
    toast.error('Введите название')
    return false
  }

  if (!form.legal_name) {
    toast.error('Введите полное наименование организации')
    return false
  }

  // if (!form.inn) {
  //   toast.error('Введите ИНН')
  //   return false
  // }
  //
  // if (!form.ogrn) {
  //   toast.error('Введите ОГРН')
  //   return false
  // }
  //
  // if (!form.kpp) {
  //   toast.error('Введите КПП')
  //   return false
  // }
  //
  // if (!form.legal_address) {
  //   toast.error('Введите юридический адрес')
  //   return false
  // }
  //
  // if (!form.real_address) {
  //   toast.error('Введите фактический адрес')
  //   return false
  // }

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
    <DialogContent class="sm:max-w-[700px]">
      <DialogHeader data-autofocus>
        <DialogTitle>
          {{ requisite?.id ? props.editTitle : props.createTitle }}
        </DialogTitle>
        <DialogDescription>
          {{ props.description }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit">
        <div class="grid gap-6 py-4">
          <!-- Основная информация -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Основная информация</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label required>Название</Label>
                <Input v-model="form.title" />
              </div>
              <div class="space-y-2">
                <Label>Тип</Label>
                <Input v-model="form.type" />
              </div>
            </div>
            <div class="space-y-2">
              <Label>Описание</Label>
              <Input v-model="form.description" />
            </div>
          </div>

          <!-- Реквизиты -->
          <div class="space-y-4 border-t pt-4">
            <h3 class="text-lg font-medium">Реквизиты</h3>
            <div class="space-y-2">
              <Label required>Полное наименование</Label>
              <Input v-model="form.legal_name" />
            </div>
            <div class="space-y-2">
              <Label>ОПФ (сокращенно)</Label>
              <Input v-model="form.opf_short" />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label required>ИНН</Label>
                <Input v-model="form.inn" />
              </div>
              <div class="space-y-2">
                <Label required>ОГРН</Label>
                <Input v-model="form.ogrn" />
              </div>
              <div class="space-y-2">
                <Label>Дата ОГРН</Label>
                <div class="flex gap-2">
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button variant="outline" class="w-full justify-start text-left font-normal">
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        <span>{{ form.ogrn_date || 'Выберите дату' }}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <AppDatePicker v-model="form.ogrn_date" />
                    </PopoverContent>
                  </Popover>
                  <Button
                    v-if="form.ogrn_date"
                    type="button"
                    variant="ghost"
                    size="sm"
                    @click="form.ogrn_date = null"
                  >
                    <Trash2 class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label required>КПП</Label>
                <Input v-model="form.kpp" />
              </div>
              <div class="space-y-2">
                <Label>ОКПО</Label>
                <Input v-model="form.okpo" />
              </div>
            </div>
          </div>

          <!-- Адреса -->
          <div class="space-y-4 border-t pt-4">
            <h3 class="text-lg font-medium">Адреса</h3>
            <div class="space-y-2">
              <Label required>Юридический адрес</Label>
              <Input v-model="form.legal_address" />
            </div>
            <div class="space-y-2">
              <Label required>Фактический адрес</Label>
              <Input v-model="form.real_address" />
            </div>
            <div class="space-y-2">
              <Label>Почтовый адрес</Label>
              <Input v-model="form.postal_address" />
            </div>
          </div>

          <!-- Контакты -->
          <div class="space-y-4 border-t pt-4">
            <h3 class="text-lg font-medium">Контакты</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Email</Label>
                <Input v-model="form.email" type="email" />
              </div>
              <div class="space-y-2">
                <Label>Телефон</Label>
                <Input v-model="form.phone" placeholder="+7 (XXX) XXX-XX-XX" />
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
