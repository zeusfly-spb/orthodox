<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TourForm from '@/components/dashboard/tours/TourForm.vue'
import { tourApi } from '@/api/tours'
import { toast } from 'vue-sonner'

const router = useRouter()
const id = ref<string | null>(null)
const currentItem = ref<any>(null)

onMounted(() => {
  const routeId = router.currentRoute.value.params.id
  if (routeId && routeId !== 'new') {
    id.value = routeId as string
    loadItem()
  }
})

const loadItem = async () => {
  try {
    const response = await tourApi.getData(id.value!)
    currentItem.value = response.data
  } catch (error) {
    toast.error('Ошибка загрузки данных тура')
    router.push({ name: 'tours-list' })
  }
}

const handleSubmit = async (formData: any) => {
  try {
    if (id.value) {
      await tourApi.patchData(id.value, formData)
      console.log('Navigating:', formData) // Логируем id
      toast.success('Тур успешно обновлен')
    } else {
      await tourApi.storeData(formData)
      toast.success('Тур успешно создан')
    }
    router.push({ name: 'tours-list' })
  } catch (error) {
    toast.error('Ошибка сохранения данных')
  }
}

const handleCancel = () => {
  router.push({ name: 'tours-list' })
}
</script>

<template>
  <TourForm
    :item="currentItem"
    :create-title="'Создание нового тура'"
    :edit-title="'Редактирование тура'"
    :description="'Данные о туре'"
    :submit-text="'Сохранить'"
    :cancel-text="'Отмена'"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>
