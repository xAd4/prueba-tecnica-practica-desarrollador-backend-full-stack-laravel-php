import { motion, type MotionStyle } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { Button } from '../../../shared/components/ui/Button/Button'
import { FormField } from '../../../shared/components/ui/Form/FormField'
import { TextInput } from '../../../shared/components/ui/Form/TextInput'
import { theme } from '../../../shared/theme/theme'
import type { SaveResult } from '../../../shared/types/api.types'
import type { CategoryPayload } from '../../types/category.types'

const formStyle: MotionStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.space.sm,
  flexWrap: 'wrap',
}

const fieldWrapperStyle: MotionStyle = { flex: '1 1 220px' }

const actionsStyle: MotionStyle = {
  display: 'flex',
  gap: theme.space.sm,
  // Aligns the buttons with the input (label height + gap).
  paddingTop: '1.6rem',
}

interface CategoryFormProps {
  initialName: string
  isEditing: boolean
  isSaving: boolean
  onSubmit: (payload: CategoryPayload) => Promise<SaveResult>
  onCancelEdit: () => void
}

export const CategoryForm = ({ initialName, isEditing, isSaving, onSubmit, onCancelEdit }: CategoryFormProps) => {
  const [name, setName] = useState(initialName)
  const [error, setError] = useState<string>()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim()) {
      setError('El nombre de la categoría es obligatorio.')
      return
    }

    const result = await onSubmit({ name: name.trim() })
    if (result.ok) {
      setName('')
      setError(undefined)
    } else {
      setError(result.errors.name?.[0])
    }
  }

  return (
    <motion.form style={formStyle} onSubmit={handleSubmit} noValidate aria-label="Formulario de categoría">
      <motion.div style={fieldWrapperStyle}>
        <FormField id="category-name" label={isEditing ? 'Editar categoría' : 'Nueva categoría'} error={error} required>
          <TextInput
            id="category-name"
            name="name"
            value={name}
            invalid={Boolean(error)}
            placeholder="Ej. Ciencia ficción"
            onChange={(event) => {
              setName(event.target.value)
              setError(undefined)
            }}
          />
        </FormField>
      </motion.div>

      <motion.div style={actionsStyle}>
        {isEditing && (
          <Button variant="secondary" onClick={onCancelEdit} disabled={isSaving}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Guardando...' : isEditing ? 'Guardar' : 'Agregar'}
        </Button>
      </motion.div>
    </motion.form>
  )
}
