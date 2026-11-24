import type { Book } from '../books/types/book.types'
import type { Category } from '../categories/types/category.types'

export const novel: Category = { id: 1, name: 'Novela', books_count: 2 }
export const poetry: Category = { id: 2, name: 'Poesía', books_count: 1 }

export const buildBook = (overrides: Partial<Book> = {}): Book => ({
  id: 1,
  title: 'Cien años de soledad',
  author: 'Gabriel García Márquez',
  description: 'La historia de la familia Buendía.',
  published_year: 1967,
  category_id: novel.id,
  category: { id: novel.id, name: novel.name },
  ...overrides,
})
