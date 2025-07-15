<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { verifyEmail, resendVerificationEmail } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'vue-sonner'
import type { AuthError } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const isVerified = ref(false)
const email = ref('')

// Проверяем параметры URL при монтировании компонента
onMounted(async () => {
  if (!route.params.id || !route.params.hash || !route.query.signature || !route.query.expires) {
    toast.error('Неверная ссылка верификации')
    router.push({ name: 'login' })
    return
  }

  await handleVerify()
})

const handleVerify = async () => {
  try {
    isLoading.value = true
    const response = await verifyEmail({
      id: route.params.id as string,
      hash: route.params.hash as string,
      signature: route.query.signature as string,
      expires: route.query.expires as string,
    })

    isVerified.value = true
    email.value = response.data.email
    toast.success('Email успешно подтверждён')
    setTimeout(() => router.push({ name: 'login' }), 5000)
  } catch (error: unknown) {
    const apiError = error as AuthError
    const errorMessage =
      apiError.response?.data?.message || apiError.message || 'Ошибка верификации'
    toast.error(errorMessage)

    if (apiError.response?.data?.email) {
      email.value = apiError.response.data.email
    }
  } finally {
    isLoading.value = false
  }
}

const handleResend = async () => {
  if (!authStore.isAuthenticated || !authStore.user?.email) {
    toast.error('Авторизуйтесь для получения ссылки подтверждения на ваш email')
    router.push({ name: 'login' })
    return
  }

  try {
    isLoading.value = true
    await resendVerificationEmail({ email: authStore.user.email })
    toast.success('Новая ссылка для верификации отправлена на ваш email')
  } catch (error: unknown) {
    const apiError = error as AuthError
    const errorMessage =
      apiError.response?.data?.message || apiError.message || 'Ошибка при отправке письма'
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex grow items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-3xl mb-2">Подтверждение Email</CardTitle>
        <CardDescription v-if="email" class="text-gray-600 mb-2">
          {{ email }}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div v-if="isVerified" class="space-y-6 text-center">
          <div class="text-emerald-500 text-lg font-medium">Ваш email успешно подтверждён!</div>
          <div class="text-gray-600">
            Вы будете перенаправлены на страницу входа через несколько секунд...
          </div>
        </div>

        <div v-else class="space-y-6">
          <div class="text-gray-800">
            <p>Мы отправили ссылку для подтверждения на ваш email.</p>
            <p class="mt-2">
              Если вы не получили письмо, нажмите кнопку ниже чтобы отправить его снова.
            </p>
          </div>

          <div class="flex flex-col items-center space-y-4">
            <Button
              @click="handleResend"
              class="py-6 bg-emerald-500 text-white shadow hover:bg-emerald-500/90 w-full"
              :disabled="isLoading"
            >
              Отправить письмо снова
            </Button>

            <router-link
              :to="{ name: 'login' }"
              class="text-sm text-emerald-500 hover:text-emerald-600"
            >
              Вернуться на страницу входа
            </router-link>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
