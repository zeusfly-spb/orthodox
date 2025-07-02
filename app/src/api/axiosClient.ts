import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const DEFAULT_TIMEOUT = import.meta.env.VITE_REQUEST_TIMEOUT || 20000

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

// Implementing a request queue in Axios interceptors
import { AxiosRequestConfig } from 'axios'

// Define the structure of a retry queue item
interface RetryQueueItem {
  resolve: (value?: any) => void
  reject: (error?: any) => void
  config: AxiosRequestConfig
}

// Create a list to hold the request queue
const refreshAndRetryQueue: RetryQueueItem[] = []

// Flag to prevent multiple token refresh requests
let isRefreshing = false

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
    const originalRequest: AxiosRequestConfig = error.config

    if (error.response && error.response.status === 403) {
      if (!isRefreshing) {
        isRefreshing = true
        try {
          // Refresh the access token
          const authStore = useAuthStore()
          const newAccessToken = await authStore.checkToken(error.response?.headers)

          // Update the request headers with the new access token
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`

          // Retry all requests in the queue with the new token
          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            api
              .request(config)
              .then((response) => resolve(response))
              .catch((err) => reject(err))
          })

          // Clear the queue
          refreshAndRetryQueue.length = 0

          // Retry the original request
          return api(originalRequest)
        } catch (refreshError) {
          // Handle token refresh error
          // You can clear all storage and redirect the user to the login page
          throw refreshError
        } finally {
          isRefreshing = false
        }
      }

      // Add the original request to the queue
      return new Promise<void>((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject })
      })
    }

    // Return a Promise rejection if the status code is not 401
    return Promise.reject(error)
  },
)

export default api
