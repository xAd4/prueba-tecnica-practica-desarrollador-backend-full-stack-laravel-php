import { motion } from 'motion/react'
import { Badge } from '../../../shared/components/ui/Badge/Badge'
import { theme } from '../../../shared/theme/theme'

interface VersionItemProps {
  label: string
  version: string
  isAvailable?: boolean
}

export const VersionItem = ({ label, version, isAvailable = true }: VersionItemProps) => (
  <motion.span
    style={{ display: 'inline-flex', alignItems: 'center', gap: theme.space.xs }}
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {label}
    <Badge
      color={isAvailable ? theme.colors.primary : theme.colors.textMuted}
      background={isAvailable ? theme.colors.primarySoft : theme.colors.border}
    >
      {version}
    </Badge>
  </motion.span>
)
