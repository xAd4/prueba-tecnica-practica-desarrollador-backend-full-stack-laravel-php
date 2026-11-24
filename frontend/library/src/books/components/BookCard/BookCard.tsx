import { motion } from 'motion/react'
import type { Ref } from 'react'
import { Badge } from '../../../shared/components/ui/Badge/Badge'
import { getCategoryColor, getCategorySoftColor } from '../../../shared/theme/categoryColor'
import { theme } from '../../../shared/theme/theme'
import type { Book } from '../../types/book.types'
import { BookCardActions } from './BookCardActions'
import {
  authorStyle,
  cardAnimation,
  cardHover,
  cardStyle,
  descriptionStyle,
  emptyDescriptionStyle,
  headerStyle,
  spineStyle,
  titleStyle,
} from './BookCard.styles'

interface BookCardProps {
  book: Book
  /** AnimatePresence (popLayout) needs the DOM node to animate the exit. */
  ref?: Ref<HTMLElement>
}

export const BookCard = ({ book, ref }: BookCardProps) => (
  <motion.article
    ref={ref}
    layout
    style={cardStyle}
    {...cardAnimation}
    whileHover={cardHover}
    transition={theme.transitions.spring}
    aria-label={book.title}
  >
    <motion.span aria-hidden="true" style={{ ...spineStyle, backgroundColor: getCategoryColor(book.category_id) }} />

    <motion.div style={headerStyle}>
      <Badge color={getCategoryColor(book.category_id)} background={getCategorySoftColor(book.category_id)}>
        {book.category?.name ?? 'Sin categoría'}
      </Badge>
      <Badge color={theme.colors.accent} background={theme.colors.accentSoft}>
        {book.published_year}
      </Badge>
    </motion.div>

    <motion.h3 style={titleStyle}>{book.title}</motion.h3>
    <motion.p style={authorStyle}>por {book.author}</motion.p>

    {book.description ? (
      <motion.p style={descriptionStyle} title={book.description}>
        {book.description}
      </motion.p>
    ) : (
      <motion.p style={emptyDescriptionStyle}>Sin descripción</motion.p>
    )}

    <BookCardActions book={book} />
  </motion.article>
)
