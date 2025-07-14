import { useCrudActions } from './useCrudActions'
import { managerApi } from '@/api/managers'

export const useManagerActions = () => {
  return useCrudActions(managerApi, {
    successMessage: 'Данные менеджера сохранены',
    deleteMessage: 'Менеджер удален',
  })
}
