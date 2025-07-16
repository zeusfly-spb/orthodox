<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
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
import { useEntityForm } from '@/composables/useEntityForm'
import { Textarea } from '@/components/ui/textarea'

interface Operator {
  id?: number
  name: string
  type: string | null
  email: string | null
  phone: string | null
  description: string | null
  // json_attributes: {
  //   date?: string
  //   name?: string
  //   number?: string
  //   number_date?: string
  // }
  requisite: {
    id?: number
    title: string
    type: string | null
    description: string | null
    legal_name: string
    opf_short: string | null
    inn: string | null
    ogrn: string | null
    ogrn_date: string | null
    kpp: string | null
    okpo: string | null
    legal_address: string | null
    real_address: string | null
    postal_address: string | null
    email: string | null
    phone: string | null
  }
}

const formTemplate: Operator = {
  name: '',
  type: null,
  email: null,
  phone: null,
  description: null,
  // json_attributes: {},
  requisite: {
    title: '',
    type: null,
    description: null,
    legal_name: '',
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

const requiredFields: Array<keyof Operator> = ['name', 'requisite.legal_name']

const { form, resetForm, fillForm, validateForm } = useEntityForm<Operator>(
  formTemplate,
  requiredFields,
)

const props = withDefaults(
  defineProps<{
    open: boolean
    item?: Operator
    createTitle?: string
    editTitle?: string
    description?: string
    submitText?: string
    cancelText?: string
  }>(),
  {
    createTitle: 'Добавить оператора',
    editTitle: 'Редактировать оператора',
    description: '',
    submitText: 'Сохранить',
    cancelText: 'Отмена',
  },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', item: Operator): void
  (e: 'dismiss'): void
}>()

watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      // Преобразуем данные из API в структуру формы
      const formData = {
        ...newItem,
        // json_attributes: newItem.json_attributes || {},
        requisite: newItem.requisite || formTemplate.requisite,
      }
      fillForm(formData)
    }
  },
  { immediate: true },
)

const firstInput = ref<HTMLInputElement | null>(null)
watch(
  () => props.open,
  async (isOpen) => {
    await nextTick()
    if (firstInput.value) {
      firstInput.value.blur() // Убираем фокус
    }

    if (!isOpen) {
      await nextTick()
      // resetForm()
      emit('dismiss')
    }
  },
)

const onSubmit = () => {
  if (!validateForm()) return

  // Подготавливаем данные для отправки
  const submitData = {
    ...form,
    // Дополнительные преобразования если нужно
  }

  emit('submit', submitData)
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="(value) => emit('update:open', value)" :auto-focus="false">
    <DialogContent class="sm:max-w-[700px]" @openAutoFocus.prevent>
      <DialogHeader data-autofocus>
        <DialogTitle>
          {{ item?.id ? props.editTitle : props.createTitle }}
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
            <div class="space-y-2">
              <Label for="title" required>Название</Label>
              <Input id="title" v-model="form.name" />
            </div>
            <div class="space-y-2">
              <Label>Описание</Label>
              <Textarea v-model="form.description" />
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

          <!-- Реквизиты -->
          <div class="space-y-4 border-t pt-4">
            <h3 class="text-lg font-medium">Реквизиты</h3>
            <div class="space-y-2">
              <Label required>Юридическое наименование</Label>
              <Input v-model="form.requisite.legal_name" />
            </div>
            <div class="space-y-2">
              <Label>ОПФ (сокращенно)</Label>
              <Input v-model="form.requisite.opf_short" />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label>ИНН</Label>
                <Input v-model="form.requisite.inn" />
              </div>
              <div class="space-y-2">
                <Label>ОГРН</Label>
                <Input v-model="form.requisite.ogrn" />
              </div>
              <div class="space-y-2">
                <Label>Дата ОГРН</Label>
                <div class="flex gap-2">
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button variant="outline" class="w-full justify-start text-left font-normal">
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        <span>{{ form.requisite.ogrn_date || 'Выберите дату' }}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <AppDatePicker v-model="form.requisite.ogrn_date" />
                    </PopoverContent>
                  </Popover>
                  <Button
                    v-if="form.requisite.ogrn_date"
                    type="button"
                    variant="ghost"
                    size="sm"
                    @click="form.requisite.ogrn_date = null"
                  >
                    <Trash2 class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>КПП</Label>
                <Input v-model="form.requisite.kpp" />
              </div>
              <div class="space-y-2">
                <Label>ОКПО</Label>
                <Input v-model="form.requisite.okpo" />
              </div>
            </div>
          </div>

          <!-- Адреса -->
          <div class="space-y-4 border-t pt-4">
            <h3 class="text-lg font-medium">Адреса</h3>
            <div class="space-y-2">
              <Label>Юридический адрес</Label>
              <Input v-model="form.requisite.legal_address" />
            </div>
            <div class="space-y-2">
              <Label>Фактический адрес</Label>
              <Input v-model="form.requisite.real_address" />
            </div>
            <div class="space-y-2">
              <Label>Почтовый адрес</Label>
              <Input v-model="form.requisite.postal_address" />
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
