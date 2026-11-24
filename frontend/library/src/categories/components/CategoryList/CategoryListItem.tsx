import { motion, type MotionStyle } from 'motion/react'
import type { Ref } from 'react'
import { Button } from '../../../shared/components/ui/Button/Button'
import { getCategoryColor } from '../../../shared/theme/categoryColor'
import { theme } from '../../../shared/theme/theme'
import type { Category } from '../../types/category.types'

const itemStyle: MotionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.sm,
  padding: `${theme.space.sm} ${theme.space.md}`,
  borderRadius: theme.radii.md,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surface,
  listStyle: 'none',
}

const dotStyle: MotionStyle = { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 }

const nameStyle: MotionStyle = {
  flex: 1,
  minWidth: 0,
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const countStyle: MotionStyle = {
  fontSize: theme.fontSizes.xs,
  color: theme.colors.textMuted,
  whiteSpace: 'nowrap',
}

interface CategoryListItemProps {
  category: Category
  isActive: boolean
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  ref?: Ref<HTMLLIElement>
}

export const CategoryListItem = ({ category, isActive, onEdit, onDelete, ref }: CategoryListItemProps) => {
  const booksCount = category.books_count ?? 0

  return (
    <motion.li
      ref={ref}
      layout
      style={{ ...itemStyle, ...(isActive ? { borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft } : {}) }}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
    >
      <motion.span aria-hidden="true" style={{ ...dotStyle, backgroundColor: getCategoryColor(category.id) }} />
      <motion.span style={nameStyle}>{category.name}</motion.span>
      <motion.span style={countStyle}>{booksCount === 1 ? '1 libro' : `${booksCount} libros`}</motion.span>
      <Button variant="ghost" size="sm" onClick={() => onEdit(category)} aria-label={`Editar ${category.name}`}>
        ✎
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(category)}
        aria-label={`Eliminar ${category.name}`}
        title={booksCount > 0 ? 'Tiene libros asociados: no se puede eliminar' : 'Eliminar'}
      >
        🗑
      </Button>
    </motion.li>
  )
}
