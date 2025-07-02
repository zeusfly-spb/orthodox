import api from './httpClient'

export function createApiClient<T>(endpoint: string) {
  const route: string = '/manage/' + endpoint

  return {
    fetchData: async (params?: Record<string, unknown>): Promise<T[]> => {
      const response = await api.get(`${route}`, { params })
      return response?.data
    },
    getData: async (id: number | string): Promise<T> => {
      const response = await api.get(`${route}/${id}`)
      return response?.data
    },
    storeData: async (data: Partial<T>): Promise<T> => {
      const response = await api.post(`${route}`, data)
      return response?.data
    },
    patchData: async (id: number | string, data: Partial<T>): Promise<T> => {
      const response = await api.patch(`${route}/${id}`, data)
      return response?.data
    },
    deleteData: async (id: number | string): Promise<void> => {
      await api.delete(`${route}/${id}`)
    },
  }
}
