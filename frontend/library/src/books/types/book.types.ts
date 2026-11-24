import type { Category } from '../../categories/types/category.types'
import type { ApiCollectionResponse } from '../../shared/types/api.types'

export interface Book {
  id: number
  title: string
  author: string
  description: string | null
  published_year: number
  category_id: number
  category?: Pick<Category, 'id' | 'name'> | null
  created_at?: string | null
  updated_at?: string | null
}

/** Body sent to POST /books and PUT /books/{id}. */
export interface BookPayload {
  title: string
  author: string
  description: string | null
  published_year: number
  category_id: number
}

/** Values handled by the form inputs (always strings). */
export interface BookFormValues {
  title: string
  author: string
  description: string
  published_year: string
  category_id: string
}

export type BookFormErrors = Partial<Record<keyof BookFormValues, string>>

export interface BooksMeta {
  total: number
  category: number | null
}

export type BooksResponse = ApiCollectionResponse<Book, BooksMeta>
