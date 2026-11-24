import { motion, type MotionStyle } from 'motion/react'
import type { ReactNode } from 'react'
import { theme } from '../../../theme/theme'

const badgeStyle: MotionStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.space.xs,
  padding: '0.15rem 0.6rem',
  borderRadius: theme.radii.pill,
  fontSize: theme.fontSizes.xs,
  fontWeight: 600,
  whiteSpace: 'nowrap',
}

interface BadgeProps {
  children: ReactNode
  color?: string
  background?: string
}

export const Badge = ({
  children,
  color = theme.colors.primary,
  background = theme.colors.primarySoft,
}: BadgeProps) => (
  <motion.span style={{ ...badgeStyle, color, backgroundColor: background }}>{children}</motion.span>
)
