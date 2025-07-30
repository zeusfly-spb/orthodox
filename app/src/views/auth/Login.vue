<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'vue-sonner'
import type { LoginCredentials } from '@/types/auth'
import { Mail, Lock } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<LoginCredentials>({
  email: '',
  password: '',
})

const handleSubmit = async () => {
  try {
    await authStore.login(form.value)
    router.push({ name: 'dashboard-home' })
  } catch (error: unknown) {
    let errorMessage = 'Неверные логин или пароль'
    toast.error(errorMessage)
    console.error(error)
    form.value.password = ''
  }
}
</script>

<template>
  <div class="flex grow items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-3xl mb-2">Войти в систему</CardTitle>
        <CardDescription class="text-gray-800">
          Введите свою электронную почту и пароль
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">
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

          <div class="flex items-center justify-between">
            <RouterLink
              :to="{ name: 'forgot-password' }"
              class="text-sm font-medium text-gray-500 hover:text-gray-500/80"
            >
              Забыли пароль?
            </RouterLink>
          </div>

          <div>
            <Button
              type="submit"
              class="w-full py-6 bg-emerald-500 text-white shadow hover:bg-emerald-500/90"
              :disabled="authStore.isLoading"
              >Вход</Button
            >
          </div>
        </form>

        <div class="mt-6 text-center">
          <RouterLink
            :to="{ name: 'register' }"
            class="text-sm font-medium text-gray-500 hover:text-gray-500/80"
          >
            У вас нет аккаунта? Регистрация
          </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
