import { motion } from 'motion/react'
import { useEffect } from 'react'
import { useVersionStore } from '../../hooks/useVersionStore'
import { formatVersion } from '../../utils/frontendVersion'
import { legendStyle, separatorStyle } from './VersionLegend.styles'
import { VersionItem } from './VersionItem'

/** Shows the versions of the frontend and backend images published on Docker Hub. */
export const VersionLegend = () => {
  const { frontendVersion, backendVersion, isLoadingVersion, startLoadingBackendVersion } = useVersionStore()

  useEffect(() => {
    void startLoadingBackendVersion()
    // Load the backend version only once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const backendLabel = isLoadingVersion ? '...' : backendVersion ? formatVersion(backendVersion) : 'no disponible'

  return (
    <motion.p style={legendStyle} aria-label="Versiones de la aplicación">
      <VersionItem label="Frontend" version={formatVersion(frontendVersion)} />
      <motion.span aria-hidden="true" style={separatorStyle}>
        ·
      </motion.span>
      <VersionItem label="Backend" version={backendLabel} isAvailable={Boolean(backendVersion)} />
    </motion.p>
  )
}
