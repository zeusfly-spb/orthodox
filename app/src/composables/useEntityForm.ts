import { reactive, watch, nextTick } from 'vue'
import { toast } from 'vue-sonner'

export const useEntityForm = <T extends Record<string, any>>(
  formTemplate: T,
  requiredFields: Array<keyof T> = [],
) => {
  const form = reactive<T>({ ...formTemplate })
  const ALLOWED_FIELDS = Object.keys(formTemplate) as Array<keyof T>

  const resetForm = () => {
    Object.assign(form, { ...formTemplate })
  }

  const fillForm = (entityData: Partial<T> | undefined) => {
    if (entityData) {
      const filteredData = Object.fromEntries(
        Object.entries(entityData).filter(([key]) => ALLOWED_FIELDS.includes(key as keyof T)),
      ) as Partial<T>
      Object.assign(form, filteredData)
    }
  }

  const validateForm = (): boolean => {
    const missingFields = requiredFields.filter((field) => {
      const value = form[field as keyof typeof form]
      return value === undefined || value === null || value === ''
    })

    if (missingFields.length > 0) {
      toast.error(`Заполните обязательные поля: ${missingFields.join(', ')}`)
      return false
    }
    return true
  }

  return {
    form,
    resetForm,
    fillForm,
    validateForm,
    ALLOWED_FIELDS,
  }
}
