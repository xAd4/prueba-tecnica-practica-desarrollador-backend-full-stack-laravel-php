import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { libraryApi } from '../../../shared/api/libraryApi'
import { renderWithStore } from '../../../test/renderWithStore'
import { initialVersionState } from '../../slices/versionSlice'
import { formatVersion } from '../../utils/frontendVersion'
import { VersionLegend } from './VersionLegend'

vi.mock('../../../shared/api/libraryApi', () => ({
  libraryApi: { get: vi.fn() },
}))

const api = vi.mocked(libraryApi)

describe('VersionLegend', () => {
  beforeEach(() => vi.resetAllMocks())

  it('shows the frontend version and the backend version returned by /version', async () => {
    api.get.mockResolvedValue({ data: { data: { name: 'Library API', version: '1.0.7' } } })

    const { store } = renderWithStore(<VersionLegend />, {
      preloadedState: { version: { ...initialVersionState, frontendVersion: '1.0.7' } },
    })

    await waitFor(() => expect(screen.getAllByText('v1.0.7')).toHaveLength(2))
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(api.get).toHaveBeenCalledWith('/version')
    expect(store.getState().version.backendVersion).toBe('1.0.7')
  })

  it('shows "no disponible" when the backend cannot be reached', async () => {
    api.get.mockRejectedValue(new Error('Network Error'))

    renderWithStore(<VersionLegend />)

    expect(await screen.findByText('no disponible')).toBeInTheDocument()
  })
})

describe('formatVersion', () => {
  it('prefixes numeric versions with "v"', () => {
    expect(formatVersion('1.0.7')).toBe('v1.0.7')
    expect(formatVersion('dev')).toBe('dev')
    expect(formatVersion(null)).toBe('—')
  })
})
