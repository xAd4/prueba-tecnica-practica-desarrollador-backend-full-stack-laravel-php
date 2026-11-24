import { AnimatePresence, motion, type MotionStyle } from 'motion/react'
import { theme } from '../../../shared/theme/theme'
import type { Book } from '../../types/book.types'
import { BookCard } from '../BookCard/BookCard'

const gridStyle: MotionStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.space.lg,
}

interface BookListProps {
  books: Book[]
}

export const BookList = ({ books }: BookListProps) => (
  <motion.section style={gridStyle} aria-label="Listado de libros" layout>
    <AnimatePresence mode="popLayout">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </AnimatePresence>
  </motion.section>
)
