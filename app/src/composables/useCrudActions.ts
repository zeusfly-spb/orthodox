import { ref } from 'vue'
import { useEntity } from '@/composables/useEntity'
import { createApiClient } from '@/api/generic'
import { toast } from 'vue-sonner'

interface CrudActionsOptions {
  successMessage?: string
  deleteMessage?: string
}

export const useCrudActions = <T>(
  apiClient: ReturnType<typeof createApiClient<T>>,
  options?: CrudActionsOptions,
) => {
  const isLoading = ref(true)
  const showConfirm = ref(false)
  const showForm = ref(false)
  const handledItemId = ref<string | number | null>(null)

  const { getAll, getOneById, store, update, destroy, items, currentItem, pagination, error } =
    useEntity(apiClient)

  const loadCollection = async (params?: Record<string, unknown>) => {
    try {
      await getAll(params)
      isLoading.value = false
    } catch (error) {
      await handleError(error)
    }
  }

  const handleSubmit = async (formData: Partial<T>) => {
    try {
      if (handledItemId.value) {
        await update(handledItemId.value, formData)
      } else {
        await store(formData)
      }
      toast(options?.successMessage || 'Данные сохранены')
      showForm.value = false
      await getAll()
    } catch (error) {
      await handleError(error)
    } finally {
      handledItemId.value = null
    }
  }

  const handleEdit = async (id: number | string) => {
    try {
      await getOneById(id)
      handledItemId.value = id
      showForm.value = true
    } catch (error) {
      await handleError(error)
    }
  }

  const handleDelete = (id: number | string) => {
    handledItemId.value = id
    showConfirm.value = true
  }

  const onDeleteConfirm = async () => {
    showConfirm.value = false
    if (!handledItemId.value) return

    try {
      await destroy(handledItemId.value)
      await getAll()
      toast(options?.deleteMessage || 'Данные удалены')
    } catch (error) {
      await handleError(error)
    } finally {
      handledItemId.value = null
    }
  }

  const onCancel = () => {
    handledItemId.value = null
    currentItem.value = null
  }

  const handleError = async (error) => {
    if (error.response.status === 422) {
      const errors = Object.values(error.response.data?.errors || {}).join('\n')
      toast.error(errors)
      throw error
    }
    toast.error('Ошибка сетевого соединения')
    throw error
  }

  return {
    isLoading,
    showConfirm,
    showForm,
    handledItemId,
    items,
    currentItem,
    pagination,
    loadCollection,
    handleSubmit,
    handleEdit,
    handleDelete,
    onDeleteConfirm,
    onCancel,
  }
}
