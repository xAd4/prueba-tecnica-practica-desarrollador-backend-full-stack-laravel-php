/**
 * Version of this frontend build. Injected at build time from the Docker
 * build argument APP_VERSION (see Dockerfile). "dev" when running locally.
 */
export const FRONTEND_VERSION: string = import.meta.env.VITE_APP_VERSION || 'dev'

/** "1.0.7" -> "v1.0.7", "dev" -> "dev". */
export const formatVersion = (version: string | null): string => {
  if (!version) return '—'
  return /^\d/.test(version) ? `v${version}` : version
}
