import type { MotionStyle } from 'motion/react'
import { theme } from '../../../shared/theme/theme'

export const legendStyle: MotionStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: theme.space.sm,
  fontSize: theme.fontSizes.xs,
  color: theme.colors.textMuted,
}

export const separatorStyle: MotionStyle = {
  opacity: 0.5,
}
