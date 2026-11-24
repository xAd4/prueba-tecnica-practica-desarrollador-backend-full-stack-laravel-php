import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CategoriesResponse, Category } from '../types/category.types'

export interface CategoryState {
  isLoadingCategories: boolean
  isSavingCategory: boolean
  categories: Category[]
  allResponse: CategoriesResponse[]
  activeCategory: Category | null
}

export const initialCategoryState: CategoryState = {
  isLoadingCategories: false,
  isSavingCategory: false,
  categories: [],
  allResponse: [],
  activeCategory: null,
}

const sortByName = (categories: Category[]) =>
  categories.sort((a, b) => a.name.localeCompare(b.name, 'es'))

export const categorySlice = createSlice({
  name: 'category',
  initialState: initialCategoryState,
  reducers: {
    onStartLoadingCategories: (state) => {
      state.isLoadingCategories = true
    },
    onStartSavingCategory: (state) => {
      state.isSavingCategory = true
    },
    onFinishSavingCategory: (state) => {
      state.isSavingCategory = false
    },
    onSetActiveCategory: (state, { payload }: PayloadAction<Category | null>) => {
      state.activeCategory = payload
    },
    onLoadCategories: (state, { payload = [] }: PayloadAction<Category[]>) => {
      state.isLoadingCategories = false
      payload.forEach((category) => {
        const exists = state.categories.some((dbCategory) => dbCategory.id === category.id)
        if (!exists) state.categories.push(category)
      })
    },
    onLoadAllResponseOfCategoriesSinceBackend: (
      state,
      { payload = [] }: PayloadAction<CategoriesResponse[]>,
    ) => {
      state.isLoadingCategories = false
      state.allResponse = payload
    },
    onAddNewCategory: (state, { payload }: PayloadAction<Category>) => {
      state.categories.push({ ...payload, books_count: payload.books_count ?? 0 })
      sortByName(state.categories)
      state.activeCategory = null
      state.isSavingCategory = false
    },
    onUpdateCategory: (state, { payload }: PayloadAction<Category>) => {
      state.categories = sortByName(
        state.categories.map((category) => (category.id === payload.id ? payload : category)),
      )
      state.activeCategory = null
      state.isSavingCategory = false
    },
    onDeleteCategory: (state, { payload: idToDelete }: PayloadAction<number>) => {
      state.categories = state.categories.filter((category) => category.id !== idToDelete)
      if (state.activeCategory?.id === idToDelete) state.activeCategory = null
    },
    /** Keeps `books_count` in sync when books are created, moved or deleted. */
    onAdjustCategoryBooksCount: (
      state,
      { payload }: PayloadAction<{ categoryId: number; delta: number }>,
    ) => {
      const category = state.categories.find((c) => c.id === payload.categoryId)
      if (!category) return
      category.books_count = Math.max(0, (category.books_count ?? 0) + payload.delta)
    },
    clearCategories: (state) => {
      state.categories = []
      state.allResponse = []
      state.activeCategory = null
      state.isLoadingCategories = false
    },
  },
})

export const {
  onStartLoadingCategories,
  onStartSavingCategory,
  onFinishSavingCategory,
  onSetActiveCategory,
  onLoadCategories,
  onLoadAllResponseOfCategoriesSinceBackend,
  onAddNewCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAdjustCategoryBooksCount,
  clearCategories,
} = categorySlice.actions
