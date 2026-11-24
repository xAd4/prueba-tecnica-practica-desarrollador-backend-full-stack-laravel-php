import type { MotionStyle, TargetAndTransition } from 'motion/react'
import { theme } from '../../../theme/theme'

export const fieldStyle: MotionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xs,
  minWidth: 0,
}

export const labelStyle: MotionStyle = {
  fontSize: theme.fontSizes.sm,
  fontWeight: 600,
  color: theme.colors.text,
}

export const requiredMarkStyle: MotionStyle = {
  color: theme.colors.danger,
  marginLeft: '2px',
}

export const errorTextStyle: MotionStyle = {
  margin: 0,
  fontSize: theme.fontSizes.xs,
  color: theme.colors.danger,
}

export const controlStyle: MotionStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.6rem 0.8rem',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.md,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes.md,
  outline: 'none',
}

export const invalidControlStyle: MotionStyle = {
  borderColor: theme.colors.danger,
  backgroundColor: theme.colors.dangerSoft,
}

export const textAreaStyle: MotionStyle = {
  resize: 'vertical',
  minHeight: '96px',
}

export const controlFocus: TargetAndTransition = {
  borderColor: theme.colors.primary,
  boxShadow: theme.shadows.focus,
}
