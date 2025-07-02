<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { forgotPassword } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'vue-sonner'
import type { AuthError, ForgotPasswordData } from '@/types/auth'

const router = useRouter()
const isLoading = ref(false)

const form = ref<ForgotPasswordData>({
  email: '',
})

const handleSubmit = async () => {
  try {
    isLoading.value = true
    await forgotPassword(form.value)
    toast.success('Ссылка на изменение пароля отправлена вам на почту')
    router.push({ name: 'login' })
  } catch (error: unknown) {
    const apiError = error as AuthError
    const errorMessage = apiError.response?.data?.message || apiError.message || 'An error occurred'
    toast.error(errorMessage)
    form.value.email = ''
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex grow items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-3xl mb-2">Восстановление пароля</CardTitle>
        <CardDescription class="text-gray-800">
          Введите адрес электронной почты, с которым зарегистрировались, и мы отправим вам
          инструкции по сбросу пароля
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">
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

          <div class="flex gap-2">
            <Button
              variant="outline"
              class="w-1/3 py-6 text-emerald-500 hover:text-emerald-500"
              as-child
            >
              <RouterLink :to="{ name: 'login' }"> Назад </RouterLink>
            </Button>
            <Button
              type="submit"
              class="w-2/3 py-6 bg-emerald-500 text-white shadow hover:bg-emerald-500/90"
              :disabled="isLoading"
              >Восстановить пароль</Button
            >
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
