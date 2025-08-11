import api from './httpClient'
import type { File } from '@/types/file'

export const fetchFiles = async (): Promise<{ data: File[] }> => {
  const { data } = await api.get<{ data: File[] }>('/manage/operator/uploads')
  return data
}