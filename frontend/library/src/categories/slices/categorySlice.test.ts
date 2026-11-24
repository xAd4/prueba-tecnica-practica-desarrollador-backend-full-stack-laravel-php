import { describe, expect, it } from 'vitest'
import { novel, poetry } from '../../test/fixtures'
import {
  categorySlice,
  initialCategoryState,
  onAddNewCategory,
  onAdjustCategoryBooksCount,
  onDeleteCategory,
  onLoadCategories,
  onUpdateCategory,
  type CategoryState,
} from './categorySlice'

const reducer = categorySlice.reducer
const stateWith = (overrides: Partial<CategoryState>): CategoryState => ({ ...initialCategoryState, ...overrides })

describe('categorySlice', () => {
  it('loads categories without duplicates', () => {
    const state = reducer(stateWith({ categories: [novel] }), onLoadCategories([novel, poetry]))
    expect(state.categories).toHaveLength(2)
  })

  it('adds a category keeping alphabetical order', () => {
    const state = reducer(stateWith({ categories: [novel, poetry] }), onAddNewCategory({ id: 3, name: 'Fantasía' }))
    expect(state.categories.map((c) => c.name)).toEqual(['Fantasía', 'Novela', 'Poesía'])
    expect(state.categories[0].books_count).toBe(0)
  })

  it('updates and deletes a category', () => {
    const updated = reducer(stateWith({ categories: [novel], activeCategory: novel }), onUpdateCategory({ ...novel, name: 'Ensayo' }))
    expect(updated.categories[0].name).toBe('Ensayo')
    expect(updated.activeCategory).toBeNull()

    const deleted = reducer(updated, onDeleteCategory(novel.id))
    expect(deleted.categories).toHaveLength(0)
  })

  it('adjusts the books count without going below zero', () => {
    let state = reducer(stateWith({ categories: [{ ...novel, books_count: 1 }] }), onAdjustCategoryBooksCount({ categoryId: novel.id, delta: 1 }))
    expect(state.categories[0].books_count).toBe(2)

    state = reducer(state, onAdjustCategoryBooksCount({ categoryId: novel.id, delta: -5 }))
    expect(state.categories[0].books_count).toBe(0)
  })
})
