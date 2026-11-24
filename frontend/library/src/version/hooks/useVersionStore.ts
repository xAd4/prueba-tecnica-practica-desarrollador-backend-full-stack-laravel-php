import { useAppDispatch, useAppSelector } from '../../app/store/hooks'
import { libraryApi } from '../../shared/api/libraryApi'
import {
  onLoadAllResponseOfVersionSinceBackend,
  onLoadBackendVersion,
  onStartLoadingVersion,
} from '../slices/versionSlice'
import type { BackendVersionResponse } from '../types/version.types'

/**
 * Call to the /version API. Updates the global Redux state (versionSlice)
 * with the version of the backend image.
 */
export const useVersionStore = () => {
  const dispatch = useAppDispatch()
  const { frontendVersion, backendVersion, isLoadingVersion, allResponse } = useAppSelector(
    (state) => state.version,
  )

  const startLoadingBackendVersion = async (): Promise<void> => {
    try {
      dispatch(onStartLoadingVersion())
      const { data } = await libraryApi.get<BackendVersionResponse>('/version')
      dispatch(onLoadBackendVersion(data.data.version))
      dispatch(onLoadAllResponseOfVersionSinceBackend([data]))
    } catch {
      // Non-critical information: no alert, the legend shows "no disponible".
      dispatch(onLoadBackendVersion(null))
    }
  }

  return {
    // Properties
    frontendVersion,
    backendVersion,
    isLoadingVersion,
    allResponse,

    // Methods
    startLoadingBackendVersion,
  }
}
