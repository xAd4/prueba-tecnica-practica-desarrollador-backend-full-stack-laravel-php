import { useEffect, useState } from 'react'
import { CategoryManagerModal } from '../../categories/components/CategoryManagerModal/CategoryManagerModal'
import { useCategoriesStore } from '../../categories/hooks/useCategoriesStore'
import { BookFormModal } from '../components/BookFormModal/BookFormModal'
import { BooksContent } from '../components/BooksContent/BooksContent'
import { BooksToolbar } from '../components/BooksToolbar/BooksToolbar'
import { CategoryFilter } from '../components/CategoryFilter/CategoryFilter'
import { useBooksStore } from '../hooks/useBooksStore'

export const BooksPage = () => {
  const { startLoadingBooks } = useBooksStore()
  const { startLoadingCategories } = useCategoriesStore()
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)

  useEffect(() => {
    void startLoadingCategories()
    void startLoadingBooks(null)
    // Load the initial data only once, when the page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <BooksToolbar onManageCategories={() => setIsCategoryManagerOpen(true)} />
      <CategoryFilter />
      <BooksContent />

      <BookFormModal />
      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
      />
    </>
  )
}
