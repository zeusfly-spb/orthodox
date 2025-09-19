/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  interface ProcessEnv {
    VITE_API_URL?: string;
    VITE_REQUEST_TIMEOUT?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
  const component: DefineComponent<{}, {}, any>
  export default component
}
