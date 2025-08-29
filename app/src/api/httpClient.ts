import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 20000
const MAX_RETRIES = 2
let isRefreshing = false

type RetryableConfig = InternalAxiosRequestConfig & { _retryCount?: number }

const handleRetry = (config: RetryableConfig, token: string | null) => {
  if (!token) return Promise.reject(new Error('Missing token for retry'))

  const headers: AxiosRequestHeaders = (config.headers || {}) as AxiosRequestHeaders
  headers['Authorization'] = `Bearer ${token}`
  config.headers = headers
  config._retryCount = (config._retryCount ?? 0) + 1
  return api.request(config)
}

const handleExit = () => {
  const authStore = useAuthStore()
  return authStore.logout()
}

const api: AxiosInstance = axios.create({
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
  async (rawError) => {
    const authStore = useAuthStore()
    const error = rawError as AxiosError
    const response = error.response
    const config = (error.config || {}) as RetryableConfig

    if (error.code === 'ECONNABORTED') {
      const timeoutMs = config.timeout ?? DEFAULT_TIMEOUT
      const seconds = Math.ceil(timeoutMs / 1000)
      const syntheticResponse: AxiosResponse = {
        data: { message: `The server did not respond within ${seconds} seconds` },
        status: 408,
        statusText: 'Request Timeout',
        headers: {},
        config,
      }
      ;(error as AxiosError).response = syntheticResponse
    }

    if (response?.headers?.authorization && !isRefreshing) {
      isRefreshing = true
      const token = await authStore.checkToken(response.headers)
      try {
        return handleRetry(config, token)
      } finally {
        isRefreshing = false
      }
    }

    if (response?.status === 401) {
      return handleExit()
    }

    if (response?.status === 403) {
      const accessToken = authStore.accessToken
      const currentRetries = config._retryCount ?? 0
      if (currentRetries < MAX_RETRIES) {
        return handleRetry(config, accessToken)
      }
      return handleExit()
    }

    return Promise.reject(error)
  },
)

export default api
