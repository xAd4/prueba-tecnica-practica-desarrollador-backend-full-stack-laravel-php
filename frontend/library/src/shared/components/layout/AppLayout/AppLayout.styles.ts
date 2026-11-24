import type { MotionStyle } from 'motion/react'
import { theme } from '../../../theme/theme'

export const headerStyle: MotionStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backgroundColor: 'rgba(245, 242, 236, 0.9)',
  backdropFilter: 'blur(8px)',
  borderBottom: `1px solid ${theme.colors.border}`,
}

export const headerInnerStyle: MotionStyle = {
  maxWidth: theme.layout.maxWidth,
  margin: '0 auto',
  padding: `${theme.space.md} ${theme.space.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.md,
}

export const logoStyle: MotionStyle = {
  display: 'grid',
  placeItems: 'center',
  width: 40,
  height: 40,
  borderRadius: theme.radii.md,
  backgroundColor: theme.colors.primary,
  color: theme.colors.white,
  fontSize: '1.3rem',
}

export const brandTitleStyle: MotionStyle = {
  margin: 0,
  fontFamily: theme.fonts.heading,
  fontSize: theme.fontSizes.lg,
}

export const brandSubtitleStyle: MotionStyle = {
  margin: 0,
  fontSize: theme.fontSizes.xs,
  color: theme.colors.textMuted,
}

export const footerStyle: MotionStyle = {
  maxWidth: theme.layout.maxWidth,
  margin: '0 auto',
  padding: `${theme.space.lg} ${theme.space.lg} ${theme.space.xl}`,
  borderTop: `1px solid ${theme.colors.border}`,
}

export const mainStyle: MotionStyle = {
  maxWidth: theme.layout.maxWidth,
  margin: '0 auto',
  padding: `${theme.space.xl} ${theme.space.lg} ${theme.space.xxl}`,
}
