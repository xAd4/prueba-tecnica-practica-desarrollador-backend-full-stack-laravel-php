import { act } from '@testing-library/react'
import { AxiosError, AxiosHeaders } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { libraryApi } from '../../shared/api/libraryApi'
import { showErrorAlert } from '../../shared/utils/alerts'
import { novel, poetry } from '../../test/fixtures'
import { renderHookWithStore } from '../../test/renderWithStore'
import { initialCategoryState } from '../slices/categorySlice'
import { useCategoriesStore } from './useCategoriesStore'

vi.mock('../../shared/api/libraryApi', () => ({
  libraryApi: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))
vi.mock('../../shared/utils/alerts', () => ({
  showErrorAlert: vi.fn(),
  showSuccessToast: vi.fn(),
  confirmDanger: vi.fn(),
}))

const api = vi.mocked(libraryApi)

const conflict = () =>
  new AxiosError('Conflict', '409', undefined, undefined, {
    status: 409,
    statusText: 'Conflict',
    data: { message: 'No se puede eliminar la categoría "Novela" porque tiene libros asociados.' },
    headers: {},
    config: { headers: new AxiosHeaders() },
  })

describe('useCategoriesStore', () => {
  beforeEach(() => vi.resetAllMocks())

  it('loads the categories', async () => {
    api.get.mockResolvedValue({ data: { data: [novel, poetry] } })

    const { result, store } = renderHookWithStore(() => useCategoriesStore())
    await act(() => result.current.startLoadingCategories())

    expect(api.get).toHaveBeenCalledWith('/categories')
    expect(store.getState().categories.categories).toHaveLength(2)
  })

  it('creates a category when there is no active one', async () => {
    api.post.mockResolvedValue({ data: { data: { id: 3, name: 'Ensayo', books_count: 0 } } })

    const { result, store } = renderHookWithStore(() => useCategoriesStore())
    const saveResult = await act(() => result.current.startSavingCategory({ name: 'Ensayo' }))

    expect(saveResult).toEqual({ ok: true })
    expect(store.getState().categories.categories[0].name).toBe('Ensayo')
  })

  it('updates the active category', async () => {
    api.put.mockResolvedValue({ data: { data: { ...novel, name: 'Novela negra' } } })

    const { result, store } = renderHookWithStore(() => useCategoriesStore(), {
      preloadedState: { categories: { ...initialCategoryState, categories: [novel], activeCategory: novel } },
    })
    await act(() => result.current.startSavingCategory({ name: 'Novela negra' }))

    expect(api.put).toHaveBeenCalledWith('/categories/1', { name: 'Novela negra' })
    expect(store.getState().categories.categories[0].name).toBe('Novela negra')
  })

  it('does not delete a category with books (409)', async () => {
    api.delete.mockRejectedValue(conflict())

    const { result, store } = renderHookWithStore(() => useCategoriesStore(), {
      preloadedState: { categories: { ...initialCategoryState, categories: [novel] } },
    })
    const deleted = await act(() => result.current.startDeletingCategory(novel))

    expect(deleted).toBe(false)
    expect(store.getState().categories.categories).toHaveLength(1)
    expect(showErrorAlert).toHaveBeenCalledWith(
      'No se puede eliminar la categoría "Novela" porque tiene libros asociados.',
      'No se puede eliminar',
    )
  })
})
