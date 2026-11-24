/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Laravel API. Defaults to `/api` (proxied by Vite / Nginx). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
