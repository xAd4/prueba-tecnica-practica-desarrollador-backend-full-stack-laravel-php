import { isAxiosError } from 'axios'
import type { ValidationErrors } from '../types/api.types'

export const getErrorStatus = (error: unknown): number | undefined =>
  isAxiosError(error) ? error.response?.status : undefined

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback
  }
  return fallback
}

export const getValidationErrors = (error: unknown): ValidationErrors | null => {
  if (isAxiosError<{ errors?: ValidationErrors }>(error) && error.response?.status === 422) {
    return error.response.data?.errors ?? {}
  }
  return null
}
