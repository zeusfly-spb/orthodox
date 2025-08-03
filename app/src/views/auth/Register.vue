<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Search, Mail, Lock, User } from 'lucide-vue-next'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from '@/components/ui/combobox'
import { toast } from 'vue-sonner'
import type { AuthError, RegisterData } from '@/types/auth'
import { cn } from '@/lib/utils'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<RegisterData>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  tour_operator_id: '',
})

const operators = ref<{ value: string; label: string }[]>([])

onMounted(async () => {
  try {
    const { data } = await authStore.loadOperators()
    operators.value = data
  } catch (error) {
    console.error('Error loading operators:', error)
    toast.error('Ошибка загрузки списка операторов')
  }
})

const handleSubmit = async () => {
  try {
    // form.value = { ...form.value, tour_operator_id: form.value.tour_operator_id?.value }
    await authStore.register(form.value)
    router.push({ name: 'dashboard' })
  } catch (error: unknown) {
    const apiError = error as AuthError
    let errorMessage = 'Неверные данные для регистрации'

    if (apiError.response?.data?.message) {
      errorMessage = apiError.response.data.message
    } else if (apiError.response?.status === 422 && apiError.response.data?.errors) {
      errorMessage = Object.values(apiError.response.data.errors).flat().join('\n')
    } else if (apiError.message) {
      errorMessage = apiError.message
    }

    toast.error(errorMessage)
    console.error(error)
    form.value.password = ''
    form.value.password_confirmation = ''
  }
}
</script>

<template>
  <div class="flex grow items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-3xl mb-2">Регистрация</CardTitle>
        <CardDescription class="text-gray-800">Регистрация на портале</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="relative">
            <Combobox v-model="form.tour_operator_id" by="id">
              <ComboboxAnchor class="w-full">
                <div class="relative w-full max-w-sm items-center">
                  <ComboboxInput
                    class="pl-2"
                    :display-value="(id) => operators[id] || ''"
                    placeholder="Выберите оператора..."
                  />
                  <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
                    <Search class="size-4 text-gray-400" />
                  </span>
                </div>
              </ComboboxAnchor>

              <ComboboxList
                class="w-full max-w-md max-h-60 overflow-y-auto overscroll-contain relative scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-md hover:scrollbar-thumb-gray-500"
              >
                <ComboboxEmpty>
                  <div class="w-full max-w-md px-6">Нет доступных операторов</div>
                </ComboboxEmpty>

                <ComboboxGroup>
                  <ComboboxItem
                    v-for="(name, id) in operators"
                    :key="id"
                    :value="id"
                    class="cursor-pointer"
                  >
                    {{ name }}

                    <ComboboxItemIndicator>
                      <Check :class="cn('ml-auto h-4 w-4')" />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </Combobox>
          </div>

          <div class="space-y-2">
            <div class="relative">
              <User class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Имя пользователя"
                required
                class="mt-1 px-5 py-6 h-12 pl-10 block w-full"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="E-mail"
                required
                class="mt-1 px-5 py-6 h-12 pl-10 block w-full"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="mt-1 px-5 py-6 h-12 pl-10 block w-full"
                placeholder="Пароль"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                required
                class="mt-1 px-5 py-6 h-12 pl-10 block w-full"
                placeholder="Подтвердите пароль"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              class="w-full py-6 bg-emerald-500 text-white shadow hover:bg-emerald-500/90"
              :disabled="authStore.isLoading"
            >
              Зарегистрироваться
            </Button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <RouterLink
            :to="{ name: 'login' }"
            class="text-sm font-medium text-gray-500 hover:text-gray-500/80"
          >
            У вас уже есть аккаунт? Вход
          </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
