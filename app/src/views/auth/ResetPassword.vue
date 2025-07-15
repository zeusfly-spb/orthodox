<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { resetPassword } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'vue-sonner'
import type { AuthError, ResetPasswordData } from '@/types/auth'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)

const form = ref<ResetPasswordData>({
  token: '',
  email: '',
  password: '',
  password_confirmation: '',
})

// Получаем параметры из URL при монтировании компонента
onMounted(() => {
  if (!route.query.token || !route.query.email) {
    toast.error('Invalid reset password link')
    router.push({ name: 'login' })
  }
  form.value.token = route.query.token as string
  form.value.email = route.query.email as string
})

const handleSubmit = async () => {
  try {
    isLoading.value = true
    await resetPassword(form.value)
    toast.success('Пароль успешно восстановлен')
    router.push({ name: 'login' })
  } catch (error: unknown) {
    const apiError = error as AuthError
    let errorMessage = apiError.response?.data?.message || apiError.message || 'An error occurred'

    if (apiError.response?.status === 422 && apiError.response.data?.errors) {
      errorMessage = Object.values(apiError.response.data.errors).flat().join('\n')
    }

    toast.error(errorMessage)
    form.value.password = ''
    form.value.password_confirmation = ''
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
        <!-- Отображаем email для наглядности -->
        <CardDescription v-if="form.email" class="text-gray-600 mb-2">
          {{ form.email }}
        </CardDescription>
        <CardDescription class="text-gray-800">
          <div class="mb-2">При обновлении пароля учтите следующие пункты:</div>
          <ul class="list-disc pl-5 space-y-1">
            <li class="text-foreground">Минимум 8 символов</li>
            <li class="text-foreground">Иметь как заглавные, так и строчные буквы</li>
            <li class="text-foreground">Должен включать цифры</li>
          </ul>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">
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
              >Сменить пароль</Button
            >
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
