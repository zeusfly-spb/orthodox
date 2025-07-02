<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'vue-sonner'
import type { RegisterData, AuthError } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<RegisterData>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const handleSubmit = async () => {
  try {
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
        <CardDescription class="text-gray-800"> Регистрация на портале </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <Input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 px-5 py-6 block w-full"
              placeholder="Имя пользователя"
            />
          </div>

          <div>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 px-5 py-6 block w-full"
              placeholder="E-mail"
            />
          </div>

          <div>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="mt-1 px-5 py-6 block w-full"
              placeholder="Пароль"
            />
          </div>

          <div>
            <Input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              required
              class="mt-1 px-5 py-6 block w-full"
              placeholder="Подтвердите пароль"
            />
          </div>

          <div>
            <Button
              type="submit"
              class="w-full py-6 bg-emerald-500 text-white shadow hover:bg-emerald-500/90"
              :disabled="authStore.isLoading"
              >Зарегистрироваться</Button
            >
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
