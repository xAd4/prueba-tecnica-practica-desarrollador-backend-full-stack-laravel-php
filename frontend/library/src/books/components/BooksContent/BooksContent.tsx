import { Button } from '../../../shared/components/ui/Button/Button'
import { EmptyState } from '../../../shared/components/ui/EmptyState/EmptyState'
import { Spinner } from '../../../shared/components/ui/Spinner/Spinner'
import { useBooksStore } from '../../hooks/useBooksStore'
import { BookList } from '../BookList/BookList'

/** Decides what to render: loader, empty state or the list of books. */
export const BooksContent = () => {
  const { books, isLoadingBooks, activeCategoryFilter, openBookForm } = useBooksStore()

  if (isLoadingBooks && books.length === 0) {
    return <Spinner label="Cargando libros..." />
  }

  if (books.length === 0) {
    return (
      <EmptyState
        title={activeCategoryFilter ? 'No hay libros en esta categoría' : 'Aún no hay libros'}
        description="Registra tu primer libro para empezar a construir la biblioteca."
        action={<Button onClick={() => openBookForm(null)}>＋ Nuevo libro</Button>}
      />
    )
  }

  return <BookList books={books} />
}
