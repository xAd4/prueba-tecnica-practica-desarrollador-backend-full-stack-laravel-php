/** Laravel validation errors: `{ field: ['message', ...] }`. */
export type ValidationErrors = Record<string, string[]>

/** Collection returned by a Laravel API Resource. */
export interface ApiCollectionResponse<T, Meta = Record<string, unknown>> {
  data: T[]
  meta?: Meta
}

/** Single item returned by a Laravel API Resource. */
export interface ApiItemResponse<T> {
  data: T
  message?: string
}

export interface ApiMessageResponse {
  message: string
}

/** Result of a save action: the form needs the validation errors to show them. */
export type SaveResult = { ok: true } | { ok: false; errors: ValidationErrors }
