import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const DEFAULT_TIMEOUT = import.meta.env.VITE_REQUEST_TIMEOUT || 20000

let retryCount = 0
const maxRetries = 2
let isRefreshing = false

const handleRetry = (config, token) => {
  config.headers['Authorization'] = `Bearer ${token}`
  return api.request(config)
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: DEFAULT_TIMEOUT,
})

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => {
    return {
      ...response,
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response.config,
    }
  },
  async (error) => {
    const authStore = useAuthStore()

    if (error.code === 'ECONNABORTED') {
      error.response = {
        status: 408,
        statusText: 'Request Timeout',
        data: { message: 'Превышено время ожидания ответа сервера' },
      }
      return Promise.reject(error)
    }

    if (error.response?.headers?.authorization && !isRefreshing) {
      isRefreshing = true
      const token = await authStore.checkToken(error.response?.headers)

      try {
        return handleRetry(error.config, token)
      } catch (err) {
        throw err
      } finally {
        isRefreshing = false
      }
    }

    if (error.response?.status === 401) {
      await authStore.logout()
      return Promise.reject(new Error('Сессия истекла. Пожалуйста, войдите снова.'))
    }

    if (error.response?.status === 403) {
      await authStore.loadUser()
      if (!authStore.isEmailVerified) {
        window.location.reload()
      }
    }

    return Promise.reject(error)
  },
)

export default api
