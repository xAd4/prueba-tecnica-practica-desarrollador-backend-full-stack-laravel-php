import type { MotionStyle, TargetAndTransition } from 'motion/react'
import { theme } from '../../../theme/theme'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md'

export const baseButtonStyle: MotionStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.sm,
  border: '1px solid transparent',
  borderRadius: theme.radii.md,
  fontFamily: theme.fonts.body,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  outline: 'none',
  lineHeight: 1.2,
}

export const buttonSizeStyles: Record<ButtonSize, MotionStyle> = {
  sm: { padding: '0.4rem 0.75rem', fontSize: theme.fontSizes.sm },
  md: { padding: '0.65rem 1.15rem', fontSize: theme.fontSizes.md },
}

export const buttonVariantStyles: Record<ButtonVariant, MotionStyle> = {
  primary: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    boxShadow: theme.shadows.sm,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    borderColor: theme.colors.border,
  },
  danger: {
    backgroundColor: theme.colors.danger,
    color: theme.colors.white,
  },
  ghost: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: theme.colors.textMuted,
  },
}

export const buttonHoverStyles: Record<ButtonVariant, TargetAndTransition> = {
  primary: { backgroundColor: theme.colors.primaryHover, y: -1 },
  secondary: { backgroundColor: theme.colors.surfaceMuted, y: -1 },
  danger: { backgroundColor: theme.colors.dangerHover, y: -1 },
  ghost: { backgroundColor: theme.colors.primarySoft, color: theme.colors.primary },
}

export const buttonTap: TargetAndTransition = { scale: 0.96 }
export const buttonFocus: TargetAndTransition = { boxShadow: theme.shadows.focus }
export const disabledButtonStyle: MotionStyle = { opacity: 0.55, cursor: 'not-allowed' }
