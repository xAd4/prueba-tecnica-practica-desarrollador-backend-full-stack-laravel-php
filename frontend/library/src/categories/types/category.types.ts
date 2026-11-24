import type { ApiCollectionResponse } from '../../shared/types/api.types'

export interface Category {
  id: number
  name: string
  books_count?: number
  created_at?: string | null
  updated_at?: string | null
}

export interface CategoryPayload {
  name: string
}

export type CategoriesResponse = ApiCollectionResponse<Category>
