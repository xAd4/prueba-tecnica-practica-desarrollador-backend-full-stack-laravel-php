import { motion } from 'motion/react'
import type { Category } from '../../../categories/types/category.types'
import { Button } from '../../../shared/components/ui/Button/Button'
import { FormField } from '../../../shared/components/ui/Form/FormField'
import { SelectInput } from '../../../shared/components/ui/Form/SelectInput'
import { TextAreaInput } from '../../../shared/components/ui/Form/TextAreaInput'
import { TextInput } from '../../../shared/components/ui/Form/TextInput'
import type { SaveResult } from '../../../shared/types/api.types'
import { useBookForm } from '../../hooks/useBookForm'
import type { BookFormValues, BookPayload } from '../../types/book.types'
import { actionsStyle, formStyle, rowStyle } from './BookForm.styles'

interface BookFormProps {
  initialValues: BookFormValues
  categories: Category[]
  isSaving: boolean
  submitLabel: string
  onSubmit: (payload: BookPayload) => Promise<SaveResult>
  onCancel: () => void
}

export const BookForm = ({
  initialValues,
  categories,
  isSaving,
  submitLabel,
  onSubmit,
  onCancel,
}: BookFormProps) => {
  const { values, errors, handleChange, handleSubmit } = useBookForm(initialValues, onSubmit)
  const categoryOptions = categories.map(({ id, name }) => ({ value: id, label: name }))

  return (
    <motion.form style={formStyle} onSubmit={handleSubmit} noValidate aria-label="Formulario de libro">
      <FormField id="book-title" label="Título" error={errors.title} required>
        <TextInput
          id="book-title"
          name="title"
          value={values.title}
          onChange={handleChange}
          invalid={Boolean(errors.title)}
          placeholder="Ej. Cien años de soledad"
          autoFocus
        />
      </FormField>

      <FormField id="book-author" label="Autor" error={errors.author} required>
        <TextInput
          id="book-author"
          name="author"
          value={values.author}
          onChange={handleChange}
          invalid={Boolean(errors.author)}
          placeholder="Ej. Gabriel García Márquez"
        />
      </FormField>

      <motion.div style={rowStyle}>
        <FormField id="book-year" label="Año de publicación" error={errors.published_year} required>
          <TextInput
            id="book-year"
            name="published_year"
            type="number"
            inputMode="numeric"
            value={values.published_year}
            onChange={handleChange}
            invalid={Boolean(errors.published_year)}
            placeholder="Ej. 1967"
          />
        </FormField>

        <FormField id="book-category" label="Categoría" error={errors.category_id} required>
          <SelectInput
            id="book-category"
            name="category_id"
            value={values.category_id}
            onChange={handleChange}
            invalid={Boolean(errors.category_id)}
            options={categoryOptions}
            placeholder="Selecciona una categoría"
          />
        </FormField>
      </motion.div>

      <FormField id="book-description" label="Descripción" error={errors.description}>
        <TextAreaInput
          id="book-description"
          name="description"
          value={values.description}
          onChange={handleChange}
          invalid={Boolean(errors.description)}
          placeholder="Opcional"
          rows={4}
        />
      </FormField>

      <motion.div style={actionsStyle}>
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Guardando...' : submitLabel}
        </Button>
      </motion.div>
    </motion.form>
  )
}
