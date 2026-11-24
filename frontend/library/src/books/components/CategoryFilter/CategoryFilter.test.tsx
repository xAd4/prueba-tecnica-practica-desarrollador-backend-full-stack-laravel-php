import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { initialCategoryState } from '../../../categories/slices/categorySlice'
import { libraryApi } from '../../../shared/api/libraryApi'
import { novel, poetry } from '../../../test/fixtures'
import { renderWithStore } from '../../../test/renderWithStore'
import { initialBookState } from '../../slices/bookSlice'
import { CategoryFilter } from './CategoryFilter'

vi.mock('../../../shared/api/libraryApi', () => ({
  libraryApi: { get: vi.fn() },
}))

describe('CategoryFilter', () => {
  it('renders one chip per category plus "Todas" with the total of books', () => {
    renderWithStore(<CategoryFilter />, {
      preloadedState: {
        books: initialBookState,
        categories: { ...initialCategoryState, categories: [novel, poetry] },
      },
    })

    expect(screen.getByRole('button', { name: /todas\s*3/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /novela/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /poesía/i })).toBeInTheDocument()
  })

  it('filters the books by the selected category', async () => {
    vi.mocked(libraryApi.get).mockResolvedValue({ data: { data: [] } })
    const { store } = renderWithStore(<CategoryFilter />, {
      preloadedState: {
        books: initialBookState,
        categories: { ...initialCategoryState, categories: [novel, poetry] },
      },
    })

    await userEvent.click(screen.getByRole('button', { name: /poesía/i }))

    expect(libraryApi.get).toHaveBeenCalledWith('/books?category=2')
    expect(store.getState().books.activeCategoryFilter).toBe(poetry.id)
    expect(screen.getByRole('button', { name: /poesía/i })).toHaveAttribute('aria-pressed', 'true')
  })
})
