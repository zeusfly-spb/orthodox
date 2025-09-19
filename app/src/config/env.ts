

export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  requestTimeout: import.meta.env.VITE_REQUEST_TIMEOUT 
    ? parseInt(import.meta.env.VITE_REQUEST_TIMEOUT, 10) 
    : 20000,
};