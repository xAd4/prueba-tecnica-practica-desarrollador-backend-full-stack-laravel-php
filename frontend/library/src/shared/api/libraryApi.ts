import axios from 'axios'

/**
 * Axios instance for the Library (Laravel) API.
 * `/api` is proxied to the backend by Vite (dev) and by Nginx (Docker).
 */
export const libraryApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})
