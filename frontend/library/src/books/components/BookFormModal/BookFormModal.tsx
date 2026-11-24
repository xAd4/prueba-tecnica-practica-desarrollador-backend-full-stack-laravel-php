import { useCategoriesStore } from '../../../categories/hooks/useCategoriesStore'
import { Modal } from '../../../shared/components/ui/Modal/Modal'
import { useBooksStore } from '../../hooks/useBooksStore'
import { toBookFormValues } from '../../utils/bookForm'
import { BookForm } from '../BookForm/BookForm'

/** Connects the book form with the global state (create / edit). */
export const BookFormModal = () => {
  const { activeBook, activeCategoryFilter, isBookFormOpen, isSavingBook, startSavingBook, closeBookForm } =
    useBooksStore()
  const { categories } = useCategoriesStore()
  const isEditing = activeBook !== null

  return (
    <Modal
      isOpen={isBookFormOpen}
      title={isEditing ? 'Editar libro' : 'Nuevo libro'}
      onClose={closeBookForm}
    >
      {/* `key` remounts the form so its local state starts from the selected book. */}
      <BookForm
        key={activeBook?.id ?? 'new'}
        initialValues={toBookFormValues(activeBook, activeCategoryFilter)}
        categories={categories}
        isSaving={isSavingBook}
        submitLabel={isEditing ? 'Guardar cambios' : 'Crear libro'}
        onSubmit={startSavingBook}
        onCancel={closeBookForm}
      />
    </Modal>
  )
}
