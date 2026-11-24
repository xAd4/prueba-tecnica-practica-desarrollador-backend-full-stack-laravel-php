import type { MotionStyle } from 'motion/react'
import { theme } from '../../../theme/theme'

export const backdropStyle: MotionStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.space.md,
  backgroundColor: theme.colors.overlay,
  backdropFilter: 'blur(2px)',
}

export const dialogStyle: MotionStyle = {
  width: '100%',
  maxHeight: 'calc(100vh - 2rem)',
  overflowY: 'auto',
  boxSizing: 'border-box',
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radii.lg,
  boxShadow: theme.shadows.lg,
}

export const headerStyle: MotionStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.md,
  padding: `${theme.space.lg} ${theme.space.lg} ${theme.space.md}`,
  borderBottom: `1px solid ${theme.colors.border}`,
}

export const titleStyle: MotionStyle = {
  margin: 0,
  fontFamily: theme.fonts.heading,
  fontSize: theme.fontSizes.lg,
  color: theme.colors.text,
}

export const bodyStyle: MotionStyle = {
  padding: theme.space.lg,
}

export const dialogAnimation = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
}
