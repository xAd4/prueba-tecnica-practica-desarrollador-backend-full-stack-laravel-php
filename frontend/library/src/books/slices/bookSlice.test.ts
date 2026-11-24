import { describe, expect, it } from 'vitest'
import { onUpdateCategory } from '../../categories/slices/categorySlice'
import { buildBook, poetry } from '../../test/fixtures'
import {
  bookSlice,
  clearBooks,
  initialBookState,
  onAddNewBook,
  onCloseBookForm,
  onDeleteBook,
  onLoadBooks,
  onOpenBookForm,
  onSetCategoryFilter,
  onStartLoadingBooks,
  onUpdateBook,
  type BookState,
} from './bookSlice'

const reducer = bookSlice.reducer
const stateWith = (overrides: Partial<BookState>): BookState => ({ ...initialBookState, ...overrides })

describe('bookSlice', () => {
  it('starts loading', () => {
    expect(reducer(initialBookState, onStartLoadingBooks()).isLoadingBooks).toBe(true)
  })

  it('loads books without duplicating them', () => {
    const book = buildBook()
    const state = reducer(stateWith({ books: [book], isLoadingBooks: true }), onLoadBooks([book, buildBook({ id: 2 })]))

    expect(state.books.map((b) => b.id)).toEqual([1, 2])
    expect(state.isLoadingBooks).toBe(false)
  })

  it('adds a new book at the beginning when it matches the active filter', () => {
    const state = reducer(stateWith({ books: [buildBook()] }), onAddNewBook(buildBook({ id: 2 })))
    expect(state.books.map((b) => b.id)).toEqual([2, 1])
  })

  it('does not show a new book that belongs to another filtered category', () => {
    const state = reducer(
      stateWith({ activeCategoryFilter: poetry.id }),
      onAddNewBook(buildBook({ id: 2, category_id: 1 })),
    )
    expect(state.books).toHaveLength(0)
  })

  it('updates a book and removes it when it leaves the filtered category', () => {
    const book = buildBook()
    const updated = reducer(stateWith({ books: [book] }), onUpdateBook({ ...book, title: 'Nuevo' }))
    expect(updated.books[0].title).toBe('Nuevo')

    const moved = reducer(
      stateWith({ books: [book], activeCategoryFilter: book.category_id }),
      onUpdateBook({ ...book, category_id: poetry.id }),
    )
    expect(moved.books).toHaveLength(0)
  })

  it('deletes a book and clears it if it was active', () => {
    const book = buildBook()
    const state = reducer(stateWith({ books: [book], activeBook: book }), onDeleteBook(book.id))

    expect(state.books).toHaveLength(0)
    expect(state.activeBook).toBeNull()
  })

  it('opens and closes the form', () => {
    const book = buildBook()
    const opened = reducer(initialBookState, onOpenBookForm(book))
    expect(opened.isBookFormOpen).toBe(true)
    expect(opened.activeBook).toEqual(book)

    const closed = reducer(opened, onCloseBookForm())
    expect(closed.isBookFormOpen).toBe(false)
    expect(closed.activeBook).toBeNull()
  })

  it('keeps the category filter when clearing the books', () => {
    const state = reducer(
      reducer(stateWith({ books: [buildBook()] }), onSetCategoryFilter(3)),
      clearBooks(),
    )
    expect(state.books).toHaveLength(0)
    expect(state.activeCategoryFilter).toBe(3)
  })

  it('renames the embedded category when the category is updated', () => {
    const state = reducer(stateWith({ books: [buildBook()] }), onUpdateCategory({ id: 1, name: 'Novela negra' }))
    expect(state.books[0].category?.name).toBe('Novela negra')
  })
})
