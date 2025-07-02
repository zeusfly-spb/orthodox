<script setup lang="ts">
import { watch, reactive, nextTick } from 'vue'
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
import { useEntityForm } from '@/composables/useEntityForm'

interface FormFields {
  firstname: string
  lastname: string
  patronymic?: string
  email?: string
  phone?: string
}

const formTemplate: FormFields = {
  firstname: '',
  lastname: '',
  patronymic: '',
  email: '',
  phone: '',
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
</script>

<template>
  <Dialog :open="open" @update:open="(value) => emit('update:open', value)" :auto-focus="false">
    <DialogContent class="sm:max-w-[800px]">
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
              <Label for="phone">Телефон</Label>
              <Input id="phone" v-model="form.phone" placeholder="+7 (XXX) XXX-XX-XX" />
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
