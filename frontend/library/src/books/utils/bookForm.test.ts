import { describe, expect, it } from 'vitest'
import { buildBook } from '../../test/fixtures'
import type { BookFormValues } from '../types/book.types'
import { toBookFormErrors, toBookFormValues, toBookPayload, validateBook } from './bookForm'

const validValues: BookFormValues = {
  title: 'Dune',
  author: 'Frank Herbert',
  description: '',
  published_year: '1965',
  category_id: '1',
}

describe('validateBook', () => {
  it('accepts valid values', () => {
    expect(validateBook(validValues, 2026)).toEqual({})
  })

  it('requires the mandatory fields', () => {
    const errors = validateBook({ title: '', author: '', description: '', published_year: '', category_id: '' }, 2026)
    expect(Object.keys(errors).sort()).toEqual(['author', 'category_id', 'published_year', 'title'])
  })

  it('requires at least three characters in the title', () => {
    expect(validateBook({ ...validValues, title: ' ab ' }, 2026).title).toMatch(/al menos 3/)
  })

  it('rejects invalid years', () => {
    expect(validateBook({ ...validValues, published_year: '19a5' }, 2026).published_year).toBeDefined()
    expect(validateBook({ ...validValues, published_year: '999' }, 2026).published_year).toBeDefined()
    expect(validateBook({ ...validValues, published_year: '2027' }, 2026).published_year).toBeDefined()
  })
})

describe('book form mappers', () => {
  it('converts form values into the API payload', () => {
    expect(toBookPayload({ ...validValues, title: '  Dune ' })).toEqual({
      title: 'Dune',
      author: 'Frank Herbert',
      description: null,
      published_year: 1965,
      category_id: 1,
    })
  })

  it('builds form values from a book or from the default category', () => {
    expect(toBookFormValues(buildBook()).published_year).toBe('1967')
    expect(toBookFormValues(null, 4).category_id).toBe('4')
    expect(toBookFormValues(null).category_id).toBe('')
  })

  it('keeps the first Laravel message of each known field', () => {
    expect(toBookFormErrors({ title: ['Uno', 'Dos'], unknown: ['x'] })).toEqual({ title: 'Uno' })
  })
})
