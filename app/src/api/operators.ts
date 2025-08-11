import api from './httpClient'
import { createApiClient } from './generic'
import type { fetchManagers as fetchType } from '@/types/manager'
import type { Operator } from '@/types/operator'

export const fetchOperators = async (): Promise<Operator[]> => {
  const { data } = await api.get<{ data: Operator[] }>('/operators')
  return data.data
}
export const fetchOperatorById = async (id:number): Promise<Operator[]> => {
  const { data } = await api.get<{ data: Operator[] }>(`/manage/operator`)
  return data.data
}

export const fetchManagers = async (): Promise<fetchType[]> => {
  const { data } = await api.get<{ data: fetchType[] }>('/manage/operator/managers')
  return data.data
}

export const pushManagers = async (data:object): Promise<void> => {
  await api.post('/manage/operator/managers', data)
}

export const operatorApi = createApiClient('operator')