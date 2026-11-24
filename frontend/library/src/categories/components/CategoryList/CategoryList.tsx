import { AnimatePresence, motion, type MotionStyle } from 'motion/react'
import { theme } from '../../../shared/theme/theme'
import type { Category } from '../../types/category.types'
import { CategoryListItem } from './CategoryListItem'

const listStyle: MotionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.sm,
  margin: 0,
  padding: 0,
}

const emptyStyle: MotionStyle = {
  margin: 0,
  color: theme.colors.textMuted,
  textAlign: 'center',
  padding: theme.space.lg,
}

interface CategoryListProps {
  categories: Category[]
  activeCategoryId?: number
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export const CategoryList = ({ categories, activeCategoryId, onEdit, onDelete }: CategoryListProps) => {
  if (categories.length === 0) {
    return <motion.p style={emptyStyle}>Todavía no hay categorías.</motion.p>
  }

  return (
    <motion.ul style={listStyle} aria-label="Listado de categorías">
      <AnimatePresence mode="popLayout" initial={false}>
        {categories.map((category) => (
          <CategoryListItem
            key={category.id}
            category={category}
            isActive={category.id === activeCategoryId}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}
