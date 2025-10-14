

export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://orthodox-api.zeusfly.ru/api',
  requestTimeout: import.meta.env.VITE_REQUEST_TIMEOUT 
    ? parseInt(import.meta.env.VITE_REQUEST_TIMEOUT, 10) 
    : 20000,
};