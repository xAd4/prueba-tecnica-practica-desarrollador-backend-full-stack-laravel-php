/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Laravel API. Defaults to `/api` (proxied by Vite / Nginx). */
  readonly VITE_API_URL?: string
  /** Version of the frontend image (Docker build arg APP_VERSION). */
  readonly VITE_APP_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
