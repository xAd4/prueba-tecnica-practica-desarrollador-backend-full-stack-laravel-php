import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { FRONTEND_VERSION } from '../utils/frontendVersion'
import type { BackendVersionResponse } from '../types/version.types'

export interface VersionState {
  isLoadingVersion: boolean
  frontendVersion: string
  /** `null` while loading or when the backend is not reachable. */
  backendVersion: string | null
  allResponse: BackendVersionResponse[]
}

export const initialVersionState: VersionState = {
  isLoadingVersion: false,
  frontendVersion: FRONTEND_VERSION,
  backendVersion: null,
  allResponse: [],
}

export const versionSlice = createSlice({
  name: 'version',
  initialState: initialVersionState,
  reducers: {
    onStartLoadingVersion: (state) => {
      state.isLoadingVersion = true
    },
    onLoadBackendVersion: (state, { payload }: PayloadAction<string | null>) => {
      state.isLoadingVersion = false
      state.backendVersion = payload
    },
    onLoadAllResponseOfVersionSinceBackend: (
      state,
      { payload = [] }: PayloadAction<BackendVersionResponse[]>,
    ) => {
      state.isLoadingVersion = false
      state.allResponse = payload
    },
  },
})

export const { onStartLoadingVersion, onLoadBackendVersion, onLoadAllResponseOfVersionSinceBackend } =
  versionSlice.actions
