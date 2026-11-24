import { motion, type MotionStyle } from 'motion/react'
import { useBooksStore } from '../../../books/hooks/useBooksStore'
import { Modal } from '../../../shared/components/ui/Modal/Modal'
import { theme } from '../../../shared/theme/theme'
import { confirmDanger } from '../../../shared/utils/alerts'
import { useCategoriesStore } from '../../hooks/useCategoriesStore'
import type { Category } from '../../types/category.types'
import { CategoryForm } from '../CategoryForm/CategoryForm'
import { CategoryList } from '../CategoryList/CategoryList'

const contentStyle: MotionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.lg,
}

const hintStyle: MotionStyle = {
  margin: 0,
  fontSize: theme.fontSizes.xs,
  color: theme.colors.textMuted,
}

interface CategoryManagerModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CategoryManagerModal = ({ isOpen, onClose }: CategoryManagerModalProps) => {
  const {
    categories,
    activeCategory,
    isSavingCategory,
    startSavingCategory,
    startDeletingCategory,
    setActiveCategory,
  } = useCategoriesStore()
  const { activeCategoryFilter, setCategoryFilter } = useBooksStore()

  const handleClose = () => {
    setActiveCategory(null)
    onClose()
  }

  const handleDelete = async (category: Category) => {
    const confirmed = await confirmDanger('¿Eliminar categoría?', `Se eliminará la categoría "${category.name}".`)
    if (!confirmed) return

    const deleted = await startDeletingCategory(category)
    // If the deleted category was being used as filter, go back to "all".
    if (deleted && activeCategoryFilter === category.id) await setCategoryFilter(null)
  }

  return (
    <Modal isOpen={isOpen} title="Gestionar categorías" onClose={handleClose} maxWidth="620px">
      <motion.div style={contentStyle}>
        <CategoryForm
          key={activeCategory?.id ?? 'new'}
          initialName={activeCategory?.name ?? ''}
          isEditing={activeCategory !== null}
          isSaving={isSavingCategory}
          onSubmit={startSavingCategory}
          onCancelEdit={() => setActiveCategory(null)}
        />

        <CategoryList
          categories={categories}
          activeCategoryId={activeCategory?.id}
          onEdit={setActiveCategory}
          onDelete={handleDelete}
        />

        <motion.p style={hintStyle}>
          Las categorías con libros asociados no se pueden eliminar.
        </motion.p>
      </motion.div>
    </Modal>
  )
}
