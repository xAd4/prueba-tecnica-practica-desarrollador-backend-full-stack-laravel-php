import type { MotionStyle } from 'motion/react'
import { theme } from '../../../shared/theme/theme'

export const formStyle: MotionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,
}

export const rowStyle: MotionStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: theme.space.md,
}

export const actionsStyle: MotionStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
  gap: theme.space.sm,
  marginTop: theme.space.sm,
}
