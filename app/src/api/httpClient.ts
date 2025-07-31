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

const handleExit = (itemName) => {
  // localStorage.removeItem(itemName)
  const authStore = useAuthStore()
  authStore.logout()
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
    //console.log('All error headers:', error.response?.headers)

    if (error.code === 'ECONNABORTED') {
      error.response = {
        status: 408,
        statusText: 'Request Timeout',
        data: {
          message:
            'The server did not respond within ' +
            error.config.timeout / DEFAULT_TIMEOUT +
            '  seconds',
        },
      }
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

    if (
      error.response.status === 401 ||
      error.response.status === 403 ||
      error.response.status === 429
    ) {
      const authStore = useAuthStore()
      const accessToken = authStore.accessToken

      if (retryCount < maxRetries) {
        try {
          return handleRetry(error.config, accessToken)
        } catch (err) {
          return handleExit(authStore.accessTokenName)
        } finally {
          retryCount++
        }
      } else {
        return handleExit(authStore.accessTokenName)
      }
    }

    return Promise.reject(error)
  },
)

export default api
