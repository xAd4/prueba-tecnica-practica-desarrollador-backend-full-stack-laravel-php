import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { onUpdateCategory } from '../../categories/slices/categorySlice'
import type { Book, BooksResponse } from '../types/book.types'

export interface BookState {
  isLoadingBooks: boolean
  isSavingBook: boolean
  isBookFormOpen: boolean
  books: Book[]
  allResponse: BooksResponse[]
  activeBook: Book | null
  /** `null` means "all categories". */
  activeCategoryFilter: number | null
}

export const initialBookState: BookState = {
  isLoadingBooks: false,
  isSavingBook: false,
  isBookFormOpen: false,
  books: [],
  allResponse: [],
  activeBook: null,
  activeCategoryFilter: null,
}

const matchesFilter = (state: BookState, book: Book) =>
  state.activeCategoryFilter === null || book.category_id === state.activeCategoryFilter

export const bookSlice = createSlice({
  name: 'book',
  initialState: initialBookState,
  reducers: {
    onStartLoadingBooks: (state) => {
      state.isLoadingBooks = true
    },
    onStartSavingBook: (state) => {
      state.isSavingBook = true
    },
    onFinishSavingBook: (state) => {
      state.isSavingBook = false
    },
    onSetActiveBook: (state, { payload }: PayloadAction<Book | null>) => {
      state.activeBook = payload
    },
    /** Opens the form: with a book to edit it or with `null` to create one. */
    onOpenBookForm: (state, { payload }: PayloadAction<Book | null>) => {
      state.activeBook = payload
      state.isBookFormOpen = true
    },
    onCloseBookForm: (state) => {
      state.activeBook = null
      state.isBookFormOpen = false
      state.isSavingBook = false
    },
    onSetCategoryFilter: (state, { payload }: PayloadAction<number | null>) => {
      state.activeCategoryFilter = payload
    },
    onLoadBooks: (state, { payload = [] }: PayloadAction<Book[]>) => {
      state.isLoadingBooks = false
      payload.forEach((book) => {
        const exists = state.books.some((dbBook) => dbBook.id === book.id)
        if (!exists) state.books.push(book)
      })
    },
    onLoadAllResponseOfBooksSinceBackend: (state, { payload = [] }: PayloadAction<BooksResponse[]>) => {
      state.isLoadingBooks = false
      state.allResponse = payload
    },
    onAddNewBook: (state, { payload }: PayloadAction<Book>) => {
      // Only show it if it belongs to the category currently filtered.
      if (matchesFilter(state, payload)) state.books.unshift(payload)
      state.activeBook = null
      state.isSavingBook = false
    },
    onUpdateBook: (state, { payload }: PayloadAction<Book>) => {
      state.books = matchesFilter(state, payload)
        ? state.books.map((book) => (book.id === payload.id ? payload : book))
        : state.books.filter((book) => book.id !== payload.id)
      state.activeBook = null
      state.isSavingBook = false
    },
    onDeleteBook: (state, { payload: idToDelete }: PayloadAction<number>) => {
      state.books = state.books.filter((book) => book.id !== idToDelete)
      if (state.activeBook?.id === idToDelete) state.activeBook = null
    },
    clearBooks: (state) => {
      state.books = []
      state.allResponse = []
      state.activeBook = null
      state.isLoadingBooks = false
    },
  },
  extraReducers: (builder) => {
    // RELACIONES: keep the embedded category name in sync when it is renamed.
    builder.addCase(onUpdateCategory, (state, { payload }) => {
      state.books.forEach((book) => {
        if (book.category_id === payload.id) {
          book.category = { id: payload.id, name: payload.name }
        }
      })
    })
  },
})

export const {
  onStartLoadingBooks,
  onStartSavingBook,
  onFinishSavingBook,
  onSetActiveBook,
  onOpenBookForm,
  onCloseBookForm,
  onSetCategoryFilter,
  onLoadBooks,
  onLoadAllResponseOfBooksSinceBackend,
  onAddNewBook,
  onUpdateBook,
  onDeleteBook,
  clearBooks,
} = bookSlice.actions
