import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { novel, poetry } from '../../../test/fixtures'
import { emptyBookFormValues } from '../../utils/bookForm'
import { BookForm } from './BookForm'

const renderForm = (onSubmit = vi.fn().mockResolvedValue({ ok: true })) => {
  render(
    <BookForm
      initialValues={emptyBookFormValues}
      categories={[novel, poetry]}
      isSaving={false}
      submitLabel="Crear libro"
      onSubmit={onSubmit}
      onCancel={vi.fn()}
    />,
  )
  return onSubmit
}

describe('BookForm', () => {
  it('shows the client validation errors and does not submit', async () => {
    const onSubmit = renderForm()

    await userEvent.type(screen.getByLabelText(/título/i), 'ab')
    await userEvent.click(screen.getByRole('button', { name: 'Crear libro' }))

    expect(await screen.findByText('El título debe tener al menos 3 caracteres.')).toBeInTheDocument()
    expect(screen.getByText('El autor es obligatorio.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits the payload with the right types', async () => {
    const onSubmit = renderForm()

    await userEvent.type(screen.getByLabelText(/título/i), 'Dune')
    await userEvent.type(screen.getByLabelText(/autor/i), 'Frank Herbert')
    await userEvent.type(screen.getByLabelText(/año de publicación/i), '1965')
    await userEvent.selectOptions(screen.getByLabelText(/categoría/i), String(poetry.id))
    await userEvent.click(screen.getByRole('button', { name: 'Crear libro' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Dune',
      author: 'Frank Herbert',
      description: null,
      published_year: 1965,
      category_id: poetry.id,
    })
  })

  it('shows the validation errors returned by the backend', async () => {
    renderForm(vi.fn().mockResolvedValue({ ok: false, errors: { title: ['Título repetido en el servidor'] } }))

    await userEvent.type(screen.getByLabelText(/título/i), 'Dune')
    await userEvent.type(screen.getByLabelText(/autor/i), 'Frank Herbert')
    await userEvent.type(screen.getByLabelText(/año de publicación/i), '1965')
    await userEvent.selectOptions(screen.getByLabelText(/categoría/i), String(novel.id))
    await userEvent.click(screen.getByRole('button', { name: 'Crear libro' }))

    expect(await screen.findByText('Título repetido en el servidor')).toBeInTheDocument()
  })
})
