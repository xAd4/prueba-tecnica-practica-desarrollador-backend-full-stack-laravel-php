import { useAppDispatch, useAppSelector } from '../../app/store/hooks'
import { onAdjustCategoryBooksCount } from '../../categories/slices/categorySlice'
import { libraryApi } from '../../shared/api/libraryApi'
import { getErrorMessage, getErrorStatus, getValidationErrors } from '../../shared/api/apiErrors'
import type { ApiItemResponse, ApiMessageResponse, SaveResult } from '../../shared/types/api.types'
import { showErrorAlert, showSuccessToast } from '../../shared/utils/alerts'
import {
  clearBooks,
  onAddNewBook,
  onCloseBookForm,
  onDeleteBook,
  onFinishSavingBook,
  onLoadAllResponseOfBooksSinceBackend,
  onLoadBooks,
  onOpenBookForm,
  onSetCategoryFilter,
  onStartLoadingBooks,
  onStartSavingBook,
  onUpdateBook,
} from '../slices/bookSlice'
import type { Book, BookPayload, BooksResponse } from '../types/book.types'

/**
 * Every call to the /books API lives here. Each action updates the global
 * Redux state (bookSlice) with the backend response.
 */
export const useBooksStore = () => {
  const dispatch = useAppDispatch()
  const {
    books,
    allResponse,
    activeBook,
    activeCategoryFilter,
    isLoadingBooks,
    isSavingBook,
    isBookFormOpen,
  } = useAppSelector((state) => state.books)

  const startLoadingBooks = async (categoryId: number | null = activeCategoryFilter): Promise<void> => {
    try {
      dispatch(onStartLoadingBooks())

      const params = new URLSearchParams()
      if (categoryId) {
        params.append('category', categoryId.toString())
      }

      let url = '/books'
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const { data } = await libraryApi.get<BooksResponse>(url)
      dispatch(clearBooks())
      dispatch(onLoadBooks([...data.data]))
      dispatch(onLoadAllResponseOfBooksSinceBackend([data]))
    } catch (error) {
      showErrorAlert(getErrorMessage(error, 'NO BACKEND: Error al cargar los libros'))
      dispatch(onLoadBooks([]))
    }
  }

  const setCategoryFilter = async (categoryId: number | null): Promise<void> => {
    dispatch(onSetCategoryFilter(categoryId))
    await startLoadingBooks(categoryId)
  }

  const startSavingBook = async (payload: BookPayload): Promise<SaveResult> => {
    const bookToUpdate = activeBook
    try {
      dispatch(onStartSavingBook())

      if (bookToUpdate) {
        const { data } = await libraryApi.put<ApiItemResponse<Book>>(`/books/${bookToUpdate.id}`, payload)
        dispatch(onUpdateBook(data.data))
        if (bookToUpdate.category_id !== data.data.category_id) {
          dispatch(onAdjustCategoryBooksCount({ categoryId: bookToUpdate.category_id, delta: -1 }))
          dispatch(onAdjustCategoryBooksCount({ categoryId: data.data.category_id, delta: 1 }))
        }
        showSuccessToast(data.message ?? 'Libro actualizado')
      } else {
        const { data } = await libraryApi.post<ApiItemResponse<Book>>('/books', payload)
        dispatch(onAddNewBook(data.data))
        dispatch(onAdjustCategoryBooksCount({ categoryId: data.data.category_id, delta: 1 }))
        showSuccessToast(data.message ?? 'Libro creado')
      }

      dispatch(onCloseBookForm())
      return { ok: true }
    } catch (error) {
      dispatch(onFinishSavingBook())

      const validationErrors = getValidationErrors(error)
      if (validationErrors) {
        return { ok: false, errors: validationErrors }
      }

      showErrorAlert(getErrorMessage(error, 'NO BACKEND: Error al guardar el libro'))
      return { ok: false, errors: {} }
    }
  }

  const startDeletingBook = async (book: Book): Promise<void> => {
    try {
      const { data } = await libraryApi.delete<ApiMessageResponse>(`/books/${book.id}`)
      dispatch(onDeleteBook(book.id))
      dispatch(onAdjustCategoryBooksCount({ categoryId: book.category_id, delta: -1 }))
      showSuccessToast(data.message ?? 'Libro eliminado')
    } catch (error) {
      if (getErrorStatus(error) === 404) {
        // It no longer exists in the backend: remove the stale copy.
        dispatch(onDeleteBook(book.id))
      }
      showErrorAlert(getErrorMessage(error, 'NO BACKEND: Error al eliminar el libro'))
    }
  }

  const openBookForm = (book: Book | null = null) => dispatch(onOpenBookForm(book))
  const closeBookForm = () => dispatch(onCloseBookForm())

  return {
    // Properties
    books,
    allResponse,
    activeBook,
    activeCategoryFilter,
    isLoadingBooks,
    isSavingBook,
    isBookFormOpen,

    // Methods
    startLoadingBooks,
    startSavingBook,
    startDeletingBook,
    setCategoryFilter,
    openBookForm,
    closeBookForm,
  }
}
