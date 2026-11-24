import { act, waitFor } from '@testing-library/react'
import { AxiosError, AxiosHeaders } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { libraryApi } from '../../shared/api/libraryApi'
import { showErrorAlert } from '../../shared/utils/alerts'
import { buildBook, novel, poetry } from '../../test/fixtures'
import { renderHookWithStore } from '../../test/renderWithStore'
import { initialBookState } from '../slices/bookSlice'
import { initialCategoryState } from '../../categories/slices/categorySlice'
import { useBooksStore } from './useBooksStore'

vi.mock('../../shared/api/libraryApi', () => ({
  libraryApi: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))
vi.mock('../../shared/utils/alerts', () => ({
  showErrorAlert: vi.fn(),
  showSuccessToast: vi.fn(),
  confirmDanger: vi.fn(),
}))

const api = vi.mocked(libraryApi)

const axiosError = (status: number, data: unknown) =>
  new AxiosError('Request failed', String(status), undefined, undefined, {
    status,
    statusText: '',
    data,
    headers: {},
    config: { headers: new AxiosHeaders() },
  })

const preloadedState = {
  books: initialBookState,
  categories: { ...initialCategoryState, categories: [{ ...novel }, { ...poetry }] },
}

describe('useBooksStore', () => {
  beforeEach(() => vi.resetAllMocks())

  it('loads the books into the global state', async () => {
    const response = { data: [buildBook()], meta: { total: 1, category: null } }
    api.get.mockResolvedValue({ data: response })

    const { result, store } = renderHookWithStore(() => useBooksStore(), { preloadedState })
    await act(() => result.current.startLoadingBooks())

    expect(api.get).toHaveBeenCalledWith('/books')
    expect(store.getState().books.books).toHaveLength(1)
    expect(store.getState().books.allResponse).toEqual([response])
    expect(store.getState().books.isLoadingBooks).toBe(false)
  })

  it('filters by category using the query string', async () => {
    api.get.mockResolvedValue({ data: { data: [] } })

    const { result, store } = renderHookWithStore(() => useBooksStore(), { preloadedState })
    await act(() => result.current.setCategoryFilter(2))

    expect(api.get).toHaveBeenCalledWith('/books?category=2')
    expect(store.getState().books.activeCategoryFilter).toBe(2)
  })

  it('shows an alert when the backend is not available', async () => {
    api.get.mockRejectedValue(new Error('Network Error'))

    const { result, store } = renderHookWithStore(() => useBooksStore(), { preloadedState })
    await act(() => result.current.startLoadingBooks())

    expect(showErrorAlert).toHaveBeenCalledWith('NO BACKEND: Error al cargar los libros')
    expect(store.getState().books.isLoadingBooks).toBe(false)
  })

  it('creates a book and increases the category counter', async () => {
    const created = buildBook({ id: 10 })
    api.post.mockResolvedValue({ data: { data: created, message: 'ok' } })

    const { result, store } = renderHookWithStore(() => useBooksStore(), { preloadedState })
    act(() => {
      result.current.openBookForm(null)
    })

    let saveResult
    await act(async () => {
      saveResult = await result.current.startSavingBook({
        title: created.title,
        author: created.author,
        description: null,
        published_year: created.published_year,
        category_id: created.category_id,
      })
    })

    expect(saveResult).toEqual({ ok: true })
    expect(store.getState().books.books[0].id).toBe(10)
    expect(store.getState().books.isBookFormOpen).toBe(false)
    expect(store.getState().categories.categories.find((c) => c.id === novel.id)?.books_count).toBe(3)
  })

  it('updates the active book with PUT', async () => {
    const book = buildBook()
    api.put.mockResolvedValue({ data: { data: { ...book, category_id: poetry.id }, message: 'ok' } })

    const { result, store } = renderHookWithStore(() => useBooksStore(), {
      preloadedState: { ...preloadedState, books: { ...initialBookState, books: [book] } },
    })
    act(() => {
      result.current.openBookForm(book)
    })
    await act(() => result.current.startSavingBook({ ...book, category_id: poetry.id }))

    expect(api.put).toHaveBeenCalledWith('/books/1', expect.objectContaining({ category_id: poetry.id }))
    const counts = store.getState().categories.categories.map((c) => c.books_count)
    expect(counts).toEqual([1, 2])
  })

  it('returns the validation errors (422) to the form', async () => {
    api.post.mockRejectedValue(axiosError(422, { message: 'invalid', errors: { title: ['muy corto'] } }))

    const { result } = renderHookWithStore(() => useBooksStore(), { preloadedState })
    const saveResult = await act(() =>
      result.current.startSavingBook({ title: 'ab', author: 'x', description: null, published_year: 2000, category_id: 1 }),
    )

    expect(saveResult).toEqual({ ok: false, errors: { title: ['muy corto'] } })
    expect(showErrorAlert).not.toHaveBeenCalled()
  })

  it('deletes a book', async () => {
    const book = buildBook()
    api.delete.mockResolvedValue({ data: { message: 'Libro eliminado correctamente.' } })

    const { result, store } = renderHookWithStore(() => useBooksStore(), {
      preloadedState: { ...preloadedState, books: { ...initialBookState, books: [book] } },
    })
    await act(() => result.current.startDeletingBook(book))

    await waitFor(() => expect(store.getState().books.books).toHaveLength(0))
    expect(api.delete).toHaveBeenCalledWith('/books/1')
  })

  it('removes the stale book when the backend answers 404', async () => {
    const book = buildBook()
    api.delete.mockRejectedValue(axiosError(404, { message: 'El libro con id 1 no existe.' }))

    const { result, store } = renderHookWithStore(() => useBooksStore(), {
      preloadedState: { ...preloadedState, books: { ...initialBookState, books: [book] } },
    })
    await act(() => result.current.startDeletingBook(book))

    expect(store.getState().books.books).toHaveLength(0)
    expect(showErrorAlert).toHaveBeenCalledWith('El libro con id 1 no existe.')
  })
})
