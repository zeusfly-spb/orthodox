<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { verifyEmailCode, resendVerificationEmail } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'vue-sonner'
import { PinInput, PinInputGroup, PinInputSlot } from '@/components/ui/pin-input'
import { debounce } from 'lodash-es'

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)
const isSubmitting = ref(false)
const showResendButton = ref(true)
const codeValue = ref<string[]>(Array(6).fill(''))

onBeforeMount(async () => {
  if (authStore.isEmailVerified) {
    router.push({ name: 'dashboard-home' })
  }
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login' })
  }
})

const handleSubmit = async () => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    isLoading.value = true
    const code = codeValue.value.join('')

    const response = await verifyEmailCode({ code })

    if (response.status >= 200 && response.status < 300) {
      await authStore.loadUser()

      if (authStore.isEmailVerified) {
        toast.success('Код успешно подтвержден')
        router.push({ name: 'dashboard-home' })
      }
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      toast.error('Сессия истекла. Пожалуйста, войдите снова.')
      router.push({ name: 'login' })
    } else if (error.response?.status === 422) {
      toast.error('Неверный код подтверждения')
      showResendButton.value = true
    } else {
      const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка'
      toast.error(errorMessage)
    }
  } finally {
    isSubmitting.value = false
    isLoading.value = false
    codeValue.value = Array(6).fill('')
  }
}

const debouncedHandleComplete = debounce((value: string[]) => {
  if (isSubmitting.value) return
  codeValue.value = value
  handleSubmit()
}, 300)

const handleResendCode = async () => {
  try {
    isLoading.value = true
    const response = await resendVerificationEmail({ email: authStore.user?.email })
    if (response.status >= 200 && response.status < 300) {
      toast.success('Новый код отправлен на вашу почту')
      showResendButton.value = false
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Не удалось отправить код'
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex grow items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <Card class="w-full max-w-md items-center">
      <CardHeader class="w-full mt-2">
        <CardTitle class="text-3xl mb-2 text-center text-gray">Подтвердите почту</CardTitle>
        <CardDescription class="text-gray-800 text-center">
          Введите 6-значный код, который вы получили по электронной почте или запросите новый
        </CardDescription>
      </CardHeader>
      <CardContent class="w-full items-center">
        <form @submit.prevent="handleSubmit" class="space-y-6 w-full items-center">
          <div class="flex flex-col items-center">
            <div class="relative mb-3">
              <PinInput
                id="pin-input"
                v-model="codeValue"
                placeholder="0"
                @complete="debouncedHandleComplete"
              >
                <PinInputGroup>
                  <PinInputSlot v-for="(id, index) in 6" :key="id" :index="index" />
                </PinInputGroup>
              </PinInput>
            </div>
          </div>

          <div class="flex flex-col items-center gap-4">
            <Button
              type="submit"
              class="w-2/3 py-6 bg-emerald-500 text-white shadow hover:bg-emerald-500/90"
              :disabled="!codeValue.value || isLoading"
            >
              {{ isLoading ? 'Проверка...' : 'Подтвердить' }}
            </Button>

            <Button
              v-if="showResendButton"
              type="button"
              variant="ghost"
              class="w-2/3 py-6 text-sm font-medium text-gray-500 hover:text-gray-500/80"
              @click="handleResendCode"
              :disabled="isLoading"
            >
              Отправить код заново
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
