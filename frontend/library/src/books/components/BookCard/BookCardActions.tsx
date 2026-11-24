import { motion } from 'motion/react'
import { Button } from '../../../shared/components/ui/Button/Button'
import { confirmDanger } from '../../../shared/utils/alerts'
import { useBooksStore } from '../../hooks/useBooksStore'
import type { Book } from '../../types/book.types'
import { footerStyle } from './BookCard.styles'

interface BookCardActionsProps {
  book: Book
}

export const BookCardActions = ({ book }: BookCardActionsProps) => {
  const { openBookForm, startDeletingBook } = useBooksStore()

  const handleDelete = async () => {
    const confirmed = await confirmDanger('¿Eliminar libro?', `Se eliminará "${book.title}". Esta acción no se puede deshacer.`)
    if (confirmed) await startDeletingBook(book)
  }

  return (
    <motion.footer style={footerStyle}>
      <Button variant="ghost" size="sm" onClick={() => openBookForm(book)} aria-label={`Editar ${book.title}`}>
        ✎ Editar
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDelete} aria-label={`Eliminar ${book.title}`}>
        🗑 Eliminar
      </Button>
    </motion.footer>
  )
}
