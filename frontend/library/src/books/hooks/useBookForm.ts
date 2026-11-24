import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { SaveResult } from '../../shared/types/api.types'
import type { BookFormErrors, BookFormValues, BookPayload } from '../types/book.types'
import { toBookFormErrors, toBookPayload, validateBook } from '../utils/bookForm'

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

/**
 * Local (UI) state of the book form: values, client validation and the
 * server validation errors returned by Laravel (422).
 */
export const useBookForm = (
  initialValues: BookFormValues,
  onSubmit: (payload: BookPayload) => Promise<SaveResult>,
) => {
  const [values, setValues] = useState<BookFormValues>(initialValues)
  const [errors, setErrors] = useState<BookFormErrors>({})

  const handleChange = ({ target }: ChangeEvent<FieldElement>) => {
    const field = target.name as keyof BookFormValues
    setValues((current) => ({ ...current, [field]: target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const clientErrors = validateBook(values)
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    const result = await onSubmit(toBookPayload(values))
    if (!result.ok) setErrors(toBookFormErrors(result.errors))
  }

  return { values, errors, handleChange, handleSubmit }
}
