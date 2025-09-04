import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const DEFAULT_TIMEOUT = import.meta.env.VITE_REQUEST_TIMEOUT || 20000;

let retryCount = 0;
const maxRetries = 2;
let isRefreshing = false;

const handleRetry = (config: any, token: string | null): Promise<any> => {
  if (!token) {
    throw new Error('No token available for retry');
  }
  config.headers = config.headers || {};
  config.headers['Authorization'] = `Bearer ${token}`;
  return api.request(config);
};

const handleExit = (): Promise<void> => {
  const authStore = useAuthStore();
  return authStore.logout();
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: DEFAULT_TIMEOUT,
});

api.interceptors.request.use(
  (config: any) => {
    const authStore = useAuthStore();
    const accessToken = authStore.accessToken;

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: any) => {
    return {
      ...response,
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response.config,
    };
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
      isRefreshing = true;
      const headers = error.response.headers as Record<string, string>;
      const token = await authStore.checkToken(headers);

      try {
        return handleRetry(error.config, token);
      } catch (err) {
        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      return handleExit();
    }

    if (error.response?.status === 403) {
      console.log('REDIRECT!')
      await authStore.loadUser()
      if (!authStore.isEmailVerified) {
        window.location.reload()
      }
    }

    return Promise.reject(error);
  },
);

export default api;
