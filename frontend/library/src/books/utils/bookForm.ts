import type { ValidationErrors } from '../../shared/types/api.types'
import type { Book, BookFormErrors, BookFormValues, BookPayload } from '../types/book.types'

export const MIN_TITLE_LENGTH = 3
export const MIN_PUBLISHED_YEAR = 1000

export const emptyBookFormValues: BookFormValues = {
  title: '',
  author: '',
  description: '',
  published_year: '',
  category_id: '',
}

export const toBookFormValues = (book: Book | null, defaultCategoryId?: number | null): BookFormValues =>
  book
    ? {
        title: book.title,
        author: book.author,
        description: book.description ?? '',
        published_year: String(book.published_year),
        category_id: String(book.category_id),
      }
    : { ...emptyBookFormValues, category_id: defaultCategoryId ? String(defaultCategoryId) : '' }

export const toBookPayload = (values: BookFormValues): BookPayload => ({
  title: values.title.trim(),
  author: values.author.trim(),
  description: values.description.trim() || null,
  published_year: Number(values.published_year),
  category_id: Number(values.category_id),
})

/** Client side validation that mirrors the Laravel Form Request rules. */
export const validateBook = (
  values: BookFormValues,
  currentYear = new Date().getFullYear(),
): BookFormErrors => {
  const errors: BookFormErrors = {}
  const title = values.title.trim()
  const year = values.published_year.trim()

  if (!title) errors.title = 'El título es obligatorio.'
  else if (title.length < MIN_TITLE_LENGTH)
    errors.title = `El título debe tener al menos ${MIN_TITLE_LENGTH} caracteres.`

  if (!values.author.trim()) errors.author = 'El autor es obligatorio.'

  if (!year) errors.published_year = 'El año de publicación es obligatorio.'
  else if (!/^\d+$/.test(year)) errors.published_year = 'El año de publicación debe ser un número entero.'
  else if (Number(year) < MIN_PUBLISHED_YEAR || Number(year) > currentYear)
    errors.published_year = `Introduce un año válido entre ${MIN_PUBLISHED_YEAR} y ${currentYear}.`

  if (!values.category_id) errors.category_id = 'La categoría es obligatoria.'

  return errors
}

/** Converts Laravel's `{ field: [messages] }` to `{ field: firstMessage }`. */
export const toBookFormErrors = (errors: ValidationErrors): BookFormErrors =>
  Object.fromEntries(
    Object.entries(errors)
      .filter(([field]) => field in emptyBookFormValues)
      .map(([field, messages]) => [field, messages[0]]),
  ) as BookFormErrors
