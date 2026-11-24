import type { MotionStyle, TargetAndTransition } from 'motion/react'
import { theme } from '../../../shared/theme/theme'

export const cardStyle: MotionStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.sm,
  padding: `${theme.space.lg} ${theme.space.lg} ${theme.space.md} calc(${theme.space.lg} + 6px)`,
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.lg,
  boxShadow: theme.shadows.sm,
  overflow: 'hidden',
}

export const cardHover: TargetAndTransition = {
  y: -4,
  boxShadow: theme.shadows.md,
}

/** Colored "book spine" on the left edge, one color per category. */
export const spineStyle: MotionStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  width: 6,
}

export const headerStyle: MotionStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.sm,
  flexWrap: 'wrap',
}

export const titleStyle: MotionStyle = {
  margin: 0,
  fontFamily: theme.fonts.heading,
  fontSize: theme.fontSizes.lg,
  lineHeight: 1.25,
  color: theme.colors.text,
}

export const authorStyle: MotionStyle = {
  margin: 0,
  fontSize: theme.fontSizes.sm,
  color: theme.colors.textMuted,
}

export const descriptionStyle: MotionStyle = {
  margin: 0,
  fontSize: theme.fontSizes.sm,
  color: theme.colors.text,
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}

export const emptyDescriptionStyle: MotionStyle = {
  ...descriptionStyle,
  color: theme.colors.textMuted,
  fontStyle: 'italic',
}

export const footerStyle: MotionStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.space.xs,
  marginTop: 'auto',
  paddingTop: theme.space.sm,
  borderTop: `1px solid ${theme.colors.border}`,
}

export const cardAnimation = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
}
