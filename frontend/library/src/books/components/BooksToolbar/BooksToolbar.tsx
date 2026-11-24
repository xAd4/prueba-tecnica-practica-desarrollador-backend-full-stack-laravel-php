import { motion, type MotionStyle } from 'motion/react'
import { Button } from '../../../shared/components/ui/Button/Button'
import { theme } from '../../../shared/theme/theme'
import { useBooksStore } from '../../hooks/useBooksStore'

const toolbarStyle: MotionStyle = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.space.md,
  marginBottom: theme.space.lg,
}

const titleStyle: MotionStyle = {
  margin: 0,
  fontFamily: theme.fonts.heading,
  fontSize: theme.fontSizes.xxl,
  lineHeight: 1.1,
}

const subtitleStyle: MotionStyle = {
  margin: `${theme.space.xs} 0 0`,
  color: theme.colors.textMuted,
}

const actionsStyle: MotionStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.space.sm,
}

interface BooksToolbarProps {
  onManageCategories: () => void
}

export const BooksToolbar = ({ onManageCategories }: BooksToolbarProps) => {
  const { books, openBookForm } = useBooksStore()

  return (
    <motion.div style={toolbarStyle}>
      <motion.div>
        <motion.h2 style={titleStyle}>Libros</motion.h2>
        <motion.p style={subtitleStyle} key={books.length} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
          {books.length === 1 ? '1 libro' : `${books.length} libros`} en esta vista
        </motion.p>
      </motion.div>

      <motion.div style={actionsStyle}>
        <Button variant="secondary" onClick={onManageCategories}>
          🏷 Gestionar categorías
        </Button>
        <Button onClick={() => openBookForm(null)}>＋ Nuevo libro</Button>
      </motion.div>
    </motion.div>
  )
}
