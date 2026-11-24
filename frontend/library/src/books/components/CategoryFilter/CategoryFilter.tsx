import { motion, type MotionStyle } from 'motion/react'
import { useCategoriesStore } from '../../../categories/hooks/useCategoriesStore'
import { theme } from '../../../shared/theme/theme'
import { useBooksStore } from '../../hooks/useBooksStore'
import { CategoryChip } from './CategoryChip'

const containerStyle: MotionStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.space.sm,
  marginBottom: theme.space.lg,
}

/** Filters the books list by category: GET /books?category={id}. */
export const CategoryFilter = () => {
  const { categories } = useCategoriesStore()
  const { activeCategoryFilter, setCategoryFilter } = useBooksStore()
  const totalBooks = categories.reduce((total, category) => total + (category.books_count ?? 0), 0)

  return (
    <motion.nav style={containerStyle} aria-label="Filtrar por categoría">
      <CategoryChip
        label="Todas"
        count={totalBooks}
        isActive={activeCategoryFilter === null}
        onSelect={() => setCategoryFilter(null)}
      />
      {categories.map((category) => (
        <CategoryChip
          key={category.id}
          categoryId={category.id}
          label={category.name}
          count={category.books_count ?? 0}
          isActive={activeCategoryFilter === category.id}
          onSelect={() => setCategoryFilter(category.id)}
        />
      ))}
    </motion.nav>
  )
}
