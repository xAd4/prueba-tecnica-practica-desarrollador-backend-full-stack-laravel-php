import { motion, type MotionStyle } from 'motion/react'
import { getCategoryColor } from '../../../shared/theme/categoryColor'
import { theme } from '../../../shared/theme/theme'

const chipStyle: MotionStyle = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.space.sm,
  padding: '0.45rem 0.9rem',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.pill,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes.sm,
  fontWeight: 600,
  cursor: 'pointer',
  outline: 'none',
}

const highlightStyle: MotionStyle = {
  position: 'absolute',
  inset: -1,
  borderRadius: theme.radii.pill,
  backgroundColor: theme.colors.text,
  zIndex: 0,
}

const contentStyle: MotionStyle = {
  position: 'relative',
  zIndex: 1,
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.space.sm,
}

const dotStyle: MotionStyle = { width: 8, height: 8, borderRadius: '50%' }

const countStyle: MotionStyle = {
  fontSize: theme.fontSizes.xs,
  opacity: 0.7,
}

interface CategoryChipProps {
  label: string
  count: number
  isActive: boolean
  onSelect: () => void
  categoryId?: number
}

export const CategoryChip = ({ label, count, isActive, onSelect, categoryId }: CategoryChipProps) => (
  <motion.button
    type="button"
    style={chipStyle}
    aria-pressed={isActive}
    onClick={onSelect}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.95 }}
    whileFocus={{ boxShadow: theme.shadows.focus }}
  >
    {isActive && (
      // Shared layoutId: the dark pill slides between the selected chips.
      <motion.span layoutId="category-filter-highlight" style={highlightStyle} transition={theme.transitions.spring} />
    )}
    <motion.span
      style={contentStyle}
      animate={{ color: isActive ? theme.colors.white : theme.colors.text }}
    >
      {categoryId && <motion.span aria-hidden="true" style={{ ...dotStyle, backgroundColor: getCategoryColor(categoryId) }} />}
      {label}
      <motion.span style={countStyle}>{count}</motion.span>
    </motion.span>
  </motion.button>
)
